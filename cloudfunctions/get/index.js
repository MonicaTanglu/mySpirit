// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = []
  const _ = db.command
  const $ = db.command.aggregate
  switch (event.action) {
    case 'getStoryList':
      result = await db.collection('article').aggregate().match(_.or([{
        category: 1,
        share: 2
      }, {
        category: 1,
        share: 1,
        openid: wxContext.OPENID
      }])).skip(event.startIndex).limit(event.pageSize).lookup({
        from: 'user',
        localField: 'openid',
        foreignField: 'openid',
        as: 'userList'
      }).replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$userList', 0]), '$$ROOT'])
      }).project({
        userList: 0
      }).end()
      break
    case 'articleDetail':
      result = await db.collection('article_detail').aggregate().match({
        articleId: event.id
      }).lookup({
        from: 'user',
        localField: 'openid',
        foreignField: 'openid',
        as: 'userList'
      }).replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$userList', 0]), '$$ROOT'])
      }).project({
        userList: 0
      }).end()
      break
    default:
      break
  }
  return {
    data: result.list,
    code: 200
  }
}