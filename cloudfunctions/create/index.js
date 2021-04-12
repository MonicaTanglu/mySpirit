// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database({env: cloud.DYNAMIC_CURRENT_ENV})

const commentInsert = async (event,openid) => {
  let params = {
    content: event.content,
    openid: openid,
    articleId: event.articleId, // 详细文章详情
    commentTime: new Date()
  }
  // 评论的时候检查该用户是否存在用户表中，如果不存在则插入用户信息到用户表中
  cloud.callFunction({
    name: 'login',
    data: {
      nickName: event.nickName,
      avatarUrl: event.avatarUrl
    },
    fail: (err) => {
      console.log(err)
    }
  })
  let res = await db.collection('comment').add({
    data: params
  })
  return res
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = null
  switch (event.action) {
    case 'comment':
      result = await commentInsert(event,wxContext.OPENID)
      break
    default:
      break
  }
  return {
    result
  }
}