const schedule = require('node-schedule')

const { User, CompetitionHistory, Round } = require('./models')
const { Op } = require('sequelize')

let ruleUpdateRating = new schedule.RecurrenceRule();
ruleUpdateRating.hour = [4, 16]
ruleUpdateRating.minute = 0
ruleUpdateRating.second = 0

module.exports = {
  data: null,
  delta: null,
  getRank () {
    let rank = 0, prev = null
    for (let history of this.data) {
      if (history.score !== prev) history.rank = ++rank
      else history.rank = rank
      prev = history.score
    }
  },
  getRi (i, mi) {
    let l = -10000, r = 10000, ans
    while (l < r - 1e-6) {
      let mid = (l + r) / 2
      let seedi = this.getSeedi(mid)
      if (seedi < mi - 1e-6) l = mid
      else if (Math.abs(seedi - mi) < 1e-6) ans = mid;
      else r = mid
    }
    return Math.round(ans)
  },
  getSeedi (ri) {
    let seedi = 1
    for (let j = 0; j < this.data.length; j++) {
      rj = this.data[j].prev_rating === -1 ? 1500 : this.data[j].prev_rating
      if (i !== j) seedi += 1.0 / (1.0 + Math.pow(10, (ri - rj) / 400))
    }
    return seedi
  },
  async save () {
    const _this = this;
    async function forSave (index) {
      if (index < 0) return
      await forSave(index - 1)
      this.data[index].post_rating = this.data[index].prev_rating + this.delta[index];
      await _this.data[index].save()
    }
    await forSave(this.data.length - 1)
  },
  adjustRating (sumdi) {
    let inc = (-1 - sumdi) / this.data.length
    sumdi = 0
    for (let i = 0; i < di.length; i++) {
      this.delta[i] += inc
      sumdi += this.delta[i]
    }
    for (let i = 0; i < this.delta.length; i++) {
      if (sumdi === 0) break;
      if (sumdi < 0) this.delta[i]++;
      else this.delta[i]--;
    }
  },
  async updateSingle (round_no) {
    console.log('updating: ', round_no)

    this.data = await CompetitionHistory.findAll({
      where: {
        round_no: round_no,
        type_progress: {
          [Op.between]: [1.0 - 1e-6, 1.0 + 1e-6],
        }
      },
      order: [['score', 'DESC']], // null 值在后面
    })
    this.this.delta = new Array(this.data.length)

    if (this.data.length === 0) return

    this.getRank()

    // https://www.luogu.com.cn/blog/ak-ioi/cf-at-rating
    let sumdi = 0
    for (let i = 0; i < this.data.length; i++) {
      let ri = this.data[i].prev_rating === -1 ? 1500 : this.data[i].prev_rating
      let mi = Math.sqrt(this.getSeedi(ri) * this.data[i].rank)

      this.delta[i] = (getRi(i, mi) - ri) / 2
      sumdi += this.delta[i]
    }
    this.adjustRating(sumdi)

    await this.save()
  },
  async updateRating () {
    let roundIds = await CompetitionHistory.findAll({
      attributes: ['round_no'],
      where: {
        post_rating: { // 找出所有未计分的比赛
          [Op.is]: null
        }
      },
      group: ['round_no']
    })

    const _this = this;
    async function forRoundIds (index) {
      if (index < 0) return
      await forRoundIds(index - 1)
      await _this.updateSingle(roundIds[index].round_no)
    }
    await forRoundIds(roundIds.length - 1)
  },
  scheduleUpdateRating () {
    schedule.scheduleJob(ruleUpdateRating, this.updateRaring())
  }
}
