// pages/login/login.js
var baseUrl = getApp().globalData.baseUrl;
console.log(baseUrl);
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username:'',
        password:'',
        disabled:false,
        loading:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    loginSubmit:function(user,pass){
        wx.request({
            url: baseUrl +'/security/web/login',
            data:{
                account:user,
                password: pass,
                language:'zh',
                captcha:'123',
                enterpriseCode:'221553450',
                systemMark:'admin'
            },
            method:'post',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.code);
                console.log(res,res.success)
                if (res.data.success ==false){
                    wx.showToast({
                        title: res.data.message,
                        icon:'none'
                    })
                }else{
                    wx.showToast({
                        title: '登录成功',
                    })
                    wx.setStorageSync('isLogin', true)
                    wx.redirectTo({
                        url: '../index/index',
                    })
                }
            }
        })
    },
    formSubmit: function(e) {
        var user=e.detail.value.username;
        var pass=e.detail.value.password;
        if(user==''){
            wx.showToast({
                title:'用户名不能为空',
                icon:'none'
            })
            return false;
        }else if(pass==''){
            wx.showToast({
                title: '密码不能为空',
                icon: 'none'
            })
            return false;
        }

        this.loginSubmit(user,pass)
    },
    forget:function(){
        wx.showToast({
            title: '请联系系统管理员',
            icon:'none'
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})