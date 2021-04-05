// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
const wxContext = cloud.getWXContext()
// 获取评论列表
const getComment = async (event) => {
  const $ = db.command.aggregate
  let res = await db.collection('comment').aggregate().match({
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
  return res
}
const getMovieList = async (event) => {
  let res = await db.collection('article').aggregate().match(_.or([{
    category: 2,
    share: 2
  }, {
    category: 2,
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
  return res
}
// 云函数入口函数
exports.main = async (event, context) => {
  
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
      }).lookup({
        from: 'article',
        localField: 'articleId',
        foreignField: '_id',
        as: 'articleList'
      }).replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$articleList', 0]), '$$ROOT'])
      }).project({
        articleList: 0
      }).end()
      break
    case 'movieList':
      result = await getMovieList(event)
      break
    case 'comment':
      result = await getComment(event)
      break
    default:
      break
  }
  return {
    data: result.list,
    code: 200
  }
}