const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    let in_data = {
      Type: "id_get",
      Table: "xcx_User",
      WHERE1_name: "id",
      WHERE1_price: app.globalData.User.id,
    };
    app.r(in_data.Type, in_data, function (res) {
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
        })
      }
    })
  },
  /**
    * 获取微信地址
    */
  chooseAddress: function () {
    let _this = this;
    wx.chooseAddress({
      success(res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },

})