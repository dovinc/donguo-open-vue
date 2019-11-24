import request from '@/utils/request'
// import { getToken } from '@/utils/auth.js'

export function login(loginForm) {
  return request({
    url: '/sysUsers/login',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: loginForm
  })
}
/**
 * get promission information
 * @param {Object} token
 */
// export function getInfo(token) {
//   return request({
//     url: '/SysUsers/token',
//     method: 'get',
//     params: { token }
//   })
// }
/**
 * @param {Object} token 获取用户信息，包括permissionsList权限列表，menuList菜单导航列表
 */
export function getUserInfo(token) {
  return request({
    url: 'sys/users/details',
    method: 'get'
  })
}
/**
 * 服务端退出
 */
// export function logout() {
//   return request({
//     url: '/SysUser/logout',
//     method: 'post'
//   })
// }
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
    // headers: {
    //   'Authorization': getToken()
    // }
  })
}
