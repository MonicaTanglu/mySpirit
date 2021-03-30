// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

const update = (params) => {
  let artcleParams = {
    category: params.category,
    title: params.title,
    introduce: params.introduce,
    share: eparamsvent.share
  }
  // 第一步修改文章
  const res = await db.collection('article').where({
    id: params._id
  }).update({
    data: artcleParams
  });
  let chaptorRes = null;
  // 第二部判断是否是个人文化 通过是否有传章节名
  if (params.chaptorNum) {
    chaptorRes = await db.collection('chaptor').where({
      articleId: params._id
    }).update({
      data: {
        chaptorNum: params.chaptorNum,
        chaptorName: params.chaptorName
      }
    })
  }
  // 第三步修改文章
  let articleDetailParams = {
    title: params.title,
    updateTime: new Date(),
    detail: params.detail,
    chaptorId: chaptorRes ? chaptorRes._id : null
  }
  let detailRes = await db.collection('article_detail').where({
    articleId: params._id
  }).update({
    data: articleDetailParams
  })
  if (detailRes.updated > 0) return true
  return false
}
// 云函数入口函数
exports.main = async (event, context) => {
  let params = event
  let success = false
  const wxContext = cloud.getWXContext()
  if (params.id) { // 假如存在id则修改
    success = update(params)
  } else {
    let artcleParams = {
      category: event.category,
      title: event.title,
      introduce: event.introduce,
      share: event.share,
      openid: wxContext.OPENID,
      createTime: new Date()
    }
    // 第一步添加到文章列表中
    const res = await db.collection('article').add({
      data: artcleParams
    });
    let chaptorRes = null;
    // 第二部判断是否是个人文化 通过是否有传章节名
    if (event.chaptorNum) {
      chaptorRes = await db.collection('chaptor').add({
        data: {
          articleId: res._id,
          chaptorNum: event.chaptorNum,
          chaptorName: event.chaptorName
        }
      })
    }
    // 第三步添加文章
    let articleDetailParams = {
      title: event.title,
      updateTime: new Date(),
      detail: event.detail,
      chaptorId: chaptorRes ? chaptorRes._id : null,
      articleId: res._id,
      openid: wxContext.OPENID
    }
    let detailRes = await db.collection('article_detail').add({
      data: articleDetailParams
    })
    if (detailRes._id) success = true
  }
  return {
    err: '',
    data: success,
    code: 200
  }
}