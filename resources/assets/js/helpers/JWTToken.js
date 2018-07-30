export default {
  setToken(token) {
    window.localStorage.setItem('JWTCode', token)
  },
  getToken() {
    return window.localStorage.getItem('JWTCode')
  },
  removeToken() {
    window.localStorage.removeItem('JWTCode')
  }
}