// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
const wxContext = cloud.getWXContext()

const deleteArticleDetail = async (event) => {
  // 删除章节
  // 删除文章
  let articleDeleteRes = await db.collection('article_detail').where({
    _id: event.id
  }).remove();
  // 删除评论
  await db.collection('comment').where({
    articleId: event.id
  }).remove()
  if(articleDeleteRes) return true
  else return false
}
// 云函数入口函数
exports.main = async (event, context) => {
  let result = false
  switch(event.action) {
    case 'deleteArticle':
      result = deleteArticleDetail(event)
      break
    default:
      break
  }
  return {
    data: result,
    code: 200
  }
}