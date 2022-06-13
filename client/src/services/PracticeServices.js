import Api from '@/services/Api'

export default {
  index () {
    return Api().get('practices')
  },
  show (id) {
    return Api().get(`practices/${id}`)
  },
  post (practice) {
    return Api().post('manage-practices', practice)
  },
  get (search) {
    return Api().get(`manage-practices`, {
      params: {
        search: search
      }
    })
  },
  put (practice) {
    return Api().put('manage-practices', practice)
  },
  postHistory (id, data) {
    return Api().post(`practices/history/${id}`, data)
  }
}
