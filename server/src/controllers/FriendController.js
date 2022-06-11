const { User, Friend } = require('../models')

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
                    id1: req.user.id
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
                    id2: req.user.id
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
    }
}
