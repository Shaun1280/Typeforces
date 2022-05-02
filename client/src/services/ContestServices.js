import Api from '@/services/Api'

export default {
  index () {
    return Api().get('contests')
  },
  post (contest) {
    return Api().post('manage-contests', contest)
  }
}
