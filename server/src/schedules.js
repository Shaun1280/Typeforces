const schedule = require('node-schedule')

let ruleUpdateRating = new schedule.RecurrenceRule();
ruleUpdateRating.hour = [4, 16]
ruleUpdateRating.minute = 0
ruleUpdateRating.second = 0

module.exports = {
  async updateRaring () {
    
  },
  scheduleUpdateRating () {
    schedule.scheduleJob(ruleUpdateRating, this.updateRaring())
  }
}
