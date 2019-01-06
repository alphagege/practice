import Mock from 'mockjs'

Mock.mock('/hello', {
  'list|1-10': [{
    'id|+1': 1,
    'icon': '@IMAGE'
  }]
})
