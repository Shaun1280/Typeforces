import Api from '@/services/Api'

export default {
  index (username) {
    return Api().get(`profile/${username}`)
  }
}
