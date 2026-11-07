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
    console.log(options)
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
      let image_list = JSON.parse(gg.multi_images);
      let y = gg.main_image;
      let l = image_list.map(item => item.url).concat(y); // 合并进 l，且 l 不包含 url 键
      console.log(l); // 打印合并后的数组
      if (gg.full_list2) {
        that.setData({
          full_list2: gg.full_list2 ? JSON.parse(gg.full_list2) : '',
        })
      }
      that.setData({
        o: gg,
        modalName: '',
        multi_images: l
      })
      that.sc()
      that.xcx_preorder_count()
    })
  },
  sc() {
    let that = this
    let in_data = {
      Type: "branch_WHERE1_get",
      Table: "collection",
      WHERE1_name: 'scid',
      WHERE1_price: app.globalData.User.id + that.data.id
    };
    app.r(in_data.Type, in_data, function (res) {
      console.log('是否收藏', res.page_info.total_items)
      that.setData({
        sc: res.page_info.total_items == 1 ? true : false
      })
    })
  },
  SCou() {
    let that = this
    let in_data = {
      Type: "SCou_add",
      Table: "collection",
      id: app.globalData.User.id,
      data: JSON.stringify(that.data.o),
    };
    app.r(in_data.Type, in_data, function (res) {
      if (res.status.error_code == 0) {
        wx.showToast({
          title: '收藏成功',
        })
        that.sc()
      } else {
        wx.showToast({
          title: '收藏失败',
          icon: 'none',
        })
      }
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
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  product_quantity(e) {
    let k = Number(e.detail.value);
    if (k >= this.data.o.stock) {
      wx.showToast({
        title: '库存最多' + this.data.o.stock,
        icon: 'none',
        duration: 2000
      })
    }
    let i = k <= 0 ? 1 : k >= this.data.o.stock ? this.data.o.stock : k
    this.setData({
      product_quantity: i,
    })
  },
  product_quantityA(e) {
    let o = Number(this.data.product_quantity) - 1
    this.setData({
      product_quantity: o <= 0 ? 1 : o,
    })
  },
  product_quantityB(e) {
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
    const u = e.currentTarget.dataset.i;
    const that = this
    if (that.data.SHXY != 1) {
      that.setData({
        modalName: 'Modal'
      })
      return
    }
    let item = that.data.o;
    let in_data = {
      Type: "preorder_add",
      Table: "xcx_preorder",
      product_id: item.id,
      product_quantity: that.data.product_quantity,
      total_price: item.retail_price,//下单单价 等级
      unitprice: item.unit_price
    }
    // return
    app.r(in_data.Type, in_data, function (res) {
      if (res.status.error_code == 0) {
        if (u == 0) {
          wx.showToast({
            title: '添加成功！',
            icon: 'success',
            duration: 2000
          })
          that.get()
        } else {
          wx.switchTab({
            url: '/page/ShoppingCart/index',
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
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.multi_images,
      current: e.currentTarget.dataset.url
    });
  },
  onShareAppMessage() {
    return {
      title: this.data.o.product_name,
      imageUrl: this.data.o.main_image ? this.data.o.main_image : '/images/logo.jpg',
      path: '/page/home?p=xq&T_openid=' + app.globalData.User._openid + '&id=' + this.data.o.id + '&identifying=' + app.globalData.identifying
    }
  }
})