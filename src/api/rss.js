import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/petrichor/rss/list',
    method: 'get',
    params
  })
}

export function getDetail(params) {
  return request({
    url: '/petrichor/rss/detail',
    method: 'get',
    params
  })
}
