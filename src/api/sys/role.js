import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sys/roles',
    method: 'get',
    params
  })
}

export function getAllRoles(params) {
  return request({
    url: '/sys/roles/all',
    method: 'get',
    params
  })
}

export function getInfo(id = '') {
  return request({
    url: '/sys/roles/' + id,
    method: 'get'
  })
}

export function getDetails(id = '') {
  return request({
    url: '/sys/roles/details/' + id,
    method: 'get'
  })
}

export function getLeafMenuIds(params) {
  return request({
    url: '/sys/roles/leaf-menuIds',
    method: 'get',
    params
  })
}

export function insert(params) {
  return request({
    url: '/sys/roles',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

export function update(params) {
  return request({
    url: '/sys/roles',
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

export function del(id = '') {
  return request({
    url: '/sys/roles/' + id,
    method: 'delete'
  })
}

export function delBatch(params) {
  return request({
    url: '/sys/roles/batch',
    method: 'delete',
    params
  })
}

export function getRoleUserIds(roleId = '') {
  return request({
    url: '/sys/roles/user-ids/' + roleId,
    method: 'get'
  })
}

export function modifyRoleUsers(params) {
  return request({
    url: '/sys/roles/modify-role-users',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
