const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    o: '',
    multi_images: [],
    preorder_count: 0,
    modalName: '',
    product_quantity: 1,
    full_list2: []
  },
  onShow() {
    this.setData({
      SHXY: app.globalData.User.SHXY,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    if (options.id) {
      this.setData({
        id: options.id
      })
      this.get();
    }

  },
  get() {
    let that = this
    let in_data = {
      Type: "branch_WHERE1_get",
      Table: "products",
      WHERE1_name: 'id',
      WHERE1_price: that.data.id
    };
    app.r(in_data.Type, in_data, function (res) {
      let gg = res.data[0];
      that.setData({
        o: gg,
        modalName: '',
        multi_images: gg.multi_images ? JSON.parse(gg.multi_images) : '',
        full_list2: gg.full_list2 ? JSON.parse(gg.full_list2) : '',

      })
      that.xcx_preorder_count()
    })
  },
  
  
  xcx_preorder_count() {
    let that = this
    let in_data = {
      Type: "xcx_preorder_count",
    };
    app.r(in_data.Type, in_data, function (res) {
      that.setData({
        preorder_count: res.data ? res.data : 0,
      })
    })
  },

  //打开 购买选择
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  product_quantity(e) {
    console.log('输入数量')
    let o = Number(e.detail.value) + 1
    this.setData({
      product_quantity: o <= 0 ? 1 : o,
    })
  },
  //加入数量-1
  product_quantityA(e) {
    console.log('加入数量-1')
    let o = Number(this.data.product_quantity) - 1
    this.setData({
      product_quantity: o <= 0 ? 1 : o,
    })
  },
    //加入数量+1
  product_quantityB(e) {
    console.log('product_quantityB')
    let o = Number(this.data.product_quantity) + 1
    this.setData({
      product_quantity: o >= this.data.o.stock ? this.data.o.stock : o,
    })
    if (o >= this.data.o.stock) {
      wx.showToast({
        title: '库存最多' + this.data.o.stock,
        icon: 'none',
        duration: 2000
      })
    }
  },
  add(e) {
    let that = this
    if (that.data.SHXY != 1) {
      that.setData({
        modalName: 'Modal'
      })
      return
    }
    //价格
    let unit_price = that.data.o;
    //数量
    let product_quantity = that.data.product_quantity;
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  }
})