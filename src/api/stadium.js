import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/petrichor/stadium/list',
    method: 'get',
    params
  })
}

export function getDetail(params) {
  return request({
    url: '/petrichor/stadium/detail/' + params,
    method: 'get'
  })
}

export function saveOne(data) {
  return request({
    url: '/petrichor/stadium/saveone/',
    method: 'post',
    data
  })
}

export function submitOne(data) {
  return request({
    url: '/petrichor/stadium/submitone/',
    method: 'post',
    data
  })
}
