const { Users, Message } = require('../models')
const { Op } = require('sequelize')

module.exports = {
  async checkNew(req, res) {
    try {
      const msg = await Message.findOne({
        where: {
          sender_id: req.query.sender_id,
          receiver_id: req.query.receiver_id,
          view_tag: false
        }
      })
      if (!msg) return res.send({hasUnviewed: false})
      return res.send({hasUnviewed: true});
    } catch (err) {
      // console.log(err)
      res.status(500).send({
        error: 'An error has occured in checking new messages'
      })
    }
  },
  async getViewed(req, res) {
    try {
      console.log("viewed")
      let msg = await Message.findAll({
        where: {
          sender_id: req.user.id,
          receiver_id: req.user.id === req.query.id2 ? req.query.id1 : req.query.id2,
        }
      })
      let msg2 = await Message.findAll({
        where: {
          sender_id: req.user.id === req.query.id2 ? req.query.id1 : req.query.id2,
          receiver_id: req.user.id,
          view_tag: true
        }
      })
      return res.send(msg.concat(msg2))
    } catch (err) {
      // console.log(err)
      res.status(500).send({
        error: 'An error has occured in getting viewed messages'
      })
    }
  },
  async getUnviewed(req, res) {
    try {
      let msg = await Message.findAll({
        where: {
          sender_id: req.user.id === req.query.id2 ? req.query.id1 : req.query.id2,
          receiver_id: req.user.id,
          view_tag: false
        }
      })
      return res.send(msg)
    } catch (err) {
      // console.log(err)
      res.status(500).send({
        error: 'An error has occured in getting unviewed messages'
      })
    }
  },
  async postNew(req, res) {
    try {
      console.log(req.body)
      await Message.create({
        sender_id: req.body.sender_id,
        receiver_id: req.body.receiver_id,
        content: req.body.content,
        send_time: req.body.send_time,
        view_tag: false
      })
      return res.end()
    } catch (err) {
      // console.log(err)
      res.status(500).send({
        error: 'An error has occured in posting  message'
      })
    }
  },
  async setViewed(req, res) {
    try {
      // console.log(req.body)
      req.body.forEach(async (element, index) => {
        await Message.update({ view_tag: true }, {
          where: {
            message_id: element.message_id
          }
        })
      });
      return res.end()
    } catch (err) {
      // console.log(err)
      res.status(500).send({
        error: 'An error has occured in posting  message'
      })
    }
  }
}
