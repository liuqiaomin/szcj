const app = getApp()
Page({
  data: {
    i: 0,
    tindex: null,
    ColorList: [{
        title: '50'
      }, {
        title: '100'
      }, {
        title: '200'
      }, {
        title: '500'
      },
      {
        title: '1000'
      }, {
        title: '2000'
      }, {
        title: '3000'
      }, {
        title: '4000'
      },
      {
        title: '5000'
      }, {
        title: '10000'
      },
    ],
    ColorList_list: ''
  },

  tindexb(e) {
    const i = e.currentTarget.dataset.i
    const index = e.currentTarget.dataset.index
    const find = this.data.ColorList_list.find(item => item.a == i.title)
    this.setData({
      tindex: index,
      i: i.title,
      find: find ? find : null
    })
  },

  f() {
    let that = this
    let i = that.data.i
    if (!i || i == 0) {
      wx.showToast({
        title: '请选择充值金额',
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定充值' + i + '元吗？',
      success(res) {
        if (res.confirm) {
          that.pay()
        }
      }
    })
  },

  pay() {
    let that = this
    let data = {
      sum: that.data.i,
      ms: '深圳餐具小程序余额充值',
    }
    wx.showModal({
      title: '提示',
      content: '支付完成后,请一定点【支付完成】',
      success(res) {
        if (res.confirm) {
          app.r('pay', data, function (payRes) {
            let pay = payRes.data.pay_params
            wx.requestPayment({
              'timeStamp': pay.timeStamp,
              'nonceStr': pay.nonceStr,
              'package': pay.package,
              'signType': 'MD5',
              'paySign': pay.paySign,
              'success': function (res) {
                if (res.errMsg == "requestPayment:ok") {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 2000
                  })
                  that.up()
                } else {
                  wx.showToast({
                    title: '支付失败！',
                    icon: 'none',
                    duration: 2000
                  })
                }
              },
              'fail': function () {
                wx.showToast({
                  title: '支付取消',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          })
        }
      }
    })
  },

  up() {
    let that = this
    let i = that.data.i
    let data = {
      Type: "balance_xcx_User_up",
      Table: "xcx_User",
      balance: i,
      id: app.globalData.User.id,
      original_balance: app.globalData.User.balance,
      Avatar: app.globalData.User.Avatar,
      name: app.globalData.User.name,
      find: JSON.stringify(that.data.find),
    }
    app.r(data.Type, data, function (res) {
      if (res.status.error_code == 1) {
        wx.showToast({
          title: '充值失败！',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '充值成功！',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/page/my/balance/balance_list'
          })
        }, 2000)
      }
    })
  },

  onShow() {
    this.setData({
      ColorList_list: JSON.parse(app.globalData.branch_list.ColorList_list),
    })
    this.user()
  },

  user() {
    let that = this
    let in_data = {
      Type: "id_get",
      Table: "xcx_User",
      WHERE1_name: "id",
      WHERE1_price: app.globalData.User.id,
    }
    app.r(in_data.Type, in_data, function (res) {
      if (res.status.error_code == 1) {
        wx.showToast({
          title: '获取失败！',
          icon: 'none',
          duration: 2000
        })
      } else {
        app.globalData.User = res.data
        that.setData({
          User: res.data
        })
      }
    })
  },
  //补充信息
  supplement() {
    wx.navigateTo({
      url: '/page/index/supplement/index',
    })
  },
})