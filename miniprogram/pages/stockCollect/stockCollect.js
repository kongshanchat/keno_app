// pages/stockCollect/stockCollect.js
var baseUrl = getApp().globalData.baseUrl;


Page({

    /**
     * 页面的初始数据
     */
    data: {
        monthData:[],
        noData:false
    },
    getDetail: function () {
        var that = this;
        wx.showLoading({
            title:'正在加载中' ,
        });
        wx.request({
            url: baseUrl + '/reportStock/getProductStockDetail',
            data: {

            },
            method: 'post',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if(res.data.length==0){
                    that.setData({
                        noData:true
                    })
                }
                else{
                    var m=0;
                    for(var i=0;i<res.data.length;i++){
                        m+= res.data[i].amount;
                    }

                    console.log(m);
                    that.setData({
                        monthData:res.data,
                        total:m
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
        this.getDetail();
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