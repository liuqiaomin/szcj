const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    T_openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      loadModal: true
    })
    this.login()
  },
  login() {
    let that = this
    wx.login({
      success: function (res) { //发送请求
        getApp().r('login', { code: res.code, T_openid: getApp().globalData.T_openid }, function (res) {
          console.log(res)
          setTimeout(() => {
            that.setData({
              loadModal: false
            })
          }, 2000)
          let o = res.data;
          getApp().globalData.User = o.user;         
          if (o.user.Block == 1) {
            that.LH()
            return
          } else {
            wx.reLaunch({
              url: '/page/index/index',
            })
          }
        })
      }
    })
  },
  LH() {
    wx.showModal({
      title: '温馨提示',
      content: '网络错误！',
      complete: (res) => {
        if (res.cancel) {
          this.LH()
        }
        if (res.confirm) {
          this.LH()
        }
      }
    })
  },
  loadModal() {
    this.setData({
      loadModal: true
    })
    setTimeout(() => {
      this.setData({
        loadModal: false
      })
    }, 2000)
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