// page/index/supplement/protocol.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad(options) {
    this.setData({
      protocol: app.globalData.branch_list.protocol
    })
  },
})