
Page({
  data: {
    base64: "",
    token: "",
    msg: null
  },
  //拍照并编码
  takePhoto() {
    //拍照
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })

    var that = this;
    //图片base64编码
    wx.getFileSystemManager().readFile({
      filePath: this.data.src, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        that.setData({
          base64: res.data
        })
      }
    })

    //acess_token获取
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token', //真实的接口地址
      data: {
        grant_type: 'client_credentials',
        client_id: 'GwLo9zB21p3sKBAivu9r0DOh',
        client_secret: 'eNxYtcDzj8LmlNxR9pYrV0SEom36m8Ik'//用自己的
      },
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          token: res.data.access_token//获取到token
        })
      }
    })

    //上传人脸进行 比对
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=' + that.data.token,
      method: 'POST',
      data: {
        image: this.data.base64,
        image_type: 'BASE64',
        group_id_list: '303'//自己建的用户组id
      },
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          msg: res.data.result.user_list[0].score
        })
        console.log(res);
        if (that.data.msg > 80) {
          wx.showToast({
            title: "欢迎回来，"+res.data.result.user_list[0].user_id,
            duration: 4000,
            icon: 'none',
          })
          //验证通过，跳转至UI页面
          wx.navigateTo({
            url: '../main/main',
          })
        }else{
          wx.showToast({
            title: '请重试',
            icon: 'loading',
            duration: 500
          })
        }
       
      }
    });

   
  },
  error(e) {
    console.log(e.detail)
    
  }
})