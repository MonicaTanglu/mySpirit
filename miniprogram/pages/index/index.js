// pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    db: null,
    pageNow: 1,
    pageSize: 20,
    list: [],
    loading : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.openid) this.data.openid = app.globalData.openid
    else {
      const openid = wx.getStorageSync('openid')
      this.data.openid = openid
    }
    if (!this.data.openid) {
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
          this.getList()
        }
      })
    } else {
      app.globalData.openid = this.data.openid
      this.getList()
    }
  },
  async getList() {
    let originList = this.data.list
    let startIndex = (this.data.pageNow - 1) * this.data.pageSize
    wx.cloud.callFunction({
      name: 'get',
      data: {
        action: 'getStoryList',
        startIndex: startIndex,
        pageSize: this.data.pageSize
      },
      success: (res) => {
        if (res.result.code === 200) {
          originList = originList.concat(res.result.data)
          this.setData({
            list: originList,
            loading: false
          })
        }
      },
      fail: err => {
        console.log(err, 'err')
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
    const path = wx.getStorageSync('articleUpdate')
    if(path) {
      this.data.list = []
      this.getList()
      wx.removeStorageSync('articleUpdate')
    }
    // this.getList()
  },
  setBarSelected() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
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
    if (this.data.pageSize * this.data.pageNow >= this.data.list.length) {
      return;
    } else {
      this.data.pageNow++
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})