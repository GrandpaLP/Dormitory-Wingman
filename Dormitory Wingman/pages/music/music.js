const devicesId = "577142245" // 在OneNet上的devicesId  
const api_key = "i8SBhcxVxuKcQoU2RKK30P1YieU=" // 填写在OneNet上的 api-key 


Page({

  start: function () {
    const requestTask = wx.request({
      url: `https://api.heclouds.com/devices/${devicesId}/datapoints?type=3`,
      header: {
        'content-type': 'application/json',
        'api-key': 'i8SBhcxVxuKcQoU2RKK30P1YieU='
      },
      data: { "data_1": 1 },//{"数据流名称":数据}
      method: 'POST',
      success: function (res) {
        console.log("1")
      },

      fail: function (res) {
        console.log("fail!!!")
      },

      complete: function (res) {
        console.log("end")
      }
    })
  },
  pause: function () {
    const requestTask = wx.request({
      url: `https://api.heclouds.com/devices/${devicesId}/datapoints?type=3`,
      header: {
        'content-type': 'application/json',
        'api-key': 'i8SBhcxVxuKcQoU2RKK30P1YieU='
      },
      data: { "data_1": 0 },
      method: 'POST',
      success: function (res) {
        console.log("0")
      },

      fail: function (res) {
        console.log("fail!!!")
      },

      complete: function (res) {
        console.log("end")
      }
    })
  },
})
