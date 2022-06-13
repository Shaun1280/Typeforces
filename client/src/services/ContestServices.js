import Api from '@/services/Api'

export default {
  index () {
    return Api().get('contests')
  },
  show (id) {
    return Api().get(`contests/${id}`)
  },
  get (search) {
    return Api().get(`manage-contests`, {
      params: {
        search: search
      }
    })
  },
  getPracticeByContest (contest) {
    return Api().get(`practice-contest/${contest.content_id}/${contest.round_name}`)
  },
  put (contest) {
    return Api().put('manage-contests', contest)
  },
  post (contest) {
    return Api().post('manage-contests', contest)
  },
  delete (id) {
    return Api().delete(`manage-contests/${id}`)
  },
  postHistory (id, data) {
    return Api().post(`contests/history/${id}`, data)
  },
  getStanding (id) {
    return Api().get(`contests/standing/${id}`)
  }
}
