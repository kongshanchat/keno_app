import F2 from '../../f2-canvas/lib/f2';
var baseUrl = getApp().globalData.baseUrl;
let chart = null;

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
    }
]



Page({

    /**
     * 页面的初始数据
     */
    data: {
        array: ['产线1', '产线2', '产线3', '产线4'],
        month: [],
        index: 0,
        idx:0,
        curTab: 0,
        monthData: [],
        opts: {
            lazyLoad: true // 延迟加载组件
        },
        opts2: {
            //lazyLoad: true // 延迟加载组件
        }
    },
    tabChange: function (e) {
        var index = e.currentTarget.dataset.index;
        var curMonth=this.data.curMonth;
        var curLine =this.data.lineId;
        var lineName=this.data.lineName;
       
        if(index==0){
            this.getMonDetail(curMonth);
        }else if(index==1){
            this.getLineDetail(curLine,lineName);
        }
        this.setData({
            curTab: index
        })
    },
    bindPickerChange: function (e) {
        var cur = e.detail.value;
        var month=this.data.month;
        var curMonth = month[cur];
        this.getMonDetail(curMonth);
        this.setData({
            index: e.detail.value,
            curMonth:curMonth
        })
    },
    getProLine: function () {
        var that = this;
        wx.request({
            url: baseUrl + '/reportCX/getList',
            data: {

            },
            method: 'post',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                that.setData({
                    array: res.data,
                    lineId:res.data[0].cxId,
                    lineName:res.data[0].cxName
                })
                that.getLineDetail(res.data[0].cxId, res.data[0].cxName);
                //that.getTableData(res.data[0].cxId, res.data[0].cxName);
            }
        })
    },
    lineChange:function(e){
        var cur = e.detail.value;
        var array=this.data.array;
        var curLine = array[cur].cxId;
        var lineName =array[cur].cxName;
        this.getLineDetail(curLine,lineName);
        this.setData({
            idx: e.detail.value
        })
    },
    getLineDetail:function(curLine,lineName){
        var that = this;
        wx.showLoading({
            title: '正在加载中',
        })
        wx.request({
            url: baseUrl + '/report/getMonthListDetail',
            data: {
                cxId: curLine,
                cxName:lineName
            },
            method: 'post',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {

                var opts = {
                    onInit: that.initChart2
                }
                that.setData({
                    LineData: res.data,
                    opts2: opts
                })

                wx.hideLoading();



            }
        })
    },
    getMonDetail: function (curMonth) {
        var self = this;
        wx.showLoading({
            title: '正在加载中',
        })
        wx.request({
            url: baseUrl + '/report/getMonthList',
            data: {
                dailyDate: curMonth
            },
            method: 'post',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                let data= res.data;

                self.setData({
                    monthData: res.data,
                    //opts: opts
                })

                self.chartComponent = self.selectComponent('#bar');
                self.chartComponent.init((canvas, width, height) => {
                    chart = new F2.Chart({
                        el: canvas,
                        width,
                        height
                    });
            
                    var Global = F2.Global;
                    
            
                    chart.source(data, {
                        finishAmount: {
                            tickCount: 5
                        }
                    });
                    chart.coord({
                        transposed: true
                    });
                    chart.axis('cxName', {
                        line: Global._defaultAxis.line,
                        grid: null
                    });
                    chart.axis('finishAmount', {
                        line: null,
                        grid: Global._defaultAxis.grid,
                        label: function label(text, index, total) {
                            var textCfg = {};
                            if (index === 0) {
                                textCfg.textAlign = 'left';
                            } else if (index === total - 1) {
                                textCfg.textAlign = 'right';
                            }
                            return textCfg;
                        }
                    });
                    chart.interval().position('cxName*finishAmount');
                    chart.render();
            
                    return chart;
                })




                wx.hideLoading();



            }
        })
    },
    getMonth: function () {
        let datelist = []
        let date = new Date()
        let Y = date.getFullYear()
        let M = date.getMonth() + 1

        for (let i = 0; i < 6; i++) {
            let dateoption = ''
            if (M - 1 !== 0) {
            } else {
                M = 12
                Y = Y - 1
            }
            let m = M
            m = m < 10 ? '0' + m : m
            dateoption = Y + '-' + m
            M--
            datelist.push(dateoption)
        }
        var curMonth = datelist[0];
        this.getMonDetail(curMonth);
        this.setData({
            month: datelist,
            curMonth:curMonth
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getProLine();
        this.getMonth();

    },
    initChart2: function (canvas, width, height) {
       
        var data = this.data.LineData;
        chart = new F2.Chart({
            el: canvas,
            width,
            height
        });

        var Global = F2.Global;
        

        chart.source(data, {
            finishAmount: {
                tickCount: 5
            }
        });
        chart.coord({
            transposed: true
        });
        chart.axis('dailyDate', {
            line: Global._defaultAxis.line,
            grid: null
        });
        chart.axis('finishAmount', {
            line: null,
            grid: Global._defaultAxis.grid,
            label: function label(text, index, total) {
                var textCfg = {};
                if (index === 0) {
                    textCfg.textAlign = 'left';
                } else if (index === total - 1) {
                    textCfg.textAlign = 'right';
                }
                return textCfg;
            }
        });
        chart.interval().position('dailyDate*finishAmount');
        chart.render();

        return chart;
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