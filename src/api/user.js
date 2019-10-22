import request from '@/utils/request'

export function login(data) {
  console.log(data)
  return request({
    url: '/login/getToken',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/login/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
