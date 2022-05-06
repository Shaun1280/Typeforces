import Api from '@/services/Api'

export default {
  index (search) {
    return Api().get('search', {
      params: {
        search: search
      }
    })
  }
}
