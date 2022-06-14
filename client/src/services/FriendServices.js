import Api from '@/services/Api'

export default {
  index () {
    return Api().get('friend')
  },
  remove (data) {
    return Api().delete(`friend`, {data: data})
  }
}
