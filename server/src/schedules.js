const schedule = require('node-schedule')

const { User, CompetitionHistory, Round, Practice } = require('./models')
const { Op } = require('sequelize')

const ruleUpdateRating = new schedule.RecurrenceRule()
ruleUpdateRating.hour = [4, 16]
ruleUpdateRating.minute = 0
ruleUpdateRating.second = 0

const rulePractice = new schedule.RecurrenceRule()
rulePractice.hour = [0, 15]
rulePractice.minute = 0
rulePractice.second = 0

module.exports = {
  data: null,
  delta: null,
  getRank () {
    let rank = 0
    let prev = null
    for (const history of this.data) {
      if (history.score !== prev) history.rank = ++rank
      else history.rank = rank
      prev = history.score
    }
  },
  getRi (i, mi) {
    let l = -10000
    let r = 10000
    let ans = mi
    while (l < r - 1e-6) {
      const mid = (l + r) / 2
      const seedi = this.getSeedi(i, mid)
      if (seedi < mi - 1e-6) r = mid
      else if (Math.abs(seedi - mi) < 1e-6) {
        ans = mid
        break
      } else l = mid
    }
    return Math.round(ans)
  },
  getSeedi (i, ri) {
    let seedi = 1
    for (let j = 0; j < this.data.length; j++) {
      const rj = this.data[j].prev_rating === -1 ? 1500 : this.data[j].prev_rating
      if (i !== j) seedi += 1.0 / (1.0 + Math.pow(10, (ri - rj) / 400))
    }
    return seedi
  },
  async save () {
    const _this = this
    async function forSave (index) {
      if (index < 0) return
      await forSave(index - 1)

      const ri = _this.data[index].prev_rating === -1 ? 1500 : _this.data[index].prev_rating
      _this.data[index].post_rating = Math.round(ri + _this.delta[index])
      await _this.data[index].save()

      // update user rating
      const user = await User.findOne({
        where: {
          id: _this.data[index].participant_id
        }
      })
      user.rating = _this.data[index].post_rating
      await user.save()
    }
    await forSave(this.data.length - 1)
  },
  adjustRating (sumdi) {
    const inc = (-1 - sumdi) / this.data.length
    sumdi = 0
    for (let i = 0; i < this.delta.length; i++) {
      this.delta[i] += inc
      sumdi += this.delta[i]
    }
    for (let i = 0; i < this.delta.length; i++) {
      if (sumdi === 0) break
      if (sumdi < 0) {
        this.delta[i] += 1
        sumdi += 1
      } else {
        this.delta[i] -= 1
        sumdi -= 1
      }
    }
  },
  async updateSingle (roundNo) {
    console.log('updating: ', roundNo)

    CompetitionHistory.belongsTo(User, {
      foreignKey: 'participant_id',
      targetKey: 'id'
    })
    this.data = await CompetitionHistory.findAll({
      include: {
        model: User
      },
      where: {
        round_no: roundNo,
        type_progress: {
          [Op.between]: [1.0 - 1e-6, 1.0 + 1e-6]
        }
      },
      order: [['score', 'DESC']] // null 值在后面
    })
    this.delta = new Array(this.data.length)

    if (this.data.length === 0) return

    this.getRank()

    // https://www.luogu.com.cn/blog/ak-ioi/cf-at-rating
    let sumdi = 0
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].prev_rating = this.data[i].User.rating
      const ri = this.data[i].prev_rating === -1 ? 1500 : this.data[i].prev_rating
      const mi = Math.sqrt(this.getSeedi(i, ri) * this.data[i].rank)

      this.delta[i] = (this.getRi(i, mi) - ri) / 2
      sumdi += this.delta[i]
    }
    this.adjustRating(sumdi)

    await this.save()

    // 没有打完字的选手
    this.data = await CompetitionHistory.findAll({
      include: {
        model: User
      },
      where: {
        round_no: roundNo,
        score: {
          [Op.is]: null
        }
      }
    })
    this.delta = new Array(this.data.length)

    for (let i = 0; i < this.data.length; i++) {
      this.data[i].prev_rating = this.data[i].User.rating
      const ri = this.data[i].prev_rating === -1 ? 1500 : this.data[i].prev_rating
      this.delta[i] = -40.0 * (1.0 + ri / 10000)
    }

    await this.save()
  },
  async updateRating () {
    Round.hasMany(CompetitionHistory, {
      foreignKey: 'round_no',
      targetKey: 'round_no'
    })
    const rounds = await Round.findAll({
      include: {
        model: CompetitionHistory,
        where: {
          post_rating: { // 找出所有未计分的比赛
            [Op.is]: null
          }
        }
      },
      group: ['round_no'],
    })

    rounds.sort(function (a, b) {
      return (new Date(a.start_time)).getTime() - (new Date(b.start_time)).getTime()
        + a.duration * 60000 - b.duration * 60000
    })

    const _this = this
    async function forRounds (index) {
      if (index < 0) return
      await forRounds(index - 1)

      const round = rounds[index]
      // 比赛结束才计算 rating
      if ((new Date()).getTime() > (new Date(round.start_time)).getTime() +
          round.duration * 60000) {
        await _this.updateSingle(round.round_no)
      }
    }
    await forRounds(rounds.length - 1)
  },
  async clone (round, index) {
    if ((new Date()).getTime() <= (new Date(round.start_time)).getTime() +
      round.duration * 60000) return

    const admin = await User.findOne({
      where: {
        user_name: 'admin',
        status: 'admin'
      }
    })

    let practice = await Practice.findOne({
      where: {
        content_id: round.content_id,
        practice_name: `${round.round_name}(practice)`,
        writer_id: admin.id
      }
    })
    if (practice) return

    await Practice.create({
      practice_name: `${round.round_name}(practice)`,
      content_id: round.content_id,
      publish_time: Date.parse(new Date()),
      writer_id: admin.id
    })
  },
  async contestToPractice () {
    const rounds = await Round.findAll({
      where: {}
    })
    await Promise.all(rounds.map(this.clone))
  },
  scheduleUpdateRating () {
    schedule.scheduleJob(ruleUpdateRating, async () => {
      await this.updateRating()
    })
    schedule.scheduleJob(rulePractice, async () => {
      await this.contestToPractice()
    })
  }
}
