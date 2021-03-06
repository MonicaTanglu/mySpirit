// pages/new/new.js
import util from '../../js/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      id: null,
      title: '',
      category: '',
      share: 1,
      detail: '',
      introduce: '',
      chaptorNum: null,
      chaptorName: null
    },
    radio: 1,
    show: false,
    options: [],
    currentField: '',
    categoryOptions: [{
      title: '小说世界',
      name: 1
    }, {
      title: '电影世界',
      name: 2
    }],
    shareOption: [{
      title: '私有',
      name: 1,
    }, {
      title: '公开',
      name: 2,
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let selected = parseInt(options.selected) + 1
    if (options.id) {
      this.data.form.id = options.id
      this.getDetail(options.id)
    }
    this.setData({
      'form.category': selected
    })
  },
  async getDetail(id) {
    wx.cloud.callFunction({
      name: 'get',
      data: {
        id: id,
        action: 'articleDetail'
      },
      success: (res) => {
        let detail = res.result.data[0]
        this.setData({
          'form.title': detail.title,
          'form.category': detail.category,
          'form.share': detail.share,
          'form.detail': detail.detail,
          'form.introduce': detail.introduce
        })

      }
    })
  },
  onclose() {
    this.setData({
      show: false
    })
  },
  setDialog(e) {
    let type = e.currentTarget.dataset.type
    let options = this.data.options
    this.data.currentField = type
    if (type === 'category') {
      options = this.data.categoryOptions
    } else {
      options = this.data.shareOption
    }
    this.setData({
      options,
      show: true
    })
  },
  radioChange(e) {
    this.setData({
      [`form.${this.data.currentField}`]: e.detail,
      radio: e.detail
    })
  },
  cellClick(e) {
    this.radioChange({
      detail: e.currentTarget.dataset.name
    })
  },
  inputChange(e) {
    this.setData({
      [`form.${e.currentTarget.dataset.field}`]: e.detail
    })
  },
  editorChange(e) {
    this.data.form.detail = e.detail.html
    this.data.form.introduce = util.trim(String(e.detail.text).substr(0, 24))
  },
  submit() {
    if (!this.data.form.title) {
      this.showToast('请输入标题')
      return
    } else if (!this.data.form.detail) {
      this.showToast('请输入详细信息')
      return
    } else {
      if (this.data.form.id) {
        // 编辑
        wx.cloud.callFunction({
          name: 'createArticle',
          data: this.data.form,
          success: res => {
            this.showToast('修改成功')
            wx.setStorageSync('articleUpdate', true)
            setTimeout(() => {
              wx.navigateBack({
                delta: 0,
              })
            }, 500);
          },
          fail: err => {
            this.showToast('修改失败')
          }
        })
      } else {
        // 新增
        wx.cloud.callFunction({
          name: 'createArticle',
          data: this.data.form,
          success: res => {
            this.showToast('创建成功')
            wx.setStorageSync('articleUpdate', true)
            setTimeout(() => {
              wx.navigateBack({
                delta: 0,
              })
            }, 500);
          },
          fail: err => {
            this.showToast('创建失败')
          }
        })
      }
    }
  },

  showToast(info) {
    wx.showToast({
      title: info,
      icon: null
    })
  }
})