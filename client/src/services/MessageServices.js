import Api from '@/services/Api'

export default {
  checkNew (data) {
    // console.log(data)
    return Api().get(`message/check`, {
      params: {
        sender_id: data.sender_id,
        receiver_id: data.receiver_id
      }
    })
  },
  getUnviewed (data) {
    return Api().get(`message/unviewed`, {
      params: {
        id1: data.id1,
        id2: data.id2
      }
    })
  },
  getViewed (data) {
    return Api().get(`message/viewed`, {
      params: {
        id1: data.id1,
        id2: data.id2
      }
    })
  },
  postNew (data) {
    return Api().post(`message/new`, data)
  },
  setViewed (data) {
    return Api().post(`message/set`, data)
  }
}
