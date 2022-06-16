import Api from '@/services/Api'

export default {
  index () {
    return Api().get('friend')
  },
  remove (data) {
    return Api().delete(`friend`, {data: data})
  },
  friendRequest (data) {
    return Api().post('friend/req', data)
  },
  getRequests () {
    return Api().get('friend/req')
  },
  accept (id) {
    return Api().post('friend/accept', { id: id })
  },
  refuse (id) {
    return Api().post('friend/refuse', { id: id })
  }
}
