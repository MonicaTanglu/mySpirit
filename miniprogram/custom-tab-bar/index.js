const app = getApp()
Component({
  data: {
    selected: 0,
    color: "#333",
    selectedColor: "#ffffff",
    list: [{
      "pagePath": "/pages/index/index",
      "text": "文化"
    }, {
      "pagePath": "/pages/movie/movie",
      "text": "电影"
    }, {
      "pagePath": "/pages/mine/mine",
      "text": "个人"
    }],
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      // this.setData({
      //   selected: data.index
      // })
    },
    goTo() {
      const userInfo = app.globalData.userInfo ? app.globalData.userInfo : wx.getStorageSync('userInfo')
      if (!userInfo) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/mine/mine'
          })
        }, 500);
        // wx.getUserProfile({
        //   desc: '存储文章作者昵称，头像信息',
        //   success: (res) => {
        //     wx.setStorageSync('userInfo', res.userInfo)
        //     app.globalData.userInfo = res.userInfo
        //     wx.navigateTo({
        //       url: '/pages/new/new?selected=' + this.data.selected,
        //     })
        //   },
        //   fail: () => {
        //     wx.showToast({
        //       title: '获取用户信息失败',
        //       icon: null
        //     })
        //   }
        // })
      } else {
        app.globalData.userInfo = userInfo
        wx.navigateTo({
          url: '/pages/new/new?selected=' + this.data.selected,
        })
      }

    }
  }
})