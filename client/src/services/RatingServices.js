import Api from '@/services/Api'

export default {
  index () {
    return Api().get('rating')
  },
  forceUpdateRating () {
    return Api().post('forceUpdateRating')
  }
}
