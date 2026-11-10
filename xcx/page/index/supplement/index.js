const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    xy2: false,
    XY: false,
    VXY: true,

    name: '',      // 收货店名
    address: '',   // 收货地址
    phone: '',     // 收货电话

    Doorsign: '',  // 门头
    Avatar: '',    // 头像
    Niche: '',     // 昵称

    fromProtocol: false // ✅ 协议页返回标记
  },

  // ========================
  // 生命周期
  // ========================
  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    // ✅ 从协议页返回后自动继续提交
    if (this.data.fromProtocol && this.data.xy2) {
      this.setData({ fromProtocol: false });
      this.up();
    }
  },

  // ========================
  // 获取用户信息
  // ========================
  loadUserInfo() {
    const userId = app.globalData?.User?.id;
    if (!userId) {
      wx.showToast({ title: '用户信息缺失', icon: 'none' });
      return;
    }

    const in_data = {
      Type: "id_get",
      Table: "xcx_User",
      WHERE1_name: "id",
      WHERE1_price: userId
    };

    app.r(in_data.Type, in_data, (res) => {
      console.log('用户信息:', res);
      if (res.status.error_code != 0) {
        wx.showToast({ title: '获取用户信息失败', icon: 'none' });
        return;
      }
      app.globalData.User = res.data;
      this.setData({
        VXY: res.data.SHXY == 0,
        XY: true
      });
    });
  },

  // ========================
  // 表单输入
  // ========================
  name(e) {
    this.setData({ name: e.detail.value.trim() });
  },

  address(e) {
    this.setData({ address: e.detail.value.trim() });
  },

  Niche(e) {
    this.setData({ Niche: e.detail.value.trim() });
  },

// 输入时只存值，不校验
phone(e) {
  this.setData({
    phone: e.detail.value
  });
},

// 失焦时才校验
phoneBlur() {
  const phone = this.data.phone;
  
  // 空值不校验（让提交时统一提示）
  if (!phone) return;

  // 长度不对
  if (phone.length !== 11) {
    this.setData({ phone: '' });
    wx.showToast({
      title: '手机号必须是11位',
      icon: 'none'
    });
    return;
  }

  // 格式不对
  const regex = /^1[3-9]\d{9}$/;
  if (!regex.test(phone)) {
    this.setData({ phone: '' });
    wx.showToast({
      title: '手机号格式不正确',
      icon: 'none'
    });
  }
},

  // ========================
  // 头像上传
  // ========================
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.uploadFile(avatarUrl, (url) => {
      this.setData({ Avatar: url });
      wx.showToast({ title: '上传成功', icon: 'success' });
    });
  },

  // ========================
  // 门头上传（✅ 方法名与 WXML bindtap="Doorsign" 一致）
  // ========================
  Doorsign() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const file = res.tempFiles[0];
        wx.showLoading({ title: '上传中' });
        this.uploadFile(file.tempFilePath, (url) => {
          this.setData({ Doorsign: url });
          wx.showToast({ title: '上传成功', icon: 'success' });
        });
      }
    });
  },

  // ========================
  // 通用文件上传
  // ========================
  uploadFile(filePath, successCb) {
    wx.uploadFile({
      url: 'https://sc.szhxch.com/xcx/upload',
      filePath,
      name: 'file',
      success: (res) => {
        wx.hideLoading();
        const data = JSON.parse(res.data);
        if (data.code == 0) {
          successCb && successCb(data.data.url);
        } else {
          wx.showToast({ title: '上传失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  // ========================
  // 提交
  // ========================
  up() {
    const o = this.data;

    // ✅ 校验
    if (!o.Doorsign) return wx.showToast({ title: '请上传店铺门头', icon: 'none' });
    if (!o.name) return wx.showToast({ title: '请填写收货店名', icon: 'none' });
    if (!o.address) return wx.showToast({ title: '请填写收货地址', icon: 'none' });
    if (!o.phone) return wx.showToast({ title: '请填写收货手机号', icon: 'none' });
    if (!o.Avatar) return wx.showToast({ title: '请上传头像', icon: 'none' });
    if (!o.Niche) return wx.showToast({ title: '请填写昵称', icon: 'none' });

    if (!o.xy2) {
      return wx.showModal({
        title: '请阅读用户协议',
        content: '是否去阅读？',
        success: (res) => {
          if (res.confirm) {
            this.setData({ fromProtocol: true });
            this.xybu();
          }
        }
      });
    }

    const postData = {
      Type: 'xcx_User_up',
      Table: 'xcx_User',
      id: app.globalData.User.id,   // ✅ 关键
      name: o.name,
      address: o.address,
      phone: o.phone,
      Doorsign: o.Doorsign,
      Avatar: o.Avatar,
      Niche: o.Niche
    };

    wx.showLoading({ title: '保存中...' });

    // ✅ 修复 app.r 参数错误
    app.r(postData.Type, postData, (res) => {
      wx.hideLoading();
      if (res.status.error_code == 0) {
        this.sm();
      } else {
        wx.showToast({
          title: res.status.msg || '保存失败',
          icon: 'none'
        });
      }
    });
  },

  // ========================
  // 保存成功
  // ========================
  sm() {
    wx.showModal({
      title: '保存成功',
      content: '',
      showCancel: false,
      success: () => {
        this.setData({ VXY: false });
      }
    });
  },

  // ========================
  // 拨打电话
  // ========================
  freeTell() {
    wx.makePhoneCall({
      phoneNumber: '13510398108'
    });
  },

  // ========================
  // 查看协议
  // ========================
  xybu() {
    this.setData({ xy2: true });
    wx.navigateTo({
      url: './protocol'
    });
  }
});