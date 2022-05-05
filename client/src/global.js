export default {
  timeDifToString (timeDif) {
    let hours = parseInt(timeDif % (86400 * 1000) / (60 * 60 * 1000))
    let minutes = parseInt(timeDif % (60 * 60 * 1000) / (60 * 1000))
    let seconds = parseInt(timeDif % (60 * 1000) / 1000)
    let s1 = `${hours < 10 ? `0${hours}` : `${hours}`}`
    let s2 = `${minutes < 10 ? `0${minutes}` : `${minutes}`}`
    let s3 = `${seconds < 10 ? `0${seconds}` : `${seconds}`}`
    return `${s1} : ${s2} : ${s3}`
  }
}
