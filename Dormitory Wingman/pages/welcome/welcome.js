
Page({

  register: function (options) {
    wx.showModal({
      title: '非常遗憾',
      content: '受微信方限制，人脸识别暂不开放。点击下方登录直接进入程序',
    })
  },
  login: function (options) {
    wx.showToast({
      title: "欢迎",
      duration: 4000,
      icon: 'none',
    })
    wx.navigateTo({
      url: '../main/main',
    })
  },
  hehe:function(options){
    wx.navigateTo({
      url: '../main/main',
    })
  }
})