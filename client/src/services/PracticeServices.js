import Api from '@/services/Api'

export default {
  index () {
    return Api().get('practices')
  },
  show (id) {
    return Api().get(`practices/${id}`)
  },
  postHistory (id, data) {
    return Api().post(`practices/history/${id}`, data)
  }
}
