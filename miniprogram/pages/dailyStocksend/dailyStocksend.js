// pages/dailyStocksend/dailyStocksend.js
var baseUrl = getApp().globalData.baseUrl;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        monthData:[],
        noData:false
    },
    todetail:function(e){
        var date=e.currentTarget.dataset.date;
       wx.navigateTo({
           url: '../dailyStocksendDetail/dailyStocksendDetail?date='+date,
       })
    },
    getData:function(){
        var that = this;
        wx.showLoading({
            title: '正在加载中'
        });
        wx.request({
            url: baseUrl + '/reportDeliveryDaily/getDeliveryDaily',
            data: {

            },
            method: 'post',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if(res.data.length==0){
                    that.setData({
                        noData: true
                    })
                }else{
                    that.setData({
                        monthData: res.data
                    })
                }
                
                wx.hideLoading();
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this;
        that.getData();
        wx.getSystemInfo({
            success: function(res) {
              var clientHeight =res.windowHeight;
              that.setData({
                scrollHeight:clientHeight-80,
                height:clientHeight
              })
            }
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