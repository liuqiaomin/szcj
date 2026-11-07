const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    page_size: 20,
    SHXY:false,
    total:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.get();
  },
  get() {
    let that = this
    let in_data = {
      Type: "get",
      Table: "Presalelist",
      ORDER_nane: "Sort",
      ORDER_da: "ASC",
      page: that.data.page,
      page_size: that.data.page_size,
    };
    app.r(in_data.Type, in_data, function (res) {
      if (res.page_info.total_items == 0) {
        wx.showToast({
          title: '暂无商品！',
          icon: 'none',
          duration: 2000
        })
      } else {
        that.setData({
          SHXY: app.globalData.User.SHXY,
          list: that.data.list.concat(res.data),
          total: Number(res.page_info.total_items)
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.list.length == this.data.total) {
      wx.showToast({
        title: '全部在这了!',
      })
      return
    }
    this.setData({
      page: this.data.page + 1
    })
    this.get()
  },
})