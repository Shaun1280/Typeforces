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
  }
}
