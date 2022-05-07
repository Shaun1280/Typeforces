export default {
  timeDifToString (timeDif) {
    let hours = parseInt(timeDif % (86400 * 1000) / (60 * 60 * 1000))
    let minutes = parseInt(timeDif % (60 * 60 * 1000) / (60 * 1000))
    let seconds = parseInt(timeDif % (60 * 1000) / 1000)
    let s1 = `${hours < 10 ? `0${hours}` : `${hours}`}`
    let s2 = `${minutes < 10 ? `0${minutes}` : `${minutes}`}`
    let s3 = `${seconds < 10 ? `0${seconds}` : `${seconds}`}`
    return `${s1} : ${s2} : ${s3}`
  },
  setTimeTag (contests, serverTime) {
    contests.forEach((item) => {
      let timeDif = (new Date(item.start_time)).getTime() - serverTime
      if (timeDif > 0) {
        let days = parseInt(timeDif / (86400 * 1000))
        if (days) item.timeTag = `<br/> Before Start <br/> ${days} ${days === 1 ? 'day' : 'days'}`
        else {
          item.timeTag = `<br/> Before Start <br/> ${this.timeDifToString(timeDif)}<br/>`
        }
      } else {
        timeDif = (new Date(item.start_time)).getTime() - serverTime + item.duration * 60000
        if (timeDif > 0) {
          item.timeTag = `<br/> Before End <br/> ${this.timeDifToString(timeDif)}<br/>`
        } else item.timeTag = `<br/> Final Standing <br/>`
      }
    })
  }
}
