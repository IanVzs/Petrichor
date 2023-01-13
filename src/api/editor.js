import request from '@/utils/request'

export function getDraft(params) {
  // 拉取草稿
  return request({
    url: '/petrichor/editor/draft',
    method: 'get',
    params
  })
}

export function saveData(data) {
  // 拉取草稿
  return request({
    url: '/petrichor/editor/save',
    method: 'post',
    data
  })
}
