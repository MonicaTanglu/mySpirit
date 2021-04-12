// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database({env: cloud.DYNAMIC_CURRENT_ENV})
const _ = db.command
const $ = db.command.aggregate
const wxContext = cloud.getWXContext()

const deleteArticleDetail = async (event) => {
  // 删除章节
  if (event.chaptorId) {
    let delChaptorRes = await db.collection('chaptor').where({
      _id: event.chaptorId
    }).remove()
  }
  // 删除文章
  let articleDeleteRes = await db.collection('article_detail').where({
    articleId: event.id
  }).remove();
  // 删除列表 
  let artDelRes = await db.collection('article').where({
    _id: event.id
  }).remove()
  // 删除评论
  await db.collection('comment').where({
    articleId: event.id
  }).remove()
  if (articleDeleteRes.stats.removed > 0 && artDelRes.stats.removed > 0) return true
  else return false
}
const deleteMyStory = async (event) => {
  // 查询所有的文章id
  let articleListRes = await db.collection('comment').where({
    articleId: event.id,
  }).get()
  const list = articleListRes.data
  let deleteArr = []
  for (let item of list) {
    deleteArr.push(item._id)
  }
  // 删除所有的评论
  let chaptorDeleteArr = await db.collection('comment').where({
    articleId: _.in(deleteArr)
  }).remove()
  // 删除所有的章节
  let chaptorRes = await db.collection('chaptor').where({
    articleId: event.id
  }).remove()
  // 删除所有的文章详情
  let deleteArticleDetailRes = await db.collection('article_detail').where({
    articleId: event.id
  }).remove()
  // 删除该文章
  let deleteArticle = await db.collection('article').where({
    _id: event.id
  }).remove()
  if (deleteArticle.stats.removed > 0) return true
  else return false
}
const deleteComment = async (event) => {
  let res = await db.collection('comment').where({
    _id: event.id
  }).remove()
  if (res.stats.removed) return true
  return false
}
// 云函数入口函数
exports.main = async (event, context) => {
  let result = false
  switch (event.action) {
    case 'deleteArticle':
      result = await deleteArticleDetail(event)
      break
    case 'deleteComment':
      result = await deleteComment(event)
    case 'deleteMyStory':
      result = await deleteMyStory(event)
      break
    default:
      break
  }
  return {
    data: result,
    code: 200
  }
}