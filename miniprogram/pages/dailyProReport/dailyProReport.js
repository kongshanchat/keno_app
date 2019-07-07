// pages/dailyProReport/dailyProReport.js
var baseUrl = getApp().globalData.baseUrl;
import F2 from '../../f2-canvas/lib/f2';

let chart = null;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        array: [],
        index: 0,
        curTab: 0,
        opts: {
            lazyLoad: true // 延迟加载组件
        }
    },
    tabChange: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            curTab: index
        })
    },
    bindPickerChange: function (e) {
        var arr = this.data.array;
        var cur = e.detail.value;
        var curId = arr[cur].cxId

        this.setData({
            index: e.detail.value
        })

        this.getTableData(curId);
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
                    array: res.data
                })

                that.getTableData(res.data[0].cxId);
            }
        })
    },
    getDetail: function () {
        var self = this;

        wx.request({
            url: baseUrl + '/report/getList',
            data: {

            },
            method: 'post',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res.data[0].dailyDate);
                let data =res.data;

                self.setData({
                    daily: res.data[0].dailyDate,
                    curMonth: '6月份统计图',
                    dailyData: res.data
                   // opts: opts
                })

                self.chartComponent = self.selectComponent('#bar');
                self.chartComponent.init((canvas, width, height) => {
                    chart = new F2.Chart({
                        el: canvas,
                        width,
                        height
                    });
            
                    chart.source(data, {
                        'amount': {
                            tickCount: 5
                        }
                    });
                    chart.coord({
                        transposed: true
                    });
                    chart.axis('cxName', {
                        line: F2.Global._defaultAxis.line,
                        grid: null
                    });
                    chart.axis('amount', {
                        line: null,
                        grid: F2.Global._defaultAxis.grid,
                        label(text, index, total) {
                            const textCfg = {
                                text: text
                            };
                            if (index === 0) {
                                textCfg.textAlign = 'left';
                            }
                            if (index === total - 1) {
                                textCfg.textAlign = 'right';
                            }
                            return textCfg;
                        }
                    });
                    chart.tooltip({
                        custom: true, // 自定义 tooltip 内容框
                        onChange(obj) {
                            const legend = chart.get('legendController').legends.top[0];
                            const tooltipItems = obj.items;
                            const legendItems = legend.items;
                            const map = {};
                            legendItems.map(item => {
                                map[item.name] = Object.assign({}, item);
                            });
                            tooltipItems.map(item => {
                                const { name, value } = item;
                                if (map[name]) {
                                    map[name].value = (value);
                                }
                            });
                            legend.setItems(Object.values(map));
                        },
                        onHide() {
                            const legend = chart.get('legendController').legends.top[0];
                            legend.setItems(chart.getLegendItems().country);
                        }
                    });
                    chart.interval().position('cxName*amount').color('type').adjust('stack');
            
                    chart.render();
                    return chart;
                })
            }
        })

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                var clientHeight = res.windowHeight;
                that.setData({
                    scrollHeight: clientHeight - 134,
                    height: clientHeight
                })
            }
        })
        this.getDetail();

        this.getProLine();
    },
    getTableData: function (id) {
        var that = this;

        wx.request({
            url: baseUrl + '/report/getListDetail',
            data: {
                cxId: id
            },
            method: 'post',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                that.setData({
                    proLineData: res.data
                })
                wx.hideLoading();
            }
        })
    },
    initChart2: function (canvas, width, height) {
        const data = this.data.dailyData;
        console.log(123)
        console.log(this.data.dailyData);
        const data2 = [
            { amount: 963, cxName: '1#', type: '计划数量', cxId: '1212121', dachenglv: null, dailyDate: 'xxx', finishAmount: null, planAmount: null },
            { amount: 890, cxName: '1#', type: '实际数量', cxId: '1212121', dachenglv: null, dailyDate: 'xxx', finishAmount: null, planAmount: null },

            { cxName: '2#', type: '计划数量', amount: 352, cxId: '1212121', dachenglv: null, dailyDate: 'xxx', finishAmount: null, planAmount: null },
            { cxName: '2#', type: '实际数量', amount: 239, cxId: '1212121', dachenglv: null, dailyDate: 'xxx', finishAmount: null, planAmount: null },

            { cxName: '3#', type: '计划数量', amount: 1223, cxId: '1212121', dachenglv: null, dailyDate: 'xxx', finishAmount: null, planAmount: null },
            { cxName: '3#', type: '实际数量', amount: 138, cxId: '1212121', dachenglv: null, dailyDate: 'xxx', finishAmount: null, planAmount: null },

            { cxName: '4#', type: '计划数量', amount: 2518, cxId: '1212121', dachenglv: null, dailyDate: 'xxx', finishAmount: null, planAmount: null },
            { cxName: '4#', type: '实际数量', amount: 758, cxId: '1212121', dachenglv: null, dailyDate: 'xxx', finishAmount: null, planAmount: null },

            { cxName: '5#', type: '计划数量', amount: 2283, cxId: '1212121', dachenglv: null, dailyDate: 'xxx', finishAmount: null, planAmount: null },
            { cxName: '5#', type: '实际数量', amount: 640, cxId: '1212121', dachenglv: null, dailyDate: 'xxx', finishAmount: null, planAmount: null },

        ];
        
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