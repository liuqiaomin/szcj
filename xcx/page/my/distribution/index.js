const API = require("../../../module/Api.js").API;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    XY: false
  },
  formSubmit(e) {
    let o = e.detail.value;
    console.log('form', o)
    if (o.distribution_name == '') {
      wx.showToast({
        title: '请填写您的姓名',
        icon: 'none',
      })
      return
    }
    if (o.distribution_phone == '') {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
      })
      return
    }
    if (o.distribution_alipay == '') {
      wx.showToast({
        title: '请填写支付宝',
        icon: 'none',
      })
      return
    }
    if (o.distribution_bank_card == '') {
      wx.showToast({
        title: '请填写银行卡',
        icon: 'none',
      })
      return
    }
    wx.showLoading({
      title: '申请中',
    })

    let that = this
    let data = {
      Type: "xcx_User_distribution",
      Table: "xcx_User",
      item: JSON.stringify(o)
    }
    API.get(data)
      .then(res => {
        wx.hideLoading()
        console.log(res)
        if (res.status.error_code == 1) {
          wx.showToast({
            title: '申请失败！',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.onShow()
        }
      })
      .catch(error => {
        console.error('错误', error);
      });

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    let data = {
      Type: "id_get",
      Table: "xcx_User",
      WHERE1_name: "id",
      WHERE1_price: app.globalData.User.id,
    }
    API.get(data)
      .then(res => {
        console.log(res)
        if (res.status.error_code == 1) {
          wx.showToast({
            title: '获取失败！',
            icon: 'none',
            duration: 2000
          })
        } else {
          app.globalData.User = res.data;
          that.setData({
            User: res.data,
            XY: true
          })
          if (res.data.distribution_ma == '无') {
            that.Qr()
          }
        }
      })
      .catch(error => {
        console.error('错误', error);
      });
  },
  Qr() {
    let that = this
    let data = {

    }
    API.Qr(data)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.error('错误', error);
      });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: [this.data.User.distribution_ma],
      current: this.data.User.distribution_ma
    });
  },
  tx() {
    let that = this
    if (that.data.User.commission == 0) {
      wx.showToast({
        title: '佣金为0！',
        icon: 'error',
        duration: 2000
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定要申请提现吗？',
      complete: (res) => {
        if (res.cancel) {
          console.log('点击取消')
        }

        if (res.confirm) {
          console.log('点击确定')
          let in_data = {
            Type: "page_my_distribution_index_tx",
            Table: "xcx_User",
          };
          app.r(in_data.Type, in_data, function (res) {
            if (res.status.error_code == 0) {
              wx.showToast({
                title: res.status.error_msg,
                icon: 'success',
                duration: 8000
              })
              setTimeout(function () {
                that.onShow()
              }, 2000)

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
  },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh() {
    this.onShow()
  },
  onShareAppMessage() {
    return {
      title: '深圳餐具小程序',
      imageUrl: '/images/logo.jpg',
      path: '/page/home?T_openid=' + app.globalData.User._openid,
    }
  }
})