const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    app.globalData.Coupons = '';
    this.get()
  },
  get() {
    let that = this
    let in_data = {
      Type: "settlement",
      Table: "xcx_preorder",
    };
    app.r(in_data.Type, in_data, function (res) {
      that.setData({
        list: res.data.data,
        meet: res.data.meet ? res.data.meet : 0,
        deleteb: true
      })
    })
  },
  add(e) {
    let that = this;
    let item = e.currentTarget.dataset.item
    let in_data = {
      Type: "preorder_add",
      Table: "xcx_preorder",
      product_id: item.product_id,
      unitprice: item.unit_price,
      product_quantity: 1,
      total_price: item.level_price,//下单单价 等级
    }
    // return
    app.r(in_data.Type, in_data, function (res) {
      if (res.status.error_code == 0) {
        console.log('添加成功！')
        that.get()
      } else {
        wx.showToast({
          title: res.status.error_msg,
          icon: 'none',
          duration: 2000
        })
      }
    })

  },

  //删除一个
  delete(e) {
    let that = this;
    let item = e.currentTarget.dataset.item
    if (item.product_quantity == 1) {
      wx.showModal({
        title: '提示',
        content: '要删除这个商品吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            let d = {
              Type: "preorder_SCdelete",
              Table: "xcx_preorder",
              product_id: item.product_id, //商品ID
              xcx_Yid: item.xcx_Yid,
            }
            that.d(d)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    that.setData({
      deleteb: false
    })
    let in_data = {
      Type: "preorder_delete",
      Table: "xcx_preorder",
      product_id: item.product_id, //商品ID
    }
    app.r(in_data.Type, in_data, function (res) {
      if (res.status.error_code == 0) {
        that.get()
      } else {
        wx.showToast({
          title: res.status.error_msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //删除商品
  d(in_data) {
    let that = this
    app.r(in_data.Type, in_data, function (res) {
      if (res.status.error_code == 0) {
        that.get()
      } else {
        wx.showToast({
          title: res.status.error_msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  TZ(e) {
    wx.navigateTo({
      url: '/page/index/xq?id=' + e.currentTarget.dataset.id,
    })
  },
})