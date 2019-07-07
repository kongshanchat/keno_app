import F2 from '../../f2-canvas/lib/f2';
var baseUrl = getApp().globalData.baseUrl;
let chart = null;

Page({
    
    data: {
        noData:false

    },
    getDetail:function(){
        var that = this;
        wx.showLoading({
            title: '正在加载中'
        });
        
        wx.request({
            url: baseUrl + '/reportDeliveryDaily/getDeliveryDetail',
            data: {
                "theDate":"2019-06-04"
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
                }else{
                    var ops = {
                        onInit: that.drawBar
                    }

                    var ops2 = {
                        onInit: that.drawScatter
                    }

                    that.setData({
                        drawScatter: ops2,
                        drawBar: ops,
                        detailData: res.data
                    })
                }
                
                wx.hideLoading();
                // that.getMonth();
                // that.getLineDetail(res.data[0].cxId, res.data[0].cxName);
            }
        })
    },
    onLoad(options){
        var date=options.date;
        this.getDetail();

    },
    drawBar:function(canvas, width, height) {
        
            var data2 = [{
                    cust: '产线111',
                    count: 18203
                },
                {
                    cust: '产线222',
                    count: 23489
                },
                {
                    cust: '产线333',
                    count: 29034
                },
                {
                    cust: '产线444',
                    count: 104970
                },
                {
                    cust: '产线555',
                    count: 131744
                }
            ];

            const data=this.data.detailData;

            const chart = new F2.Chart({
                el: canvas,
                width,
                height
            });

            var Global = F2.Global;

            chart.source(data, {
                count: {
                    tickCount: 5
                }
            });
            chart.coord({
                transposed: true
            });
            chart.axis('cust', {
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

            chart.interval().position('cust*count');
            chart.render();

            return chart;
    },
    drawScatter:function(canvas, width, height) {
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
                    text: origin._origin.cust + '  ' + origin._origin.count + ' %',
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
                cust: '饮食',
                count: 669.47,
                a: '1'
            },
            {
                cust: '服饰美容',
                count: 338,
                a: '1'
            },
            {
                cust: '健康',
                count: 118.5,
                a: '1'
            }
            
        ];

        const data=this.data.detailData;

        let sum = 0;
        data.map(obj => {
            sum += obj.count;
        });
        chart = new F2.Chart({
            el: canvas,
            width,
            height
        });

        console.log(width,height)
        chart.source(data);
        let lastClickedShape;
        chart.legend({
            position: 'bottom',
            offsetY: -20,
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
                    if (origin && origin._origin.cust === dataValue) {
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
            .position('1*count')
            .color('cust', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'])
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

    onReady() {}
});