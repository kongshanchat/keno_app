// pages/qualifiedRate/qualifiedRate.js
import F2 from '../../f2-canvas/lib/f2';
var baseUrl = getApp().globalData.baseUrl;
let chart = null;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        array: [],
        index: 0,
        radio: '1',
        curTab: 0,
        noReason:false
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
                    lineData: res.data,
                    lineId: res.data[0].cxId,
                    lineName:res.data[0].cxName,
                })
                that.getMonth();
                that.getLineDetail(res.data[0].cxId, res.data[0].cxName);
            }
        })
    },
    getLineDetail: function (curLine, lineName) {
        var that = this;
        wx.showLoading({
            title: '正在加载中',
        })
        wx.request({
            url: baseUrl + '/HeGeLvReport/getDeliveryDaily',
            data: {
                lineId: curLine,
                lineName: lineName
            },
            method: 'post',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {

                var drawBar = {
                    onInit: that.initChart
                }
                that.setData({
                    LinesData: res.data,
                    drawBar: drawBar
                })

                wx.hideLoading();



            }
        })
    },
    bindPickerChange: function (e) {
        var array =this.data.array;
        wx.showToast({
            title: '正在加载中',
            icon: 'none'
        })
        this.setData({
            index: e.detail.value,
            curMonth:array[index]
        })
    },
    radioChange(event) {
        var curTab=this.data.curTab;
        var curMonth=this.data.curMonth;

        var lineData=this.data.lineData;
        var l=[];
        for (var i = 0; i < lineData.length;i++){
            if (lineData[i].cxId == event.detail){
                l.push(lineData[i].cxName)
            }
        }
        
        if (curTab==0){
            this.setData({
                lineId: event.detail,
                lineName:l[0]
            });
            
            this.getLineDetail(event.detail, l[0]);
        } else if (curTab==1){
            this.setData({
                lineId: event.detail,
                lineName: l[0]
            });
            this.getMonDetail(curMonth);
        }
    },
    tabChange: function (e) {
        var index = e.currentTarget.dataset.index;
        var lineId=this.data.lineId;
        var lineName=this.data.lineName;
        var curMonth = this.data.curMonth;
        this.setData({
            curTab: index
        })

        if (index==0){
            this.getLineDetail(lineId, lineName);
        }else if(index==1){
            this.getMonDetail(curMonth);
        }

        
    },
    getMonth: function () {
        let datelist = []
        let date = new Date()
        let Y = date.getFullYear()
        let M = date.getMonth() + 1

        for (let i = 0; i < 3; i++) {
            let dateoption = ''
            if (M - 1 !== 0) {} else {
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
            array: datelist,
            curMonth: curMonth
        })
    },
    getMonDetail: function (curMonth) {
        var that = this;
        var lineId = this.data.lineId;
        wx.showLoading({
            title: '正在加载中',
        })
        wx.request({
            url: baseUrl + '/HeGeLvReport/getReason',
            data: {
                reportingDate: curMonth,
                lineId:lineId
                //  F37171FE64FF40F0B0358B4EC80AC724
            },
            method: 'post',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {

                if(res.data.length==0){
                    that.setData({
                        noReason:true
                    })
                }

                var opts = {
                    onInit: that.initChart2
                }
                var opts2 = {
                    onInit: that.initChart3
                }
                that.setData({
                    circleData: res.data,
                    drawScatter: opts,
                    drawRadial: opts2
                })

                wx.hideLoading();



            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.getProLine();

        wx.getSystemInfo({
            success: function (res) {
                var clientHeight = res.windowHeight;
                that.setData({
                    scrollHeight: clientHeight - 127,
                    height: clientHeight
                })
            },
        })
    },
    initChart: function (canvas, width, height) {
        const array = this.data.array;
        const data = [{
            "reportingDate": '2019-06',
            "type": "Florida",
            "value": 4.9
        }, {
            "reportingDate":  '2019-05',
            "type": "Florida",
            "value": 4.8
        }, {
            "reportingDate":  '2019-04',
            "type": "Florida",
            "value": 4.5
        }, {
            "reportingDate": '2019-04',
            "type": "Florida",
            "value": 4.3
        }, {
            "reportingDate": '2019-05',
            "type": "Florida",
            "value": 4.2
        }, {
            "reportingDate": '2019-06',
            "type": "Florida",
            "value": 3.9
        }, {
            "reportingDate": '2019-05',
            "type": "Florida",
            "value": 4.3
        }];
        const data2 = this.data.LinesData;
        chart = new F2.Chart({
            el: canvas,
            width,
            height
        });

        chart.source(data, {
            reportingDate: {
                //range: [0, 1],
                ticks: array,
                tickCount: 3,
            },
            value: {
                tickCount: 10,
                formatter(val) {
                    return val.toFixed(1) + '%';
                }
            }
        });

        chart.tooltip({
            custom: true, // 自定义 tooltip 内容框
            showXTip: true,
            onChange(obj) {
                const legend = chart.get('legendController').legends.top[0];
                const tooltipItems = obj.items;
                const legendItems = legend.items;
                const map = {};
                legendItems.map(item => {
                    map[item.name] = Object.assign({}, item);
                });
                tooltipItems.map(item => {
                    const {
                        name,
                        value
                    } = item;
                    if (map[name]) {
                        map[name].value = value;
                    }
                });
                legend.setItems(Object.values(map));
            },
            onHide() {
                const legend = chart.get('legendController').legends.top[0];
                legend.setItems(chart.getLegendItems().country);
            }
        });

        chart.guide().rect({
            start: [2011, 'max'],
            end: ['max', 'min'],
            style: {
                fill: '#CCD6EC',
                opacity: 0.3
            }
        });

        chart.line().position('reportingDate*value').color('type', val => {
            if (val === 'United States') {
                return '#ccc';
            }
        });
        chart.render();
        return chart;
    },
    initChart2: function (canvas, width, height) {
        const {
            Util,
            G
        } = F2;
        const {
            Group
        } = G;

        function drawLabel(shape, coord, canvas) {
            const {
                center
            } = coord;
            const origin = shape.get('origin');
            const points = origin.points;
            const x1 = (points[2].x - points[1].x) * 0.75 + points[1].x;
            const x2 = (points[2].x - points[1].x) * 1.8 + points[1].x;
            const y = (points[0].y + points[1].y) / 2;
            const point1 = coord.convertPoint({
                x: x1,
                y
            });
            const point2 = coord.convertPoint({
                x: x2,
                y
            });

            // const group = new Group();
            const group = canvas.addGroup();
            group.addShape('Line', {
                attrs: {
                    x1: point1.x,
                    y1: point1.y,
                    x2: point2.x,
                    y2: point2.y,
                    lineDash: [0, 2, 2],
                    stroke: '#808080'
                }
            });
            const text = group.addShape('Text', {
                attrs: {
                    x: point2.x,
                    y: point2.y,
                    text: origin._origin.reason + '  ' + origin._origin.count + ' 元',
                    fill: '#808080',
                    textAlign: 'left',
                    textBaseline: 'bottom'
                }
            });
            const textWidth = text.getBBox().width;
            const baseLine = group.addShape('Line', {
                attrs: {
                    x1: point2.x,
                    y1: point2.y,
                    x2: point2.x,
                    y2: point2.y,
                    stroke: '#808080'
                }
            });
            if (point2.x > center.x) {
                baseLine.attr('x2', point2.x + textWidth);
            } else if (point2.x < center.x) {
                text.attr('textAlign', 'right');
                baseLine.attr('x2', point2.x - textWidth);
            } else {
                text.attr('textAlign', 'center');
                text.attr('textBaseline', 'top');
            }
            //canvas.add(group);
            shape.label = group;
        }

        const data2 = [{
                reason: '原材料原因1',
                count: 669.47,
                a: '1'
            },
            {
                reason: '原材料原因2',
                count: 338,
                a: '1'
            },
            {
                reason: '原材料原因3',
                count: 118.5,
                a: '1'
            },
            {
                reason: '原材料原因4',
                count: 78.64,
                a: '1'
            }
        ];

        const data=this.data.circleData;

        let sum = 0;
        data.map(obj => {
            sum += obj.count;
        });
        chart = new F2.Chart({
            el: canvas,
            width,
            height
        });

        console.log(width, height)
        chart.source(data);
        let lastClickedShape;
        chart.legend({
            position: 'bottom',
            offsetY: -40,
            marker: 'square',
            align: 'center',
            itemMarginBottom: 5,
            onClick(ev) {
                const {
                    clickedItem
                } = ev;
                const dataValue = clickedItem.get('dataValue');
                const canvas = chart.get('canvas');
                const coord = chart.get('coord');
                const geom = chart.get('geoms')[0];
                const container = geom.get('container');
                const shapes = geom.get('shapes'); // 只有带精细动画的 geom 才有 shapes 这个属性

                let clickedShape;
                // 找到被点击的 shape
                Util.each(shapes, shape => {
                    const origin = shape.get('origin');
                    console.log(origin._origin)
                    if (origin && origin._origin.type === dataValue) {
                        clickedShape = shape;
                        return false;
                    }
                });

                if (lastClickedShape) {
                    lastClickedShape.animate().to({
                        attrs: {
                            lineWidth: 0
                        },
                        duration: 200
                    }).onStart(() => {
                        if (lastClickedShape.label) {
                            lastClickedShape.label.hide();
                        }
                    }).onEnd(() => {
                        lastClickedShape.set('selected', false);
                    });
                }

                if (clickedShape.get('selected')) {
                    clickedShape.animate().to({
                        attrs: {
                            lineWidth: 0
                        },
                        duration: 200
                    }).onStart(() => {
                        if (clickedShape.label) {
                            clickedShape.label.hide();
                        }
                    }).onEnd(() => {
                        clickedShape.set('selected', false);
                    });
                } else {
                    const color = clickedShape.attr('fill');
                    clickedShape.animate().to({
                        attrs: {
                            lineWidth: 5
                        },
                        duration: 350,
                        easing: 'bounceOut'
                    }).onStart(() => {
                        clickedShape.attr('stroke', color);
                        clickedShape.set('zIndex', 1);
                        container.sort();
                    }).onEnd(() => {
                        clickedShape.set('selected', true);
                        clickedShape.set('zIndex', 0);
                        container.sort();
                        lastClickedShape = clickedShape;
                        if (clickedShape.label) {
                            clickedShape.label.show();
                        } else {
                            drawLabel(clickedShape, coord, canvas);
                        }
                        canvas.draw();
                    });
                }
            }
        });

        chart.coord('polar', {
            transposed: true,
            innerRadius: 0.7,
            radius: 0.5
        });
        chart.axis(false);
        chart.tooltip(false);
        chart.interval()
            .position('a*count')
            .color('reason', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'])
            .adjust('stack');

        chart.guide().text({
            position: ['50%', '50%'],
            content: sum.toFixed(2),
            style: {
                fontSize: 24
            }
        });
        chart.render();
        return chart;
    },
    initChart3: function (canvas, width, height) {
        chart = new F2.Chart({
            el: canvas,
            width,
            height
        });

        var Global = F2.Global;
        var data2 = [{
                reason: '原材料原因',
                count: 18203
            },
            {
                reason: '原材料原因2',
                count: 23489
            },
            {
                reason: '原材料原因33',
                count: 29034
            },
            {
                reason: '原材料原因44',
                count: 104970
            }
        ];

        const data=this.data.circleData;

        chart.source(data, {
            count: {
                tickCount: 5
            }
        });
        chart.coord({
            transposed: true
        });
        chart.axis('reason', {
            line: Global._defaultAxis.line,
            grid: null
        });
        chart.axis('count', {
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
        chart.interval().position('reason*count');
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