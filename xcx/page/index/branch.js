const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    page_size: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    let in_data = {
      Type: "get",
      Table: "branch_list",
      ORDER_nane: "identifying",
      ORDER_da: "ASC",
      page: that.data.page,
      page_size: that.data.page_size,
    };
    app.r(in_data.Type, in_data, function (res) {
      if (res.page_info.total_items == 0) {
        wx.showToast({
          title: '暂无分店',
          icon: 'none',
          duration: 2000
        })
      } else {
        that.setData({
          list: that.data.list.concat(res.data),
          total: Number(res.page_info.total_items)
        })
      }
    })
  },
  qh(e) {
    let i = e.currentTarget.dataset.i;
    app.globalData.branch_list = i;
    app.globalData.identifying = i.identifying
    wx.navigateBack(1)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})