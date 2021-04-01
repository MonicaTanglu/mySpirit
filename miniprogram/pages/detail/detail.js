// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id ? options.id : '17453ede6062d68e00044a5d601abb87'
    console.log(options)
    this.getDetail(options.id)
  },
  async getDetail() {
    let {result} = await wx.cloud.callFunction({
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
    console.log('getDetail', result,this.data.detail.detail.ops)
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