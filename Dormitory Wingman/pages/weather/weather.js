
Page({
  temperature: function () {
    var that = this
    
    //调用百度天气API
    var theBaiDuAPPkey = "jKmR1e30Dhr79MrRzzwnLjXdEGBeE5BE" //百度的APPkey

    const requestTask = wx.request({
      url: 'https://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=' + theBaiDuAPPkey, //百度天气API
      header: {
        'content-type': 'application/json',
      },

      success: function (res) {
        console.log(res.data)
       
        try {
          var str1 = res.data.results[0].weather_data[0].date;
          var tmp1 = str1.match(/实时.+/);
          var tmp2 = tmp1[0].substring(3, tmp1[0].length - 2);
          var tmp = +tmp2;
          var str2 = res.data.results[0].pm25;
        } catch (e) {
          throw new Error(e)
        }
        wx.showModal({
          title: '当前情况',
          content: `${tmp}摄氏度,PM2.5:${str2}`,
        })



      },

      fail: function (res) {
        console.log("fail")
      },

      complete: function (res) {
        console.log("end")
      }
    })
  },

  wear: function () {
    var that = this
    
    var theBaiDuAPPkey = "jKmR1e30Dhr79MrRzzwnLjXdEGBeE5BE" //百度的APPkey

    const requestTask = wx.request({
      url: 'https://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=' + theBaiDuAPPkey, //百度天气API
      header: {
        'content-type': 'application/json',
      },

      success: function (res) {
        console.log(res.data)
        
        try {
          var str1 = res.data.results[0].index[0].des;
          var str2 = res.data.results[0].index[0].zs;
        } catch (e) {
          throw new Error(e)
        }
        wx.showModal({
          title: `${str2}`,
          content: `${str1}`,
        })



      },

      fail: function (res) {
        console.log("fail")
      },

      complete: function (res) {
        console.log("end")
      }
    })
  },

  fever: function () {
    var that = this
    
    var theBaiDuAPPkey = "jKmR1e30Dhr79MrRzzwnLjXdEGBeE5BE" //百度的APPkey

    const requestTask = wx.request({
      url: 'https://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=' + theBaiDuAPPkey, //百度天气API
      header: {
        'content-type': 'application/json',
      },

      success: function (res) {
        console.log(res.data)
       
        try {
          var str1 = res.data.results[0].index[2].des;
          var str2 = res.data.results[0].index[2].zs;
        } catch (e) {
          throw new Error(e)
        }
        wx.showModal({
          title: `${str2}`,
          content: `${str1}`,
        })



      },

      fail: function (res) {
        console.log("fail")
      },

      complete: function (res) {
        console.log("end")
      }
    })
  },

  sport: function () {
    var that = this
   
    var theBaiDuAPPkey = "jKmR1e30Dhr79MrRzzwnLjXdEGBeE5BE" //百度的APPkey

    const requestTask = wx.request({
      url: 'https://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=' + theBaiDuAPPkey, //百度天气API
      header: {
        'content-type': 'application/json',
      },

      success: function (res) {
        console.log(res.data)
       
        try {
          var str1 = res.data.results[0].index[3].des;
          var str2 = res.data.results[0].index[3].zs;
        } catch (e) {
          throw new Error(e)
        }
        wx.showModal({
          title: `${str2}`,
          content: `${str1}`,
        })



      },

      fail: function (res) {
        console.log("fail")
      },

      complete: function (res) {
        console.log("end")
      }
    })
  },

  back: function () {
    var that = this

    var theBaiDuAPPkey = "jKmR1e30Dhr79MrRzzwnLjXdEGBeE5BE" //百度的APPkey

    const requestTask = wx.request({
      url: 'https://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=' + theBaiDuAPPkey, //百度天气API
      header: {
        'content-type': 'application/json',
      },

      success: function (res) {
        console.log(res.data)

        try {
          var str1 = res.data.results[0].index[4].des;
          var str2 = res.data.results[0].index[4].zs;
        } catch (e) {
          throw new Error(e)
        }
        wx.showModal({
          title: `${str2}`,
          content: `${str1}`,
        })



      },

      fail: function (res) {
        console.log("fail")
      },

      complete: function (res) {
        console.log("end")
      }
    })
  },


})