import Api from '@/services/Api'

export default {
  index () {
    return Api().get('practices')
  },
  indexUser (username) {
    return Api().get(`practicesUser/${username}`)
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
  delete (id) {
    return Api().delete(`manage-practices/${id}`)
  },
  postHistory (id, data) {
    return Api().post(`practices/history/${id}`, data)
  },
  vote (id) {
    return Api().post(`practices/vote/${id}`)
  }
}
