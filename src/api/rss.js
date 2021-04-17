import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/rss/list',
    method: 'get',
    params
  })
}

export function getDetail(params) {
  return request({
    url: '/vue-admin-template/rss/detail',
    method: 'get',
    params
  })
}
