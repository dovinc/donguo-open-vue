import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sys/menus',
    method: 'get',
    params
  })
}

export function getInfo(id = '') {
  return request({
    url: '/sys/menus/' + id,
    method: 'get'
  })
}

export function insert(params) {
  return request({
    url: '/sys/menus',
    method: 'post',
    params
  })
}

export function update(params) {
  return request({
    url: '/sys/menus',
    method: 'put',
    params
  })
}

export function del(id = '') {
  return request({
    url: '/sys/menus/' + id,
    method: 'delete'
  })
}

export function delBatch(params) {
  return request({
    url: '/sys/menus/batch',
    method: 'delete',
    params
  })
}

export function getMenuTree(params) {
  return request({
    url: '/sys/menus/tree',
    method: 'get',
    params
  })
}

export function getTreeWithoutBtn(params) {
  return request({
    url: '/sys/menus/tree-without-btn',
    method: 'get',
    params
  })
}
