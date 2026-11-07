const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    page_size: 10,
    ii: 'all',

    TabCurs: [
      {
        i: '全部订单',
        ii: 'all',
      },
      {
        i: '待配送',
        ii: 0,
      },
      {
        i: '配送中',
        ii: 2,
      },
      {
        i: '已完成',
        ii: 3,
      }, {
        i: '退货中',
        ii: 5,
      }
      , {
        i: '已取消',
        ii: 7,
      }],
    TabCur: 0,
    scrollLeft: 0
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      ii: e.currentTarget.dataset.ii,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      list: [],
      page: 1,
      page_size: 10,
    })
    this.get()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    if (options.ii) {
      this.setData({
        TabCur: 1,
        ii: options.ii
      })
      this.get()
    } else {
      this.get()
    }


  },
  get() {
    console.log('get')
    let that = this;
    let in_data = {
      Type: "order_list_get",
      Table: "order_list",
      state: that.data.ii,
      page: that.data.page,
      page_size: that.data.page_size
    }
    app.r(in_data.Type, in_data, function (res) {
      console.log(res)
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
  xq(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/page/my/Order/xq?id=' + item.id + '&order_list_id=' + item.order_list_id,
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
  // 拨打电话 
  freeTell: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  zlyd(e) {
    console.log(e.currentTarget.dataset.id)
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定再来一单吗？',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          let in_data = {
            Type: "zlyd",
            Table: "zlyd",
            id: e.currentTarget.dataset.id
          }
          app.r(in_data.Type, in_data, function (res) {
            if (res.status.error_code == 0) {
              wx.showToast({
                title: '商品已加入购物车',
                duration: 5000
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '/page/ShoppingCart/index',
                })
              }, 3000)

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
    });
  }
})