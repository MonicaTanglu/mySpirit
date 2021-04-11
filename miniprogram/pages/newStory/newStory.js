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
      chaptorNum: 1,
      chaptorId: null
    },
    // this.data.articleId = detail.articleId
    currentField: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.data.form.id = options.id // 文章id
      this.data.form.chaptorId = options.chaptorId
      if(options.chaptorId) this.getDetail(options)

      if(options.title) {
        // this.data.form.title = options.title
        // this.data.form.chaptorNum = options.chaptorNum
        this.setData({
          'form.title': options.title,
          'form.chaptorNum': options.chaptorNum
        })
      }
    }
  },
  async getDetail(id) {
    wx.cloud.callFunction({
      name: 'get',
      data: {
        id: this.data.form.chaptorId,
        action: 'storyDetail'
      },
      success: (res) => {
        let detail = res.result.data[0]
        this.setData({
          'form.title': detail.title,
          'form.detail': detail.detail,
          'form.chaptorNum': detail.chaptorNum,
          'form.introduce': detail.introduce
        })
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
            if(this.data.form.chaptorId) {
              this.showToast('修改成功')
            } else {
              this.showToast('新增成功')
            }
            
            wx.setStorageSync('articleUpdate', true)
            setTimeout(() => {
              wx.navigateBack({
                delta: 0,
              })
            }, 500);
          },
          fail: err => {
            if(this.data.form.chaptorId) {
              this.showToast('修改失败')
            } else {
              this.showToast('新增失败')
            }
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
      icon: 'null'
    })
  }
})