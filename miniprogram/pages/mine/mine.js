// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: '/images/default-avatar.png',
      nickName: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = app.globalData.userInfo ? app.globalData.userInfo : wx.getStorageSync('userInfo')
    if (userInfo) {
      app.globalData.userInfo = userInfo
      this.setData({
        userInfo: userInfo
      })
    }
  },

  getUserInfo() {
    wx.getUserProfile({
      desc: '存储文章作者昵称，头像信息',
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo)
        app.globalData.userInfo = res.userInfo
        this.login()
        this.setData({
          userInfo: res.userInfo
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '获取信息失败',
          icon: 'null'
        })
      }
    })
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
    this.setBarSelected()
    if (!app.globalData.userInfo) {
      this.setData({
        userInfo: {
          avatarUrl: '/images/default-avatar.png',
          nickName: ''
        }
      })
    }
  },
  setBarSelected() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
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

  },
  async login() {
    let userObj = wx.getStorageSync('userInfo')
    wx.cloud.callFunction({
      name: 'login',
      data: {
        avatarUrl: userObj ? userObj.avatarUrl : '',
        nickName: userObj ? userObj.nickName : ''
      },
      success: res => {
        app.globalData.openid = res.result.openid
        wx.setStorageSync('openid', res.result.openid)
        this.data.openid = res.result.openid
        // this.getList()
      }
    })
  },
  goTo(e) {
    let url = e.currentTarget.dataset.url
    if (url) {
      if (!this.data.userInfo.nickName) {
        wx.showToast({
          title: '请先登录！',
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: url,
        })
      }

    }
  }
})