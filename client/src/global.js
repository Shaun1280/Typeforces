import AuthenticationService from '@/services/AuthenticationService'
import store from '@/store/store'

export default {
  timeDifToString (timeDif) {
    let hours = parseInt(timeDif / (60 * 60 * 1000))
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
  },
  calcTitle (rating) {
    if (rating === -1) return 'Unrated'
    else if (rating < 1200) return 'Newbie'
    else if (rating < 1400) return 'Pupil'
    else if (rating < 1600) return 'Specialist'
    else if (rating < 1900) return 'Expert'
    else if (rating < 2100) return `Candidate Master`
    else if (rating < 2300) return 'Master'
    else if (rating < 2400) return `International Master`
    else if (rating < 2600) return 'Grandmaster'
    else if (rating < 3000) return `International Grandmaster`
    else return `Legendary Grandmaster`
  },
  titleColor (rating) {
    if (rating === -1) return '#000000'
    else if (rating < 1200) return '#778899'
    else if (rating < 1400) return '#008000'
    else if (rating < 1600) return '#03A89E'
    else if (rating < 1900) return '#0000FF'
    else if (rating < 2100) return '#AA00AA'
    else if (rating < 2300) return '#FA8C00'
    else if (rating < 2400) return '#FF8C00'
    else return '#FF0000'
  },
  nameColor (username, rating) { // ret color array
    let ret = []
    ret.length = username.length
    let color
    if (rating === -1) color = '#000000'
    else if (rating < 1200) color = '#778899'
    else if (rating < 1400) color = '#008000'
    else if (rating < 1600) color = '#03A89E'
    else if (rating < 1900) color = '#0000FF'
    else if (rating < 2100) color = '#AA00AA'
    else if (rating < 2300) color = '#FA8C00'
    else if (rating < 2400) color = '#FF8C00'
    else color = '#FF0000'
    for (let i = 0; i < ret.length; i++) {
      ret[i] = color
      if (i === 0 && rating >= 3000) ret[i] = '#000000'
    }
    return ret
  },
  ratingColor (rating, competitionHistory) {
    return this.titleColor(rating, competitionHistory)
  },
  async checkLogin () {
    try {
      await AuthenticationService.checkLogin()
      console.log('global, is logged in')
    } catch (error) {
      if (error.response !== undefined && error.response.status === 403) {
        store.dispatch('setToken', null)
        store.dispatch('setUser', null)
      }
    }
  }
}
