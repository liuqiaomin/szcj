const app = getApp();
function get(data) {  
  let that = this
 app.r('api', data, function (res) {
    if (res.page_info.total_items == 0) {
      wx.showToast({
        title: '暂无商品！',
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

}  
function sayHello(data) {  
  const greeting = data;  
  return greeting;
}  
  
module.exports = {  
  sayHello: sayHello ,
  get: get   
};