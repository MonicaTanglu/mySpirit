// pages/chaptor/chaptor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    list: [],
    loading: true,
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      title: options.title,
      id: options.id
    })
    this.getChaptorList(options.id)
  },
  getChaptorList(id) {
    wx.cloud.callFunction({
      name: 'get',
      data: {
        action: 'chaptor',
        articleId: id
      },
      success: (res) => {
        this.setData({
          loading: false,
          list: res.result.data
        })
      },
      fail: () => {

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
    if (this.data.id) this.getChaptorList(this.data.id)
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
  goTo() {
    wx.navigateTo({
      url: '/pages/newStory/newStory?title=' + this.data.title + '&&chaptorNum=' + (this.data.list.length + 1) + "&&id=" + this.data.id,
    })
  }
})