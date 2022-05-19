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

      // 按 rating 从大到小排序
     filteredUsers.sort((a, b) => b.rating - a.rating)

      let count = 1
      filteredUsers.forEach((element, index) => {
          // rating 相同的排名相同
          if (index > 0 && filteredUsers[index].rating !== filteredUsers[index - 1].rating) {
            count = count + 1
          }
          Object.assign(element.dataValues, {
            rank: count
          })
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
