console.log('Radar')
var myChart2;
var Radardata = []
function DrawRadar(Radardata){
    if (myChart2!=null&&myChart2!=""&&myChart2!=undefined){
        myChart2.dispose();
    }
    console.log(Radardata);

myChart2=echarts.init(document.getElementById('Radar'),'dark');
option2 = {
    backgroundColor:'' ,//设置无背景色 
    radar: [       
        {
            
            indicator: [
                { text: '感染速度' ,max:3},
                { text: '社交距离系数' ,max:1},
                { text: '隔离率' ,max:2}
            ],
            nameGap : 3,
            center: ['50%', '55%'],
            radius: 150,
            startAngle: 90,
            splitNumber: 4,
            shape: 'circle',
            name: {
                formatter: '{value}',
                
                textStyle: {
                    color: '#72ACD1'
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(114, 172, 209, 0.2)',
                        'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
                        'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.5)'
                }

            },
            
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.5)'
                }
            }
        }
    ],
    series: [
        {
            name: '雷达图',
            type: 'radar',
            emphasis: {
                lineStyle: {
                    width: 4
                }
                },
                areaStyle: {
                        normal: {
                            shadowBlur: 13,
                            shadowColor: 'rgba(0,0,0,.2)',
                            shadowOffsetX: 0,
                            shadowOffsetY: 10,
                            opacity: 1
                        }
                    },
                    data: Radardata

                },

                ]
}
myChart2.setOption(option2,true);
}
DrawRadar(Radardata);