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
  }
}
