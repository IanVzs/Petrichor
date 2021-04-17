import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/petrichor/table/list',
    method: 'get',
    params
  })
}
