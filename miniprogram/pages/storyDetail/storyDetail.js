// pages/myStory/myStory.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    chaptorId: null,
    detail: null,
    popShow: false,
    currentOpenid: '',
    commentContent: '',
    commentList: [],
    articleId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.data.chaptorId = options.id
    const openid = wx.getStorageSync('openid')
    this.setData({
      openid: openid
    })
    await this.getDetail(options.id)
    this.getCommentList()
  },
  async getDetail() {
    let {
      result
    } = await wx.cloud.callFunction({
      name: 'get',
      data: {
        id: this.data.chaptorId,
        action: 'storyDetail'
      }
    })
    let detail = result.data[0]
    this.data.id = detail._id
    this.data.articleId = detail.articleId
    this.setData({
      detail
    })
  },
  popHandle() {
    let openid = wx.getStorageSync('openid')
    if(openid !== this.data.detail.openid) return
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
              icon: 'null'
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
      url: '/pages/newStory/newStory?id=' + this.data.articleId + '&&chaptorId=' + this.data.chaptorId,
    })
  },
  deleteComment(e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'delete',
            data: {
              id: e.currentTarget.dataset.id,
              
              action: 'deleteComment'
            },
            success: (res) => {
              if (res.result.data) {
                that.showToast('删除成功')
                that.getCommentList()
              }
            }
          })
        }
      }
    })

  },
  delete() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'delete',
            data: {
              action: 'deleteArticle',
              chaptorId: that.data.chaptorId,
              id: that.data.id
            },
            success: (res) => {
              if (res.result.data) {
                that.showToast('删除成功', 'success')
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 0,
                  })
                }, 500);
                
              }
            }
          })
        }
      }
    })()
  },
  showToast(content, icon = "success") {
    wx.showToast({
      title: content,
      icon: icon
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
    this.setData({
      popShow: false
    })
    if (this.data.id) this.getDetail()
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