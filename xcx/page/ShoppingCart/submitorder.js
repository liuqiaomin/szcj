const app = getApp();
const API = require("../../module/Api.js").API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disableds: false,
    Pay_Xy: false,
    payx: 0,
    TabCur: 0,
    TabCurs: [
      '送货上门',
      '站点自提',
    ],
    Coupons: '',
    mjyf: 0,//最终运费
    Coupons_list: [],//优惠列表

    meet: '',//商品总价
    meets: '',//实付总价
    Ymeet: '',//原总价
    remarks: '',
  },
  onLoad() {
    const User = app.globalData.User
    this.setData({
      User: User,
      customer_name: User.name, //客户名
      customer_phone: User.phone, //	客户电话
      customer_address: User.address, //客户地址
    })
  },
  onShow() {
    const Coupons = app.globalData.Coupons;
    const branch_list = app.globalData.branch_list
    this.setData({
      branch_list: branch_list,
      distance: parseFloat(branch_list.distance).toFixed(2),
      Coupons: Coupons,
      meet: '',
      meets: '',
    })
    this.get()
  },
  get() {
    let that = this
    //计算优惠券
    const Coupons = that.data.Coupons;
    const branch_list = app.globalData.branch_list
    const TabCur = that.data.TabCur
    let in_data = {
      Type: "settlement",
      Table: "xcx_preorder",
    };
    app.r(in_data.Type, in_data, function (res) {
      let m = res.data.meet;
      if (m == 0) {
        wx.switchTab({
          url: '/page/index/index',
        })
        return
      }
      that.setData({
        list: res.data.data,
        meet: m,//商品价
        meets: m,//实付价
        Coupons_sum: res.data.xcx_Coupons,
        deleteb: true,
      })
      if (Coupons) {
        // 设置数据  
        that.setData({
          meets: (Number(m) - Number(Coupons.discount_amount)).toFixed(2)
        });
      }
      if (TabCur == 0) {
        let yf = Number(m) > Number(branch_list.freight_manjian_sum) ? 0 : Number(branch_list.freight).toFixed(2); //判断是否送货和是否大于后台设置的满减金额
        that.setData({
          mjyf: yf,
          meets: (Number(that.data.meets) + Number(yf)).toFixed(2), //赋值新的实付金额
          Ymeet: (Number(m) + Number(yf)).toFixed(2) //原总价 商品价+运费
        });
      }
    })
  },
  tabSelect(e) {
    let that = this
    that.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
    })
    that.get();
  },
  openLoca() {
    let i = this.data.branch_list;
    wx.openLocation({
      latitude: parseFloat(i.latitude), //要去的纬度-地址
      longitude: parseFloat(i.longitude), //要去的经度-地址
      address: i.address,
      name: i.branch_name
    })
  },
  // 拨打电话 
  freeTell: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.branch_list.phone
    })
  },
  yhq() {
    wx.navigateTo({
      url: "/page/ShoppingCart/Coupons?meet=" + this.data.meet,
    })
  },

  pay() {
    //微信支付
    let that = this
    if (that.data.Pay_Xy) {
      console.log('正在提交')
      return
    } else {
      that.add(1)
      that.setData({
        Pay_Xy: true
      })
    }

  },
  balance() {
    let that = this
    wx.showLoading({
      title: '余额支付中',
    })
    let data = {
      Type: "balance_pay",
      Table: "xcx_User",
      sum: that.data.meets,
    }
    app.r(data.Type, data, function (res) {
      wx.hideLoading()
      if (res.status.error_code == 0) {
        that.add(0, '余额支付')
      } else {
        wx.showToast({
          title: res.status.error_msg,
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  add(e) {
    this.setData({
      disableds: true
    })
    wx.showLoading({
      title: '下单中',
    })
    const that = this;
    const Coupons = app.globalData.Coupons;
    const Coupons_list = [];
    const branch_list = app.globalData.branch_list;
    if (Coupons) {
      Coupons_list.push('使用' + Coupons.coupon_type + '券,' + '减' + Coupons.discount_amount + '元')
    }
    if (that.data.mjyf == 0) {
      Coupons_list.push('商品金额满' + branch_list.freight_manjian_sum + '元' + ',免' + branch_list.freight + '元运费')
    }
    const in_data = {
      Type: "order_list_add_v2",
      Table: "order_list",
      customer_level: app.globalData.User.grade, //客户等级
      customer_name: that.data.customer_name, //客户名
      customer_phone: that.data.customer_phone, //	客户电话
      customer_address: that.data.customer_address, //客户地址
      mode: that.data.TabCur, //取货方式  0配送&1自提 
      meet: that.data.meets, //实付总价
      Ymeet: that.data.Ymeet, //原总价
      Smeets: that.data.meet, //商品总价
      Coupons_discount_amount: Coupons.discount_amount, //使用优惠券
      freight: that.data.mjyf, //运费 
      Coupons: JSON.stringify(that.data.Coupons),
      out_trade_num: e == 1 ? '' : '余额支付',
      Coupons_list: JSON.stringify(Coupons_list),
      remarks: that.data.remarks//备注
    }
    app.r(in_data.Type, in_data, function (res) {
      wx.hideLoading()
      if (res.status.error_code == 0) {
        //清空缓存
        app.globalData.Coupons = '';
        if (e == 1) {
          // navigateTo  reLaunch
          wx.navigateTo({
            url: '/page/ShoppingCart/pay?id=' + res.status.$order_list,
          })
        } else {
          wx.showModal({
            title: '下单成功',
            content: '',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/page/my/Order/index',
                })
                console.log('用户点击确定')
              } else if (res.cancel) {
                wx.navigateTo({
                  url: '/page/my/Order/index',
                })
                console.log('用户点击取消')
              }
            }
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
  /**
   * 获取微信地址
   */
  chooseAddress: function () {
    let _this = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        _this.setData({
          customer_name: res.userName, //客户名
          customer_phone: res.telNumber, //	客户电话
          customer_address: res.provinceName + res.cityName + res.countyName + res.detailInfo, //客户地址
        });
      }
    })
  },
  radioChange(e) {
    this.setData({
      payx: e.detail.value
    })
  },
  //备注
  remarks(e) {
    this.setData({
      remarks: e.detail.value
    })
  }
})