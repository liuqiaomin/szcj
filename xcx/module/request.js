const baseURL = "https://xcx.szhxch.com";
const app = getApp();
const request = (method, url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.User._openid,
        "identifying": app.globalData.branch_list.identifying ? app.globalData.branch_list.identifying : '1001'
      },
      method: method,
      data: data, // 如果是 GET 请求，data 可以为空对象  
      dataType: "json",
      success: function (res) {
        console.log(res.data)
        resolve(res.data);
      },
      fail: function (error) {
        reject(error);
      }
    });
  });
};

module.exports = {
  request,
};