const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    page_size: 20,
    searchList: ['帽']
  },
  onShow() {
    this.setData({
      searchList: app.globalData.searchList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.s) {
      this.setData({
        s: options.s,
      })
      // 检查数组中是否已经存在元素
      if (app.globalData.searchList.indexOf(options.s) === -1) {
        // 如果不存在，则添加到数组中
        app.globalData.searchList.push(options.s);
      }
      this.searchbu();
    }
  },
  search(e) {
    console.log(e.detail.value)
    this.setData({
      s: e.detail.value
    })
  },
  iuss() {
    let that = this
    if (that.data.s == '') {
      wx.showToast({
        title: '请输入要搜索的商品！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 检查数组中是否已经存在元素
    if (app.globalData.searchList.indexOf(that.data.s) === -1) {
      // 如果不存在，则添加到数组中
      app.globalData.searchList.push(that.data.s);
    }
    this.searchbu();
  },
  suu(e) {
    this.setData({
      s: e.currentTarget.dataset.i
    })
    this.searchbu();
  },
  searchbu() {
    let that = this
    let in_data = {
      Type: "WHERE1_get",
      Table: "products",
      WHERE1_name: 'product_name',
      WHERE1_price: that.data.s,
      ORDER_nane: "Sort",
      ORDER_da: "ASC",
      page_size: 100,
    };
    app.r(in_data.Type, in_data, function (res) {
      if (res.page_info.total_items == 0) {
        wx.showToast({
          title: '暂无商品',
          icon: 'none',
          duration: 2000
        })
      } else {
        that.setData({
          SHXY: app.globalData.User.SHXY,
          list: res.data,
        })
        that.onShow()
      }
    })
  },
  TZ(e) {
    wx.navigateTo({
      url: '/page/index/xq?id=' + e.currentTarget.dataset.id,
    })
  },
  add(e) {
    let item = e.currentTarget.dataset.item
    let unit_price;
    let level = app.globalData.User.grade
    if (level == "一级") {
      unit_price = item.retail_price;
    } else if (level == "二级") {
      unit_price = item.grocery_price;
    } else if (level == "三级") {
      unit_price = item.department_store_price;
    } else if (level == "四级") {
      unit_price = item.wholesale_price;
    }
    let in_data = {
      Type: "preorder_add",
      Table: "xcx_preorder",
      product_id: item.id,
      product_quantity: 1,
      total_price: unit_price,//下单单价 等级
      unitprice: item.unit_price
    }
    // return
    app.r(in_data.Type, in_data, function (res) {
      if (res.status.error_code == 0) {
        wx.showToast({
          title: '添加成功！',
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
})