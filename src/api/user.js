import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/login',
    method: 'get',
  })
}
export function getAllUser(param) {
  return request({
    url: '/user/list',
    method: 'get',
    params: param
  })
}
export function getRoleList(param) {
  return request({
    url: '/user/roleList',
    method: 'get',
    params: param
  })
}
export function userRegister(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}
export function updateUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
export function delUser(data) {
  return request({
    url: '/user',
    method: 'delete',
    data
  })
}
