// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = []
  const _ = db.command
  switch (event.action) {
    case 'getStoryList':
      result = await db.collection('article').where(_.or([{
        category: 1,
        share: 2
      }, {
        category: 1,
        share: 1,
        openid: wxContext.OPENID
      }])).skip(event.startIndex).limit(event.pageSize).get()
      break
    default:
      break
  }
  return {data:result.data,code: 200}
}