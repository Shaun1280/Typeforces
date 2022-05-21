const { User, CompetitionHistory} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const users = await User.findAll({
        where:{}
      })

      // 获取每个用户参与比赛总数
      async function getUserMatchCnt(index) {
        if (index < 0) return
        const cnt = await CompetitionHistory.count({
          where: {
               participant_id: users[index].id
           }
        })
        Object.assign(users[index].dataValues, {
          match: cnt
        })
        await getUserMatchCnt(index - 1)
      }

      await getUserMatchCnt(users.length - 1)
      
      // 去掉没有参赛的
      let filteredUsers = users.filter(item => {
          return item.dataValues.match > 0
      })

      res.send({users: filteredUsers})
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to get rating list',
        detail: err
      })
    }
  }
}
