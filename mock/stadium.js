const Mock = require('mockjs')

const data = Mock.mock({
  'items|50': [{
    id: '@id',
    address: '@sentence(3, 5)',
    'status|1': ['公益球场', '对外开放付费', '只对内', '商业球场', '未知'],
    'name|1': ['场1', '场2', '野场', '未名'],
    // name: 'name',
    updatetime: '@datetime',
    agree: '@integer(300, 5000)'
  }]
})
const detail_table_data = "# 概要信息\nID|地址|球场名|开放状态\n:---:|:---:|:---:|:---:\n @id |@sentence(3, 5)|name|未知"
const detail = Mock.mock({
  id: '@id',
  address: '@sentence(3, 5)',
  'status|1': ['published', 'draft', 'deleted'],
  author: 'name',
  pubDtime: '@datetime',
  pageviews: '@integer(300, 5000)',
  link: 'https://demo.com',
  desc: detail_table_data + '\n# Marked in Node.js\n\nRendered by **marked**.\n\n## 牛逼的渲染工具\n\n sixsixsix啊\n\n\n### 激动的不能自已\n\n![iamge](https://desk-fd.zol-img.com.cn/t_s960x600c5/g1/M0B/03/06/ChMljl402K6IOTZbAARWayFg6S4AAQJPwFhuRIABFaD752.jpg)\n\n```python\n\nimport os\n\nprint("hello world~")\n\n```'
})

module.exports = [
  {
    url: '/petrichor/stadium/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/petrichor/stadium/detail/*',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: detail
      }
    }
  }
]
