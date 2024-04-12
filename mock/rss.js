const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    pubDtime: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})
const detail = Mock.mock({
  id: '@id',
  title: '@sentence(3, 5)',
  'status|1': ['published', 'draft', 'deleted'],
  author: 'name',
  pubDtime: '@datetime',
  pageviews: '@integer(300, 5000)',
  link: 'https://demo.com',
  desc: '# Marked in Node.js\n\nRendered by **marked**.\n\n## 牛逼的渲染工具\n\n sixsixsix啊\n\n\n### 激动的不能自已\n\n![iamge](https://desk-fd.zol-img.com.cn/t_s960x600c5/g1/M0B/03/06/ChMljl402K6IOTZbAARWayFg6S4AAQJPwFhuRIABFaD752.jpg)\n\n```python\n\nimport os\n\nprint("hello world~")\n\n```'
})

module.exports = [
  {
    url: '/petrichor/rss/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 200,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/petrichor/rss/detail/*',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data: detail
      }
    }
  }
]
