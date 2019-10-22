import Cookies from 'js-cookie'

const plaform = 'vueapi'
const TokenKey = 'Admin-Token'
const appFwkey = '2587l6QEQ3mPHJZgYTAznd2sN17mlBQZ4CgMNdYoEZJ3'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
