import F2 from '../../f2-canvas/lib/f2';
var baseUrl = getApp().globalData.baseUrl;
let chart = null;



Page({

    /**
     * 页面的初始数据
     */
    data: {
        radio: '1',
        curTab:0,
        noData:false,
        opts: {
            lazyLoad: true // 延迟加载组件
        }
    },
    getOderDetail:function(){
        var self = this;
        wx.showLoading({
            title: '正在加载中',
        })
        wx.request({
            url: baseUrl + '/report/getWorkOrderByProduct',
            data: {
                //dailyDate: curMonth
            },
            method: 'post',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res.data);
                if(res.data.length==0){
                    self.setData({
                        noData:true
                    })
                }

                let data =res.data;
                // var opts = {
                //     onInit: that.initChart
                // }
                self.setData({
                    orderData: res.data,
                    //opts: opts
                })

                wx.hideLoading();
                

                self.chartComponent = self.selectComponent('#stack-dom');
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
                      chart.axis('productName', {
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
                      chart.interval().position('productName*amount').color('type').adjust('stack');
                    
                      chart.render();
                      return chart;
                })



            }
        })
    },
    getTableData:function(){

        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;

        var that = this;
        wx.showLoading({
            title: '正在加载中',
        })


        wx.request({
            url: baseUrl + '/report/getWorkByProduct',
            data: {
                theDate: currentdate
            },
            method: 'post',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                
                that.setData({
                    tableData: res.data
                })

                wx.hideLoading();



            }
        })
    },
    onChange(event) {
        this.setData({
          radio: event.detail
        });
      },
    tabChange: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            curTab: index
        })
    },
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        wx.showToast({
            title: '正在加载中',
            icon: 'none'
        })
        this.setData({
            index: e.detail.value
        })
    },
    getDetail: function () {
      
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this;
        this.getOderDetail();
        this.getTableData();
        wx.getSystemInfo({
            success: function(res) {
              var clientHeight =res.windowHeight;
              that.setData({
                scrollHeight:clientHeight-127,
                height:clientHeight
              })
            },
          })

    },
    initChartss:function(canvas, width, height){
        const data = [
            { State: 'WY', 年龄段: '小于5岁', 人口数量: 25635 },
            { State: 'WY', 年龄段: '5至13岁', 人口数量: 1890 },
            { State: 'WY', 年龄段: '14至17岁', 人口数量: 9314 },
            { State: 'DC', 年龄段: '小于5岁', 人口数量: 30352 },
            { State: 'DC', 年龄段: '5至13岁', 人口数量: 20439 },
            { State: 'DC', 年龄段: '14至17岁', 人口数量: 10225 },
            { State: 'VT', 年龄段: '小于5岁', 人口数量: 38253 },
            { State: 'VT', 年龄段: '5至13岁', 人口数量: 42538 },
            { State: 'VT', 年龄段: '14至17岁', 人口数量: 15757 },
            { State: 'ND', 年龄段: '小于5岁', 人口数量: 51896 },
            { State: 'ND', 年龄段: '5至13岁', 人口数量: 67358 },
            { State: 'ND', 年龄段: '14至17岁', 人口数量: 18794 },
            { State: 'AK', 年龄段: '小于5岁', 人口数量: 72083 },
            { State: 'AK', 年龄段: '5至13岁', 人口数量: 85640 },
            { State: 'AK', 年龄段: '14至17岁', 人口数量: 22153 }
          ];

      //var data=this.data.orderData;
      
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