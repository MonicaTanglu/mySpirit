// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const wxContext = cloud.getWXContext()
const commentInsert = async (event) => {
  let params = {
    content: event.content,
    openid: wxContext.OPENID,
    articleId: event.articleId, // 详细文章详情
    commentTime: new Date()
  }
  // 评论的时候检查该用户是否存在用户表中，如果不存在则插入用户信息到用户表中
  cloud.callFunction({
    name: 'login',
    data: {
      nickName: event.nickName,
      avatarUrl: event.avatarUrl
    }
  })
  let res = await db.collection('comment').add({
    data: params
  })
  return res
}
// 云函数入口函数
exports.main = async (event, context) => {

  let result = null
  switch (event.action) {
    case 'comment':
      result = await commentInsert(event)
      break
    default:
      break
  }
  return {
    result
  }
}