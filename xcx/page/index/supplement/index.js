const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xy2: false,
    XY: false,
    VXY: true,
    name: null, //	收货店名
    address: null, //	收货地址
    phone: null, //	收货电话

    Doorsign: null, //	门头
    Avatar: null, //	头像
    Niche: null //	呢称
  },
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
          VXY: res.data.SHXY == 0 ? true : false,
          XY: true
        })
      }
    })
  },
  //	收货店名
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //	收货地址
  address(e) {
    this.setData({
      address: e.detail.value
    })
  },
  //	收货电话
  phone(e) {
    let that = this
    if (e.detail.value.length == 11) {
      const regex = /^1[3-9]\d{9}$/;
      if (regex.test(e.detail.value)) {
        that.setData({
          phone: e.detail.value
        })
      } else {
        that.setData({
          phone: '手机号码格式不正确！'
        })
      }
    }
  },
  //头像
  onChooseAvatar(e) {
    let that = this
    const {
      avatarUrl
    } = e.detail
    wx.uploadFile({
      url: 'https://sc.szhxch.com/xcx/upload',
      filePath: avatarUrl,
      name: 'file',
      success(res) {
        wx.hideLoading()
        let data = JSON.parse(res.data) // ← 解析
        if (data.code == 0) {
          that.setData({
            Avatar: data.data.url, // ← 只存 URL 字符串
          })
          wx.showToast({
            title: '上传成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          })
        }
      }
    })

  },

  //	门头
  Doorsign() {
    let that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success(res) {
        wx.showLoading({
          title: '上传中',
        })
        let i = res.tempFiles[0]
        console.log(i.tempFilePath)
        console.log(i.size)
        wx.uploadFile({
          url: 'https://sc.szhxch.com/xcx/upload',
          filePath: i.tempFilePath,
          name: 'file',
          success(res) {
            wx.hideLoading()
            let data = JSON.parse(res.data) // ← 解析
            if (data.code == 0) {
              that.setData({
                Doorsign: data.data.url, // ← 只存 URL 字符串
              })
              wx.showToast({
                title: '上传成功',
                icon: 'success'
              })
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'none'
              })
            }
          }
        })
      }
    })
  },
  Niche(e) {
    this.setData({
      Niche: e.detail.value,
    })
    console.log(e.detail.value)
  },
  up() {
    let that = this
    let o = that.data;
    if (o.Doorsign == null) {
      wx.showToast({
        title: '请上传店铺门头!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (o.name == null) {
      wx.showToast({
        title: '请填写收货店名!',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (o.address == null) {
      wx.showToast({
        title: '请填写收货地址!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (o.phone == null) {
      wx.showToast({
        title: '请填写收货手机号!',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (o.Avatar == null) {
      wx.showToast({
        title: '请上传/选择头像!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (o.Niche == null) {
      wx.showToast({
        title: '请填写呢称!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.xy2 == false) {
      wx.showModal({
        title: '请阅读用户协议!',
        content: '是否去阅读',
        success(res) {
          if (res.confirm) {
            that.xybu()
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

      return
    }
    let data = {
      Type: 'xcx_User_up',
      Table: 'xcx_User',
      name: o.name, //	收货店名
      address: o.address, //	收货地址
      phone: o.phone, //	收货电话
      Doorsign: o.Doorsign, //	门头
      Avatar: o.Avatar, //	头像
      Niche: o.Niche, //	呢称
    }
    app.r(data.Type, function (res) {
      if (res.status.error_code == 0) {
        console.log(res)
        that.sm()
      }
    })
  },
  sm() {
    let that = this
    wx.showModal({
      title: '保存成功',
      content: '',
      success(res) {
        if (res.confirm) {
          that.setData({
            VXY: false
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 拨打电话 
  freeTell: function () {
    wx.makePhoneCall({
      phoneNumber: '13510398108'
    })
  },
  //查看协议
  xybu() {
    this.setData({
      xy2: true
    })
    wx.navigateTo({
      url: './protocol',
    })
  }
})