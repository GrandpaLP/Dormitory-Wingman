Page({
  weather: function (options) {
    wx.navigateTo({
      url: '../weather/weather',
    })
  },
  dormitory: function (options) {
    wx.navigateTo({
      url: '../dormitory/dormitory',
    })
  },
  music: function (options) {
    wx.navigateTo({
      url: '../music/music',
    })
  },
  _button: function (options) {
    wx.navigateTo({
      url: '../_button/_button',
    })
  },
  back: function (options) {
    wx.navigateTo({
      url: '../welcome/welcome',
    })
  },
})