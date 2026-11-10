const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minutes: 10, // 倒计时时间，这里设置为10分钟
    seconds: 0, // 初始秒数为0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '',
    })

    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    this.pays()
  },
  // 倒计时
  startCountdown: function () {
    let that = this;
    const interval = setInterval(() => {
      if (that.data.minutes > 0 || that.data.seconds > 0) {
        // 减少秒数
        if (that.data.seconds > 0) {
          that.setData({
            seconds: that.data.seconds - 1,
          });
        } else {
          // 如果秒数为0，则减少分钟数，并重置秒数为59
          that.setData({
            minutes: that.data.minutes - 1,
            seconds: 59,
          });
        }
      } else {
        // 倒计时结束
        clearInterval(interval);
        that.setData({
          minutes: 0,
          seconds: 0,
        });
        wx.reLaunch({
          url: '/page/my/Order/index',
        })
      }
    }, 1000);
  },
  pays() {
    let that = this
    let in_data = {
      Type: "Ypay",
      Table: "Ypay",
      id: that.data.id
    };
    app.r(in_data.Type, in_data, function (res) {
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
      let o = res.data;
      let pay = o.pay_params;
      that.setData({
        Preorder: o.Preorder,
        list: o.data,
      })
      that.startCountdown()
      wx.requestPayment({
        'timeStamp': pay.timeStamp,
        'nonceStr': pay.nonceStr,
        'package': pay.package,
        'signType': 'MD5',
        'paySign': pay.paySign,
        'success': function (res) {
          console.log(res)
          if (res.errMs = "requestPayment:ok") {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            let in_data = {
              Type: "Ypay_success",
              Table: "Ypay_success",
              id: that.data.id
            };
            app.r(in_data.Type, in_data, function (res) {
              wx.reLaunch({
                url: '/page/my/Order/index',
              })
            })
          } else {
            wx.showToast({
              title: '支付失败！',
              icon: 'none',
              duration: 2000
            })
            wx.reLaunch({
              url: '/page/my/Order/index',
            })
          }
          //支付成功
        },
        'fail': function (res) {
          //支付失败
        }

      })
    })
  }
})