const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    page_size: 20,
    search:''
  },
  onShow() {
    this.setData({
      SHXY: app.globalData.User.SHXY,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      category: options.category

    })
    this.get();
  },
  get() {
    let that = this
    let in_data = {
      Type: "page_index_category_get",
      Table: "products",
      WHERE1_name: 'category',
      WHERE1_price: that.data.category,
      ORDER_nane: "Sort",
      ORDER_da: "ASC",
      page: that.data.page,
      page_size: that.data.page_size,
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
          list: that.data.list.concat(res.data),
          total: Number(res.page_info.total_items)
        })
      }
    })
  },
  search(e) {
    console.log(e.detail.value)
    this.setData({
      search: e.detail.value
    })
  },
  searchbu() {
    if (this.data.SHXY != 1) {
      this.setData({
        modalName: 'Modal'
      })
      return
    }
    if (this.data.search == '') {
      wx.showToast({
        title: '请输入要搜索的商品！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.navigateTo({
      url: './search?s=' + this.data.search,
    })
    this.setData({
      search: ''
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
      Totalprofit: unit_price - item.Purchase_price,
      totalcost: item.Purchase_price,
      Receiptprice: item.Purchase_price,
      total_price: unit_price,//下单单价 等级
      product_unit: item.specification_quantity,
      product_specification: item.specification,
      product_quantity: 1,
      product_name: item.product_name,
      product_id: item.id,
      level_price: item.unit_price, //单价
      main_image: item.main_image,
    }
    // return
    app.r(in_data.Type, in_data, function (res) {
      if (res.status.error_code == 0) {
        wx.showToast({
          title: '已添加购物车',
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
  TZ(e) {
    wx.navigateTo({
      url: '/page/index/xq?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('监听用户下拉动作')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.list.length == this.data.total) {
      wx.showToast({
        title: '全部在这了!',
      })
      return
    }
    this.setData({
      page: this.data.page + 1
    })
    this.get()
  },
})