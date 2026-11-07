const app = getApp();
const request = require('./request.js').request;
const API = {  
  userLogin: async (data) => {  
    try {  
      const result = await request('get', `/api/logon`, data);  
      return result;  
    } catch (error) {  
      console.error('Login failed:', error);  
      // 处理错误逻辑  
    }  
  },  
  get: async (data) => {  
    try {
      const data2=data;
      data2.user_id = wx.getStorageSync('user_id');
      const result = await request('POST', `/api/xcx/api`, data2);  
      return result;  
    } catch (error) {  
      console.error('Login failed:', error);  
      // 处理错误逻辑  
    }  
  },  
  pay: async (data) => {  
    try {
      const data2=data;
      data2.openid = app.globalData.User._openid;
      const result = await request('POST', `/api/xcx/pay/index`, data2);  
      return result;  
    } catch (error) {  
      console.error('Login failed:', error);  
      // 处理错误逻辑  
    }  
  },  

  Qr: async (data) => {  
    try {  
      const result = await request('get', `/api/xcx/Qr`, data);  
      return result;  
    } catch (error) {  
      console.error('Login failed:', error);  
      // 处理错误逻辑  
    }  
  }, 
};  
  
module.exports = {  
  API,  
};