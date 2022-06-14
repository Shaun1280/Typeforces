const WebSocket = require('ws')
const { User } = require('./models')
const wss = new WebSocket.Server({ port: 8000 });

wss.on('connection', function connection (ws) {
  ws.on('message', async function incoming (message) {
    const json = JSON.parse(message)
    if (json.type) {
      if (json.type === 'LOGIN' && json.data.user) {
        const user = await User.findOne({
          where: {
            user_name: json.data.user.user_name
          }
        })
        if (user) {
          user.last_visit = Date.parse(new Date())
          await user.save()
        }
      }
    }
  })
})