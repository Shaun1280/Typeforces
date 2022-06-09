const schedule = require('node-schedule')

const { User, CompetitionHistory, Round } = require('./models')
const { Op } = require('sequelize')

const ruleUpdateRating = new schedule.RecurrenceRule()
ruleUpdateRating.hour = [4, 16]
ruleUpdateRating.minute = 0
ruleUpdateRating.second = 0

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
      console.log(l, r, mid, seedi)
      if (seedi < mi - 1e-6) r = mid
      else if (Math.abs(seedi - mi) < 1e-6) {
        ans = mid
        break;
      }
      else l = mid
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
      if (sumdi < 0) this.delta[i] += 1, sumdi += 1
      else this.delta[i] -= 1, sumdi -= 1
    }
  },
  async updateSingle (roundNo) {
    console.log('updating: ', roundNo)

    this.data = await CompetitionHistory.findAll({
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
      const ri = this.data[i].prev_rating === -1 ? 1500 : this.data[i].prev_rating
      const mi = Math.sqrt(this.getSeedi(i, ri) * this.data[i].rank)

      this.delta[i] = (this.getRi(i, mi) - ri) / 2
      sumdi += this.delta[i]
    }
    this.adjustRating(sumdi)

    await this.save()
  },
  async updateRating () {
    const roundIds = await CompetitionHistory.findAll({
      attributes: ['round_no'],
      where: {
        post_rating: { // 找出所有未计分的比赛
          [Op.is]: null
        }
      },
      group: ['round_no']
    })

    const _this = this
    async function forRoundIds (index) {
      if (index < 0) return
      await forRoundIds(index - 1)
      
      const round = await Round.findOne({
        where: {
          round_no: roundIds[index].round_no
        }
      }) // 比赛结束才计算 rating
      if ((new Date()).getTime() > (new Date(round.start_time)).getTime() +
          round.duration * 60000) {
        await _this.updateSingle(roundIds[index].round_no)
      }
    }
    await forRoundIds(roundIds.length - 1)
  },
  scheduleUpdateRating () {
    schedule.scheduleJob(ruleUpdateRating, this.updateRating())
  }
}
