// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
// 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
const wxContext = cloud.getWXContext()
  // 先查找数据是否存在该登录用户 
  let user = await db.collection('user').where({
    openid: wxContext.OPENID
  }).get()
  let params = {
    avatarUrl: event.avatarUrl,
    nickName: event.nickName,
    openid: wxContext.OPENID
  }
  if (user.data.length === 0) {
    // 当没有该用户的时候，插入数据
    db.collection('user').add({
      data: params
    })
  } else {
    // 假如存在该用户的时候，检查该用户的头像昵称是否变化 变化则修改
    let userObj = user.data[0]
    if (userObj.nickName === event.nickName && userObj.avatarUrl === event.avatarUrl) {}
    else {
      db.collection('user').where({
        openid: wxContext.OPENID
      }).update({
        data: params
      })
    }
  }
  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
  }
}