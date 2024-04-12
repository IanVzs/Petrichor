const Mock = require('mockjs')

const data = Mock.mock({
  'data': '@sentence(3, 15)'
})

const savedata = Mock.mock({
  'msg|1': ['保存成功，恭喜', '保存失败，请重试'],
  'sucess|1': [true, false]
  //  [{
  //   id: '@id',
  //   title: '@sentence(3, 5)',
  //   'status|1': ['published', 'draft', 'deleted'],
  //   author: 'name',
  //   display_time: '@datetime',
  //   pageviews: '@integer(300, 5000)'
  // }]
})

module.exports = [
  {
    url: '/petrichor/editor/draft',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: data
      }
    }
  },
  {
    url: '/petrichor/editor/save',
    type: 'post',
    response: config => {
      return {
        code: 200,
        data: savedata
      }
    }
  }
]
