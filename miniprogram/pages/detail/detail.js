// pages/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    detail: null,
    popShow: false,
    currentOpenid: '',
    commentContent: '',
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id ? options.id : '17453ede6066719e0051f093789f2af7'
    const openid = wx.getStorageSync('openid')
    this.setData({
      openid: openid
    })
    this.getDetail(options.id)
    this.getCommentList()
  },
  async getDetail() {
    let {
      result
    } = await wx.cloud.callFunction({
      name: 'get',
      data: {
        id: this.data.id,
        action: 'articleDetail'
      }
    })
    let detail = result.data[0]
    this.setData({
      detail
    })
  },
  popHandle() {
    this.setData({
      popShow: true
    })
  },
  onClose() {
    this.setData({
      popShow: false
    })
  },
  async getCommentList() {
    wx.cloud.callFunction({
      name: 'get',
      data: {
        action: 'comment',
        id: this.data.id
      },
      success: (res) => {
        let commentList = res.result.data
        this.setData({
          commentList: commentList
        })
      }
    })
  },
  async submitComment() {
    let userInfo = await this.getUserInfo()
    if (!this.data.commentContent) {
      wx.showToast({
        title: '请填写评论',
        icon: 'null'
      })
      return
    }
    wx.cloud.callFunction({
      name: 'create',
      data: {
        action: 'comment',
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        content: this.data.commentContent,
        articleId: this.data.id
      },
      success: (res) => {
        if (res) {
          wx.showToast({
            title: '评论成功'
          })
          this.setData({
            commentContent: ''
          })
          this.getCommentList()
        }
      }
    })
  },
  getUserInfo() {
    return new Promise((resolve, reject) => {
      const userInfo = wx.getStorageSync('userInfo')
      if (!userInfo) {
        wx.getUserInfo({
          success: (res) => {
            wx.setStorageSync('userInfo', res.userInfo)
            app.globalData.userInfo = res.userInfo
            resolve(res.userInfo)
          },
          fail: () => {
            wx.showToast({
              title: '获取用户信息失败',
              icon: null
            })
            resolve(false)
          }
        })
      } else {
        app.globalData.userInfo = userInfo
        resolve(userInfo)
      }
    })
  },
  onChange(e) {
    this.setData({
      commentContent: e.detail
    })
  },
  edit() {
    wx.navigateTo({
      url: '/pages/new/new?id=' + this.data.id,
    })
  },
  delete() {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if(res.confirm) {

        }
      }
    })()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})