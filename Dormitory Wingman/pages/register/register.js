
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nickName: "",//需要是英文
    src: "",
    token: "",
    base64: "",
    msg: ""
  },//获取到的用户信息

  //拍照
  takePhoto() {
    var that = this;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath//获取图片
        })

        //图片base64编码
        wx.getFileSystemManager().readFile({
          filePath: this.data.src, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            this.setData({
              base64: res.data
            })
          }
        })
      }//拍照成功结束

    })//调用相机结束

    //acess_token获取,由于服务器请求冲突需要尝试多次
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token', //接口地址
      data: {
        grant_type: 'client_credentials',
        client_id: 'GwLo9zB21p3sKBAivu9r0DOh',//百度云应用的API Key
        client_secret: 'eNxYtcDzj8LmlNxR9pYrV0SEom36m8Ik'//百度云应用的Secret Key
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

    //上传人脸进行注册
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token=' + this.data.token,
      method: 'POST',
      data: {
        image: this.data.base64,
        image_type: 'BASE64',
        group_id: '303',//自己建的人脸库组id
        user_id: this.data.nickName//这里获取用户昵称
      },
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          msg: res.data.error_msg
        })
        console.log(that.data.msg)
        //做成功判断
        if (that.data.msg == 'SUCCESS') {//微信js字符串请使用单引号
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({})//返回上一页

        }

      }
    }),

      //失败尝试
      wx.showToast({
        title: '请重试',
        icon: 'loading',
        duration: 500
      })
  },
  error(e) {
    console.log(e.detail)
  },

  //获取用户信息
  bindGetUserInfo: function (e) {
    this.setData({
      nickName: e.detail.userInfo.nickName
    })
    wx.showToast({
      title: '授权成功',
      icon: 'success',
      duration: 1000
    })
    console.log(e.detail.userInfo.nickName)//试错
  },

  //注意事项
  btnreg: function () {
    wx.showModal({
      title: '注册须知',
      content: '用户ID需要是英文哦！先授权登陆，再拍照注册哦！网络可能故障，如果不成功，请再试一下！',
    })
  }

})