import Api from '@/services/Api'

export default {
  index () {
    return Api().get('friend')
  },
  remove (data) {
    console.log(data)
    return Api().delete(`friend`, {data: data})
  }
}
