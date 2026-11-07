var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      options: options
    })
    this.get()
    this.orders()
  },
  get() {
    let that = this;
    let options = that.data.options;
    let in_data = {
      Type: "id_get",
      Table: "order_list",
      WHERE1_name: 'id',
      WHERE1_price: options.id
    }
    app.r(in_data.Type, in_data, function (res) {
      if (res.status.error_code == 0) {
        let o = res.data;
        that.setData({
          xq: o,
          yh_price: (o.Ymeet - o.order_total_price).toFixed(2)
        })
        if (o.receipt_photo_list) {
          that.setData({
            receipt_photo_list: JSON.parse(o.receipt_photo_list)
          })
        }
        if (o.Coupons_list) {
          that.setData({
            Coupons_list: JSON.parse(o.Coupons_list)
          })
        }
      } else {
        wx.showToast({
          title: res.status.error_msg,
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  // 拨打电话 
  freeTell: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  orders() {
    let that = this;
    let options = that.data.options;
    let in_data = {
      Type: "orders_get",
      Table: "orders",
      Yid: options.order_list_id,
    }
    app.r(in_data.Type, in_data, function (res) {
      if (res.status.error_code == 0) {
        that.setData({
          list: res.data,
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
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.receipt_photo_list,
      current: e.currentTarget.dataset.url
    });
  },
  td() {
    wx.showModal({
      title: '温馨提示',
      content: '确定要申请退单吗？',
      complete: (res) => {
        if (res.cancel) {
          console.log('点击取消')
        }
        if (res.confirm) {
          console.log('点击确定')
          let that = this
          let in_data = {
            Type: "page_my_index_td",
            Table: "order_list",
            id: that.data.options.id,
          };
          app.r(in_data.Type, in_data, function (res) {
            console.log(res)
            if (res.status.error_code == 0) {
              wx.showToast({
                title: res.status.error_msg,
                icon: 'success',
                duration: 2000
              })
              that.get()
            } else {
              wx.showToast({
                title: res.status.error_msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })
  }
})