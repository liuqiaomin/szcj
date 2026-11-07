//app.js
App({
  onShow(e) {
    this.globalData.e = '';
    console.log('onLaunch---e', e)
    this.globalData.getLocation = '';
    this.globalData.e = e;
    if (e.query.T_openid) {
      this.globalData.T_openid = e.query.T_openid ? e.query.T_openid : '无'
    }
    if (e.query.identifying) {
      this.globalData.identifying = e.query.identifying;
    }
  },
  onLaunch: function (e) {
    this.updateManager()
    const statusBarHeight = wx.getWindowInfo().statusBarHeight //状态栏的高度，单位px
    if (statusBarHeight) {
      this.globalData.StatusBar = statusBarHeight;
      let capsule = wx.getMenuButtonBoundingClientRect();
      if (capsule) {
        this.globalData.Custom = capsule;
        this.globalData.CustomBar = capsule.bottom + capsule.top - statusBarHeight;
      } else {
        this.globalData.CustomBar = statusBarHeight + 50;
      }
    }
  },
  /**
   * 小程序主动更新
   */
  updateManager() {
    if (!wx.canIUse('getUpdateManager')) {
      return false;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {});
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，即将重启应用',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    });
  },
  //请求封装
  r(url, data, successCallback, errorCallback) {
    let that = this
    data['identifying'] = that.globalData.identifying ?? '1001';
    data['_openid'] =that.globalData.User._openid;
    wx.request({
      url: that.globalData.request_URL + url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // "Authorization": 'oBUkY4-huosseYclYRyfVllmDZMA'
      },
      method: "POST",
      data: data,
      dataType: "json",
      success: function (res) {
        if (typeof successCallback === 'function') {
          if (res.data.status == 1003) {
            wx.navigateTo({
              url: '/page/home',
            })
          }
          console.log(res.data)
          successCallback(res.data);
        }
      },
      fail: function (res) {
        if (typeof errorCallback === 'function') {
          errorCallback(res);
        }
      }
    });

  },
  globalData: {
    searchList: [],
    Presale_lsit: [],
    ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
    ],
    request_URL: 'https://sc.szhxch.com/xcx/',
    tmplIds: [
      'danvYHUMstwY3utlJcgt8WwR7IHepQh9eqSffi1tTDI',
      'V3hJU89UikNFqDZoZ5_yTKmzYbdBcU_oeY4-SSBeBK4',
      'woc06hiPKS6iyVn__msbr0IWJb8wYBKbLPcLVzYT6yM'
    ], //此处填入申请得到的模板id  
    Coupons: '', //选择的优惠券
    branch_list: '', //客户定位
    User: '', //客户信息
  },
})