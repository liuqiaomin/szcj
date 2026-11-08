const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    image_list: [],
    description: ''
  },
  ChooseImage() {
    let that = this
    wx.chooseMedia({
      count: 3,
      sizeType: ['compressed'],
      mediaType: ['image'],
      sourceType: ['album'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res.tempFiles.length)
        for (let i = 0; i < res.tempFiles.length; i++) {
          let o = res.tempFiles[i].tempFilePath;
          that.setData({
            imgList: that.data.imgList.concat(o)
          })
        }

      }
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.url,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '亲',
      content: '确定要删除这个图片吗？',
      cancelText: '再看看',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  textareaAInput(e) {
    this.setData({
      description: e.detail.value
    })
  },
  add() {
    let that = this
    if (that.data.description == '') {
      wx.showToast({
        title: '请输入描述',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.imgList.length > 0) {
      async function processImages() {
        const promises = that.data.imgList.map((item) => {
          return new Promise((resolve, reject) => {
            console.log(item); // 输出数组中的每个元素  
            wx.showLoading({
              title: '上传图片中'
            });
            wx.uploadFile({
              url: 'https://sc.szhxch.com/xcx/upload', // 仅为示例，并非真实的接口地址  
              filePath: item,
              name: 'file',
              success: function (uploadFileRes) {
                wx.hideLoading();
                if (uploadFileRes.statusCode == 200) {
                  that.data.image_list.push(uploadFileRes
                    .data);
                  resolve(); // 上传成功，解决这个 Promise  
                } else {
                  wx.showToast({
                    title: '图片上传失败!',
                    duration: 1000,
                    icon: 'error'
                  });
                  reject(new Error(
                    '图片上传失败')); // 上传失败，拒绝这个 Promise  
                }
              },
              fail: function (error) {
                wx.hideLoading();
                reject(error); // 上传失败，拒绝这个 Promise  
              }
            });
          });
        });
        // 等待所有的上传操作完成  
        await Promise.all(promises);
        console.log('循环完成后执行更新'); // 在所有异步操作完成后输出这条消息    
        that.add2()
      }
      processImages();
    } else {
      that.add2()
    }
  },
  add2() {
    let that = this;
    let in_data = {
      Type: "xcx_city_list_add",
      Table: "xcx_city_list",
      avatar: app.globalData.User.Avatar,
      nickname: app.globalData.User.Niche,
      description: that.data.description,
      image_list: JSON.stringify(that.data.image_list),
      image: that.data.image_list[0],
    };
    app.r(in_data.Type, in_data, function (res) {
      console.log(res)
      if (res.status.error_code == 0) {
        wx.showModal({
          title: '提交成功',
          content: '待审核后展示！',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateBack(1)
            } else if (res.cancel) {
              wx.navigateBack(1)
              console.log('用户点击取消')
            }
          }
        })

        that.setData({
          imgList: [],
          image_list: [],
          description: ''
        })
      } else {
        wx.showToast({
          title: '提交失败！',
          duration: 1000,
          icon: 'error'
        });
      }
    },
      function (error) {
        console.error(error);
      }
    );
  }
})