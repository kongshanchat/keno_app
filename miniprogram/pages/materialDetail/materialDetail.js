// pages/dailyStocksend/dailyStocksend.js
var baseUrl = getApp().globalData.baseUrl;
var monthData = [
    {
        date: '06-01',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-02',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-03',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-04',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-05',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-06',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-07',
        pro: '12',
        num: '150',
        rate: '50%'
    }, {
        date: '06-08',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-07',
        pro: '12',
        num: '150',
        rate: '50%'
    }, {
        date: '06-08',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-07',
        pro: '12',
        num: '150',
        rate: '50%'
    }, {
        date: '06-08',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-07',
        pro: '12',
        num: '150',
        rate: '50%'
    }, {
        date: '06-08',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-07',
        pro: '12',
        num: '150',
        rate: '50%'
    }, {
        date: '06-08',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-07',
        pro: '12',
        num: '150',
        rate: '50%'
    }, {
        date: '06-08',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-07',
        pro: '12',
        num: '150',
        rate: '50%'
    }, {
        date: '06-08',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-07',
        pro: '12',
        num: '150',
        rate: '50%'
    }, {
        date: '06-08',
        pro: '12',
        num: '150',
        rate: '50%'
    },
    {
        date: '06-07',
        pro: '12',
        num: '150',
        rate: '50%'
    }, {
        date: '06-08',
        pro: '12',
        num: '150',
        rate: '50%'
    }
]

Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailData:[],
        noData:false
    },
    getDetail: function (enumValue){
        var that = this;
        wx.showLoading({
            title: '正在加载中',
        })
        wx.request({
            url: baseUrl + '/reportStock/getStockDetail',
            data: {
                enumValue: enumValue
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
                that.setData({
                    detailData: res.data
                })
                wx.hideLoading();
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this;
        that.setData({
            enumValue:options.id
        })

        this.getDetail(options.id);
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