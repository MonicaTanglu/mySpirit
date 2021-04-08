// pages/newStory/newStory.js
import util from '../../js/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      id: null,
      title: '',
      category: 3,
      share: 1,
      detail: '',
      introduce: '',
      chaptorNum: 1
    },
    currentField: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.data.form.id = options.id
      this.getDetail(options.id)
    }
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
          'form.detail': detail.detail,
          'form.chaptorNum': detail.chaptorNum,
          'form.introduce': detail.introduce
        })
        console.log(detail, this.data.form)
      }
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
  inputNumChange(e) {
    if (/\d+/.test(e.detail)) {
      this.setData({
        [`form.${e.currentTarget.dataset.field}`]: e.detail
      })
    } else {
      this.showToast('章节号格式不正确！')
      return false
    }
  },
  editorChange(e) {
    console.log('editorChange', e)
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
    } else if(!this.data.form.chaptorNum) {
      this.showToast('请输入章节号')
      return 
    }else {
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