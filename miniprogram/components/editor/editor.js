// components/editor.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: String,
      value: null,
      observer: function (newVal, oldVal) {
        debugger
        if(this.editorCtx) this.editorCtx.setContents({html: newVal})
        else this.content = newVal
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    formats: {},
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    content: ''
  },

  lifetimes: {
    ready() {
      // const that = this
      // wx.createSelectorQuery().select('#editor').context(function (res) {
      //   console.log(res)
      //   that.editorCtx = res.context
      // }).exec()
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onStatusChange(e) {
      const formats = e.detail
      console.log(formats, 'format')
      this.setData({
        formats
      })
    },
    format(e) {
      let {
        name,
        value
      } = e.target.dataset
      if (!name) return
      // console.log('format', name, value)
      this.editorCtx.format(name, value)

    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success')
        }
      })
    },
    clear() {
      this.editorCtx.clear({
        success: function (res) {
          console.log("clear success")
        }
      })
    },
    removeFormat() {
      this.editorCtx.removeFormat()
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate
      })
    },
    insertImage() {
      const that = this
      wx.chooseImage({
        count: 1,
        success: function (res) {
          that.editorCtx.insertImage({
            src: res.tempFilePaths[0],
            data: {
              id: 'abcd',
              role: 'god'
            },
            width: '80%',
            success: function () {
              console.log('insert image success')
            }
          })
        }
      })
    },
    onEditorReady() {
      const that = this
      this.createSelectorQuery().select('#editor').context(function (res) {
        console.log(that.properties.detail, 'properties')
        that.editorCtx = res.context
        if (that.properties.detail) that.editorCtx.setContents({
          html: that.properties.detail
        })
      }).exec()
    },
    editorChange(res) {
      // console.log(res, 'editorChange')
      // this.properties.detail = res.detail.delta
      this.triggerEvent('editorChange', {
        html: res.detail.html,
        text: res.detail.text,
        delta: res.detail.delta
      })
    }
  }
})