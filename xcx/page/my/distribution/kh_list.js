const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    page_size: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.get()
  },
  get() {
    console.log('get')
    let that = this;
    let in_data = {
      Type: "page_my_distribution_kh_list_get",
      Table: "xcx_User",
      page: that.data.page,
      page_size: that.data.page_size
    }
    app.r(in_data.Type, in_data, function (res) {
      if (res.status.error_code == 0) {
        that.setData({
          list: that.data.list.concat(res.data),
          total: Number(res.page_info.total_items)
        })
      } else {
        wx.showToast({
          title: res.status.error_msg,
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  onReachBottom: function () {
    console.log('页面上拉触底事件的处理函数')
    if (this.data.list.length == this.data.total) {
      wx.showToast({
        icon: 'none',
        duration: 2000,
        title: '全部在这了!',
      })
      return
    }
    this.setData({
      page: this.data.page + 1
    })
    this.get()
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh() {
    console.log('监听用户下拉动作')
    const that = this
    that.setData({
      list: [],
      page: 1,
      page_size: 20,
    })
    that.get()
  },

})