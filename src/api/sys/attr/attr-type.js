import request from '@/utils/request'

const baseUrl = '/sys/attr-types'
export function getList(params) {
  return request({
    url: baseUrl,
    method: 'get',
    params
  })
}

export function getInfo(id = '') {
  return request({
    url: baseUrl + id,
    method: 'get'
  })
}

export function insert(params) {
  return request({
    url: baseUrl,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

export function update(params) {
  return request({
    url: baseUrl,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

export function del(id = '') {
  return request({
    url: baseUrl + id,
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
