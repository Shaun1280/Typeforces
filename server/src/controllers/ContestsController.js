const { User, Round, Content, CompetitionHistory } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const contests = await Round.findAll({
        where: {}
      })
      res.send({
        contests: contests,
        serverTime: (new Date()).getTime()
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to get contests'
      })
    }
  },
  async show (req, res) { // 特定 contest
    try {
      const contest = await Round.findOne({
        where: {
          round_no: req.params.id
        }
      })
      const content = await Content.findOne({
        where: {
          content_id: contest.content_id
        }
      })
      res.send({
        contest: contest,
        content: content,
        serverTime: (new Date()).getTime()
      })
    } catch (err) {
      res.status(500).send({
        error: `An error has occured when trying to get contest${req.params.id}`
      })
    }
  },
  async post (req, res) { // for manage Contest
    try {
      if (req.user.status !== 'admin') {
        return res.status(403).send({
          error: 'You do not have access to this resource'
        })
      }
      const round = await Round.findOne({
        where: {
          round_name: req.body.round_name
        }
      })

      if (round) {
        return res.status(500).send({
          error: 'RoundName has already existed'
        })
      }

      const content = await Content.create({
        content: req.body.content
      })
      const contest = await Round.create({
        round_name: req.body.round_name,
        start_time: req.body.start_time,
        division: req.body.division,
        duration: req.body.duration,
        content_id: content.content_id
      })

      res.send({
        contest: contest,
        content: content
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to create contest',
        detail: err
      })
    }
  },
  async put (req, res) { // for manage Contest
    try {
      if (req.user.status !== 'admin') {
        return res.status(403).send({
          error: 'You do not have access to this resource'
        })
      }
      if ((new Date()).getTime() > (new Date(req.body.start_time)).getTime()) {
        return res.status(403).send({
          error: 'You can not modify conteset into ongoing or closed state'
        })
      }

      const contest = await Round.findOne({
        where: {
          round_no: req.body.round_no
        }
      })

      if (!contest) {
        return res.status(403).send({
          error: 'Contest not found, you have no access to it'
        })
      }

      if ((new Date()).getTime() > (new Date(contest.start_time)).getTime()) {
        return res.status(403).send({
          error: 'You can not modify ongoing or closed contest'
        })
      }

      // create new content
      const content = await Content.create({
        content: req.body.content
      })

      contest.round_name = req.body.round_name
      contest.start_time = req.body.start_time
      contest.division = req.body.division
      contest.duration = req.body.duration
      contest.content_id = content.content_id

      await contest.save()

      // delete old content
      await Content.destroy({
        where: {
          content_id: req.body.content_id
        }
      })
      res.send({
        contest: contest,
        content: content
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occured trying to modify contest',
        detail: err
      })
    }
  },
  async delete (req, res) { // for manage Contest
    try {
      if (req.user.status !== 'admin') {
        return res.status(403).send({
          error: 'You do not have access to this resource'
        })
      }

      const contest = await Round.findOne({
        where: {
          round_no: req.params.id
        }
      })

      if (!contest) {
        return res.status(403).send({
          error: 'Contest not found, you have no access to it'
        })
      }

      if ((new Date()).getTime() > (new Date(contest.start_time)).getTime()) {
        return res.status(403).send({
          error: 'You can only delte upcoming contest'
        })
      }

      const contentId = contest.content_id
      await contest.destroy()
      await Content.destroy({
        where: {
          content_id: contentId
        }
      })
      res.send('delete success')
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occured trying to delete contest',
        detail: err
      })
    }
  },
  async get (req, res) { // for manage Contest
    try {
      if (req.user.status !== 'admin') {
        return res.status(403).send({
          error: 'You do not have access to this resource'
        })
      }
      const contest = await Round.findOne({
        where: {
          round_name: req.query.search
        }
      })
      const content = await Content.findOne({
        where: {
          content_id: contest.content_id
        }
      })
      Object.assign(contest.dataValues, {
        content: content.content
      })
      res.send({
        contest: contest
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured when trying to get contest by name: ' + req.query.search,
        detail: err
      })
    }
  },
  async postHistory (req, res) { // 增加比赛记录
    try {
      if (req.body.type_progress === 0 && req.body.miss_count === 0) {
        return res.send({
          message: 'typing_progress = 0, won\'t save'
        })
      }

      let history = await CompetitionHistory.findOne({
        where: {
          round_no: req.params.id,
          participant_id: req.user.id
        }
      })

      const content = (await Round.findOne({
        include: [
          {
            model: Content
          }
        ],
        where: {
          round_no: req.params.id
        }
      })).Content.content

      // for debug
      console.log('postHistory: content_length', content.length)
      console.log(req.body)

      if (history) { // update, 50 penalty
        if (req.body.type_progress === content.length) { // typing ends
          // higher score or prev attempt didn't finish
          if (history.score < req.body.score - 100 || !(Math.abs(history.type_progress - 1) < 1e-6)) {
            history.setDataValue('miss_count', req.body.miss_count)
            history.setDataValue('wpm', req.body.wpm)
            history.setDataValue('type_progress', 1)
            history.setDataValue('score', req.body.score - 100)
            await history.save()
          }
        } else {
          // current && prev attempt didn't finish
          if (!(Math.abs(history.type_progress - 1) < 1e-6) &&
            history.type_progress < req.body.type_progress / content.length) {
            history.setDataValue('miss_count', req.body.miss_count)
            history.setDataValue('wpm', req.body.wpm)
            history.setDataValue('type_progress', req.body.type_progress / content.length)
            history.setDataValue('score', null)
            await history.save()
          }
        }
      } else { // insert
        const progress = req.body.type_progress / content.length
        history = await CompetitionHistory.create({
          round_no: req.params.id,
          participant_id: req.user.id,
          prev_rating: req.user.rating,
          miss_count: req.body.miss_count,
          type_progress: progress,
          wpm: req.body.wpm,
          score: (Math.abs(progress - 1) < 1e-6) ? req.body.score : null
        })
      }
      res.send(history.toJSON())
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occured trying to insert or update competition history',
        detail: err
      })
    }
  },
  async getStanding (req, res) {
    try {
      // console.log("id: ", req.params.id)
      // 查询比赛是否存在
      const round = await Round.findOne({
        where: {
          round_no: req.params.id
        }
      })
      // 比赛不存在
      if (!round) {
        return res.status(400).send({
          error: 'No such contest!'
        })
      }

      const record = await CompetitionHistory.findAll({
        attributes: ['rank', 'miss_count', 'wpm', 'score', 'type_progress'],
        include: [
          {
            model: User,
            attributes: ['rating', 'user_name', 'country'],
            required: false
          }
        ],
        where: {
          round_no: req.params.id
        }
      })

      res.send({ record: record })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to get rating list',
        detail: err
      })
    }
  }
}
