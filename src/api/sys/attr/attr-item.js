import request from '@/utils/request'

const baseUrl = '/sys/attr-items'

export function getAll(params) {
  return request({
    url: baseUrl + '/all',
    method: 'get',
    params
  })
}

export function getList(params) {
  return request({
    url: baseUrl,
    method: 'get',
    params
  })
}

export function getInfo(id = '') {
  return request({
    url: baseUrl + '/' + id,
    method: 'get'
  })
}

export function insert(params) {
  return request({
    url: baseUrl,
    method: 'post',
    params
  })
}

export function update(params) {
  return request({
    url: baseUrl,
    method: 'put',
    params
  })
}

export function del(id = '') {
  return request({
    url: baseUrl + '/' + id,
    method: 'delete'
  })
}

export function delBatch(params) {
  return request({
    url: baseUrl + '/batch',
    method: 'delete',
    params
  })
}
