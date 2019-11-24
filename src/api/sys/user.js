import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sys/users',
    method: 'get',
    params
  })
}

export function getListAll(params) {
  return request({
    url: '/sys/users/all',
    method: 'get',
    params
  })
}

export function getInfo(id = '') {
  return request({
    url: '/sys/users/' + id,
    method: 'get'
  })
}

export function detailsWithRoleIds(id = '') {
  return request({
    url: '/sys/users/' + id + '/details-with-role-ids',
    method: 'get'

  })
}

export function getDetailsWithRoleInfo(id = '') {
  return request({
    url: '/sys/users/details/' + id,
    method: 'get'
  })
}

export function insert(params) {
  return request({
    url: '/sys/users',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

export function update(params) {
  return request({
    url: '/sys/users',
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

export function del(id = '') {
  return request({
    url: '/sys/users/' + id,
    method: 'delete'
  })
}

export function delBatch(params) {
  return request({
    url: '/sys/users/batch',
    method: 'delete',
    params
  })
}
