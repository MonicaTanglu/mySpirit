// pages/new/new.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      title: '',
      category: '',
      share: 0,
      detail: ''
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
    this.setData({
      'form.category': selected
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
  }
})