const { User, CompetitionHistory } = require('../models')
const schedules = require('../schedules')
const { Op } = require('sequelize')

module.exports = {
  async index (req, res) {
    try {
      const users = await User.findAll({
        where: {}
      })

      // 获取每个用户参与比赛总数
      async function getUserMatchCnt (index) {
        if (index < 0) return
        const cnt = await CompetitionHistory.count({
          where: {
            participant_id: users[index].id,
            post_rating: { // 排除正在参赛或未计算 rating 的比赛
              [Op.not]: null
            }
          }
        })
        Object.assign(users[index].dataValues, {
          match: cnt
        })
        await getUserMatchCnt(index - 1)
      }

      await getUserMatchCnt(users.length - 1)

      // 去掉没有参赛的
      const filteredUsers = users.filter(item => {
        return item.dataValues.match > 0
      })

      res.send({ users: filteredUsers })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to get rating list',
        detail: err
      })
    }
  },
  async forceUpdateRating (req, res) { // 强制刷新比赛排名
    try {
      if (req.user.status !== 'admin') {
        return res.status(403).send({
          error: 'You do not have access to this resource'
        })
      }
      await schedules.updateRating()
      res.send('successfully updated rating')
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occured trying to update rating',
        detail: err
      })
    }
  }
}
