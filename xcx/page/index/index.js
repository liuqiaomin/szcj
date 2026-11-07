const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getLocation_XY: true,
    notice: '', //滚动公告
    SHXY: 0, //用户权限
    branch_list: '',
    list: [],
    page: 1,
    page_size: 100,
    modalName: '',
    search: '',
    coupons: []
  },
  onShow: function () {
    this.branch_list_get()
    //获取用户信息
    this.setData({
      SHXY: app.globalData.User.SHXY,
      modalName: app.globalData.User.SHXY != 1 ? 'Modal' : ''
    })
  },
  onLoad() {
    //页面跳转
    let e = getApp().globalData.e;
    if (e.path == 'page/my/Order/index') {
      wx.navigateTo({
        url: '/' + e.path,
      })
      return
    }
    if (e.query.p == 'xq') {
      wx.navigateTo({
        url: '/page/index/xq?id=' + e.query.id,
      })
      return
    }
  },
  //获取默认分店
  branch_list_get() {
    let that = this
    let in_data = {
      Type: "branch_list_get",
      Table: "branch_list_get",
    };
    app.r('branch_list_get', in_data, function (res) {
      console.log(res.data)
      if (res.status.error_code == 0) {
        let o = res.data;
        app.globalData.branch_list = o.branch_list
        app.globalData.identifying = o.branch_list.identifying
        that.setData({
          ProductCategory: o.ProductCategory,
          branch_list: o.branch_list,
          marketinglist: o.marketinglist,
          list: o.list,
          Coupons: o.Coupons,
        })
        //尝试获取用户附近的仓库
        if (getApp().globalData.e && getApp().globalData.e.query.p) {
          //存在跳转 不获取定位
          console.log('存在跳转 不获取定位')
        } else {
          console.log('尝试获取用户附近的仓库')
          that.getLocation();
        }

        if (getApp().globalData.getLocation) {
          //用户坐标已存在 计算距离
          console.log('用户坐标已存在 计算距离')
          that.jl()
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //获取商品
  get() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let in_data = {
      Type: "products_get_identifying",
      Table: "products",
      page: that.data.page,
    }
    app.r(in_data.Type, in_data, function (res) {
      wx.hideLoading()
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
  //计算距离
  jl() {
    let p = getApp().globalData.getLocation
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // 地球半径，单位：千米  
      const dLat = deg2rad(lat2 - lat1); // 纬度差转换为弧度  
      const dLon = deg2rad(lon2 - lon1); // 经度差转换为弧度  
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // 计算距离  
      return distance;
    }

    function deg2rad(deg) {
      return deg * (Math.PI / 180); // 将角度转换为弧度  
    }
    // 使用示例  
    const lat1 = app.globalData.branch_list.latitude; // 第一个点的纬度  
    const lon1 = app.globalData.branch_list.longitude; // 第一个点的经度  
    const lat2 = p.latitude /* 第二个点的纬度 */; // 请替换为第二个点的纬度  
    const lon2 = p.longitude /* 第二个点的经度 */; // 请替换为第二个点的经度  

    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    this.setData({
      distance: parseFloat(distance).toFixed(2),
    })
  },
  //获取用户坐标
  getLocation: function (e) {
    if (getApp().globalData.getLocation) {
      console.log('已获取用户坐标')
      return
    }
    var that = this
    wx.getLocation({
      type: 'wgs84', // 坐标系，默认是 wgs84  
      success: function (res) {
        let getLocation = {
          latitude: res.latitude,
          longitude: res.longitude,
        }
        getApp().globalData.getLocation = getLocation;
        //获取坐标附近的分店
        that.setData({
          getLocation_XY: false
        })
        that.store(getLocation)
      },
      fail: function (err) {
        // 获取位置失败的处理逻辑  
        console.error(err);
        that.cxsq()
      }
    });
  },
  //获取用户附近仓库信息
  store(getLocation) {
    var that = this
    let in_data = {
      Type: "store_get",
      Table: "branch_list",
      latitude: getLocation.latitude,
      longitude: getLocation.longitude,
    };
    app.r(in_data.Type, in_data, function (res) {
      app.globalData.branch_list = res.data;
      that.branch_list_get();
      that.jl();
    })
  },
  cxsq() {
    const that = this
  
    wx.getSetting({
      success(res0) {
        // 已授权 → 直接获取定位
        if (res0.authSetting['scope.userLocation'] !== false) {
          that.getLocation()
          return
        }
  
        // 未授权 → 弹窗引导
        wx.showModal({
          title: '需要位置权限',
          content: '为了显示离您最近的仓库，请授权地理位置',
          confirmText: '去授权',
          cancelText: '使用默认',
          success(res2) {
            if (res2.confirm) {
              // 用户点"去授权" → 打开设置页
              wx.openSetting({
                success(res3) {
                  if (res3.authSetting['scope.userLocation']) {
                    // 授权成功 → 获取定位
                    wx.getLocation({
                      type: 'wgs84',
                      success: that.getLocation.bind(that),
                      fail() {
                        console.log('获取定位失败，使用默认城市')
                        that.useDefaultCity() // 你已有的默认逻辑
                      }
                    })
                  } else {
                    // 仍然未授权 → 用默认
                    console.log('用户未授权，使用默认城市')
                    that.useDefaultCity()
                  }
                },
                fail() {
                  that.useDefaultCity()
                }
              })
            } else {
              // 用户点"使用默认" → 不递归，直接用默认
              console.log('用户拒绝授权，使用默认城市')
              that.useDefaultCity()
            }
          }
        })
      },
      fail() {
        that.useDefaultCity()
      }
    })
  },
  // 拨打电话 
  freeTell: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.branch_list.phone
    })
  },
  //​使用微信内置地图查看位置。
  openLoca() {
    let i = this.data.branch_list;
    wx.openLocation({
      latitude: parseFloat(i.latitude), //要去的纬度-地址
      longitude: parseFloat(i.longitude), //要去的经度-地址
      address: i.address,
      name: i.branch_name
    })
  },
  TZ(e) {
    wx.navigateTo({
      url: '/page/index/xq?id=' + e.currentTarget.dataset.id,
    })
  },
  add(e) {
    if (this.data.SHXY != 1) {
      this.setData({
        modalName: 'Modal'
      })
      return
    }
    let item = e.currentTarget.dataset.item
    let unit_price = item.grocery_price;
    let in_data = {
      Type: "preorder_add",
      Table: "xcx_preorder",
      product_id: item.id,
      product_quantity: 1,
      total_price: unit_price, //下单单价 等级
    }
    // return
    app.r(in_data.Type, in_data, function (res) {
      if (res.status.error_code == 0) {
        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 2000
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
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //补充信息
  supplement() {
    wx.navigateTo({
      url: '/page/index/supplement/index',
    })
  },
  search(e) {
    console.log(e.detail.value)
    this.setData({
      search: e.detail.value
    })
  },
  searchbu() {
    wx.navigateTo({
      url: './search',
    })
  },
  Couponsadd(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let in_data = {
      Type: "xcx_Coupons_add",
      Table: "xcx_Coupons",
      item: JSON.stringify(item),
    };
    wx.showLoading({
      title: '领取中',
    })
    app.r(in_data.Type, in_data, function (res) {
      wx.hideLoading()
      if (res.status.error_code == 0) {
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 3000
        })
      } else {
        wx.showToast({
          title: res.status.error_msg,
          icon: 'error',
          duration: 3000
        })
      }
    })
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh() {
    console.log('监听用户下拉动作')
    const that = this
    that.branch_list_get();
  },
  onReachBottom: function () {
    return
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '深圳餐具',
      // imageUrl: '/images/logo.jpg',
      path: '/page/home?T_openid=' + app.globalData.User._openid,
    }
  }
})