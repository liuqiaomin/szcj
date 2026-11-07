const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    page_size: 20,
    isCard: false
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.get();
  },
  get() {
    let that = this
    let in_data = {
      Type: "page_Samecity_index_get",
      Table: "xcx_city_list",
      ORDER_nane: "timestamp",
      ORDER_da: "desc",
      WHERE1_name: "XY",
      WHERE1_price: 1,
      page: that.data.page,
      page_size: that.data.page_size,
    };
    app.r(in_data.Type, in_data, function (res) {

      if (res.page_info.total_items == 0) {
        wx.showToast({
          title: '暂无信息',
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
  ViewImage(e) {
    let u = e.currentTarget.dataset.i;
    let image_list = JSON.parse(u.image_list);
    image_list.push(u.image); // 直接修改原数组
    console.log(image_list); // 打印整个数组以查看添加的结果
    wx.previewImage({
      urls: image_list,
      current: e.currentTarget.dataset.url
    });
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    if (this.data.list.length == this.data.total) {
      wx.showToast({
        title: '全部在这了!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      page: this.data.page + 1
    })
    this.get()
  },
})