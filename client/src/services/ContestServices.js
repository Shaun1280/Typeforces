import Api from '@/services/Api'

export default {
  index () {
    return Api().get('contests')
  },
  show (id) {
    return Api().get(`contests/${id}`)
  },
  post (contest) {
    return Api().post('manage-contests', contest)
  },
  postHistory (id, data) {
    return Api().post(`contests/history/${id}`, data)
  }
}
