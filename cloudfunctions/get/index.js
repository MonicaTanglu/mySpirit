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
// 电影文化列表
const getMovieList = async (event,openid) => {
  let res = await db.collection('article').aggregate().match(_.or([{
    category: 2,
    share: 2
  }, {
    category: 2,
    share: 1,
    openid: openid
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
// 个人故事列表
const getStoryList = async (event,openid) => {
  let res = await db.collection('article').aggregate().match({
    category: 3,
    share: 1,
    openid: openid
  }).skip(event.startIndex).limit(event.pageSize).lookup({
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
// 获取章节列表

const getChaptorList = async (event) => {
  let res = await db.collection('chaptor').orderBy('chaptorNum', 'asc').where({
    articleId: event.articleId
  }).get()
  return res
}
// 获取故事详情
const storyDetail = async (event,openid) => {
  let res = await db.collection('article_detail').aggregate().match({
    chaptorId: event.id,
    openid: openid
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
  }).lookup({
    from: 'chaptor',
    localField: 'chaptorId',
    foreignField: '_id',
    as: 'chaptorList'
  }).replaceRoot({
    newRoot: $.mergeObjects([$.arrayElemAt(['$chaptorList', 0]), '$$ROOT'])
  }).project({
    chaptorList: 0
  }).end()
  return res
}

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
      result = await getMovieList(event,wxContext.OPENID)
      break
    case 'storyList':
      result = await getStoryList(event,wxContext.OPENID)
      break
    case 'comment':
      result = await getComment(event)
      break
    case 'chaptor':
      let chaptorRes = await getChaptorList(event)
      result['list'] = chaptorRes.data
      break
    case 'storyDetail':
      result = await storyDetail(event,wxContext.OPENID)
      break
    default:
      break
  }
  return {
    data: result.list,
    code: 200
  }
}