const { User, Friend } = require('../models')
const { Op } = require('sequelize')

module.exports = {
    async index(req, res) {
        try {
            // console.log(req.user.id)

            Friend.belongsTo(User, {
                foreignKey: 'id2',
                targetKey: 'id'
            })
           
            let users1 = await Friend.findAll({
                attributes: ['id1', 'id2'],
                where: {
                    id1: req.user.id,
                    created_time: {
                      [Op.not]: null
                    } 
                },
                include: [
                    {
                        model: User,
                        attributes: ['user_name', 'rating'],
                        required: false
                    }
                ]
            })

            Friend.belongsTo(User, {
                foreignKey: 'id1',
                targetKey: 'id'
            })

            let users2 = await Friend.findAll({
                attributes: ['id1', 'id2'],
                where: {
                    id2: req.user.id,
                    created_time: {
                        [Op.not]: null
                    } 
                },
                include: [
                    {
                        model: User,
                        attributes: ['user_name', 'rating'],
                        required: false
                    }
                ]
            })
            return res.send(users1.concat(users2));
        } catch (err) {
            // console.log(err)
            res.status(500).send({
                error: 'An error has occured trying to get friends'
            })
        }
    },
    async remove(req, res) {
        try {
            await Friend.destroy({
                where: {
                    id1: req.body.id1,
                    id2: req.body.id2
                }
            })
            return res.end()
        } catch (err) {
            // console.log(err)
            res.status(500).send({
                error: 'An error has occured trying to remove friend'
            })
        }
    },
    async friendRequest (req, res) {
        try {
            const id1 = req.user.id
            const id2 = req.body.id
            const request = await Friend.findOne({
                where: {
                    id1: id1 < id2 ? id1 : id2,
                    id2: id1 < id2 ? id2 : id1
                }
            })
            if (request) {
                if (request.req_id === id1) {
                    if (!request.created_time) {
                        return res.send({
                            msg: `You've already sent friend request to this user.`
                        })
                    } else {
                        return res.send({
                            msg: `You are already friends. <br/> Try to refresh page.`
                        })
                    }
                } else {
                    if (!request.created_time) {
                        return res.send({
                            msg: `A friend request has been sent by this user. <br/> Check it out first.`
                        })
                    } else {
                        return res.send({
                            msg: `You are already friends. <br/> Try to refresh page.`
                        })
                    }
                }
            } else {
                await Friend.create({
                    id1: id1 < id2 ? id1 : id2,
                    id2: id1 < id2 ? id2 : id1,
                    req_id: id1
                })
                return res.send({
                    msg: `Your friend request has been successfully submitted. <br/>Please wait for confirmation.`
                })
            }
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to send friend request.',
                detail: err
            })
        }
    },
    async getRequests (req, res) {
        try {
            Friend.belongsTo(User, {
                foreignKey: 'id2',
                targetKey: 'id'
            })
           
            const users1 = await Friend.findAll({
                attributes: ['id1', 'id2'],
                where: {
                    id1: req.user.id,
                    req_id: {
                        [Op.not]: req.user.id
                    },
                    created_time: {
                      [Op.is]: null
                    }
                },
                include: [
                    {
                        model: User,
                        attributes: ['user_name', 'rating', 'country', 'id'],
                        required: false
                    }
                ]
            })

            Friend.belongsTo(User, {
                foreignKey: 'id1',
                targetKey: 'id'
            })

            const users2 = await Friend.findAll({
                attributes: ['id1', 'id2'],
                where: {
                    id2: req.user.id,
                    req_id: {
                        [Op.not]: req.user.id
                    },
                    created_time: {
                        [Op.is]: null
                    }
                },
                include: [
                    {
                        model: User,
                        attributes: ['user_name', 'rating', 'country', 'id'],
                        required: false
                    }
                ]
            })
            return res.send(users1.concat(users2));
        } catch (err) {
            console.log(err)
            res.status(500).send({
                error: 'An error has occured trying to get friend requests.',
                detail: err
            })
        }
    },
    async accept (req, res) {
        try {
            const id1 = req.user.id
            const id2 = req.body.id
            const friend = await Friend.findOne({
                where: {
                    id1: id1 < id2 ? id1 : id2,
                    id2: id1 < id2 ? id2 : id1
                }
            })
            friend.created_time = Date.parse(new Date())
            await friend.save()
            return res.send({
                msg: 'Friend request accepted successfully.'
            })
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to accept request',
                detail: err
            })
        }
    },
    async refuse (req, res) {
        try {
            const id1 = req.user.id
            const id2 = req.body.id
            await Friend.destroy({
                where: {
                    id1: id1 < id2 ? id1 : id2,
                    id2: id1 < id2 ? id2 : id1
                }
            })
            return res.send({
                msg: 'Friend request refused successfully.'
            })
        } catch (err) {
            console.log(err)
            res.status(500).send({
                error: 'An error has occured trying to refuse request',
                detail: err
            })
        }
    }
}
