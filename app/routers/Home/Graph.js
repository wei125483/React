import React, {Component} from 'react'
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types'
import styles from './index.less'

class Graph extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        
        const {system = [], section = []} = this.props

        const option = {
            title: {
                show: true,
                text: '车站大脑',
                //subtext: '2016年',
                x: 'center',
                y: 'center',
                textStyle: {
                    fontWeight: 'bold',
                    color: "rgba(255, 86, 19, 0.8)",
                    fontSize: 17
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                show: false,
                orient: 'vertical',
                x: 'left',
                data:[]
            },
            series: [
                {
                    name:'接口数量',
                    type:'pie',
                    //selectedMode: 'single',
                    //radius: ["20%", '40%'],
                    radius: ["25%", '45%'],
                    
                    label: {
                        normal: {
                            //position: 'inner'
                            color: "rgba(255, 86, 19, 0.8)",
                        }
                    },

                    // label: {
                    //     normal: {
                    //         show: false,
                    //         formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{per|{c}}  ',
                    //         backgroundColor: '#eee',
                    //         borderColor: '#aaa',
                    //         borderWidth: 1,
                    //         borderRadius: 4,
                    //         // shadowBlur:3,
                    //         // shadowOffsetX: 2,
                    //         // shadowOffsetY: 2,
                    //         // shadowColor: '#999',
                    //         // padding: [0, 7],
                    //         rich: {
                    //             a: {
                    //                 color: '#999',
                    //                 fontSize: 12,
                    //                 lineHeight: 20,
                    //                 align: 'center'
                    //             },
                    //             // abg: {
                    //             //     backgroundColor: '#334455',
                    //             //     width: '100%',
                    //             //     align: 'right',
                    //             //     height: 22,
                    //             //     borderRadius: [4, 4, 0, 0]
                    //             // },
                    //             hr: {
                    //                 borderColor: '#aaa',
                    //                 width: '100%',
                    //                 borderWidth: 0.5,
                    //                 height: 0
                    //             },
                    //             b: {
                    //                 //color: '#666',
                    //                 fontSize: 13,
                    //                 lineHeight: 24
                    //             },
                    //             per: {
                    //                 // color: '#eee',
                    //                 // backgroundColor: '#334455',
                    //                 // padding: [2, 4],
                    //                 // borderRadius: 2
                    //             }
                    //         }
                    //     }
                    // },
                    // labelLine: {
                    //     length: 1,
                    //     length2: 2,
                    //     smooth: true,
                    //     normal: {
                    //         show: true
                    //     }
                    // },
                    data: system,
                    // data:[
                    //     //{value:107, name:'接口组1', selected:true},
                    //     {value:107, name:'接口组1'},
                    //     {value:104, name:'接口组3'},
                    //     {value:125, name:'接口组2'}
                    // ]
                },
                {
                    name:'使用次数',
                    type:'pie',
                    //radius: ['60%', '80%'],
                    radius: ['65%', '85%'],
                    label: {
                        normal: {
                            color: "rgba(0, 174, 255, 0.8)",
                        }
                    },
                    // label: {
                    //     normal: {
                    //         show: false,
                    //         formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    //         backgroundColor: '#eee',
                    //         borderColor: '#aaa',
                    //         borderWidth: 1,
                    //         borderRadius: 4,
                    //         // shadowBlur:3,
                    //         // shadowOffsetX: 2,
                    //         // shadowOffsetY: 2,
                    //         // shadowColor: '#999',
                    //         // padding: [0, 7],
                    //         rich: {
                    //             a: {
                    //                 color: '#999',
                    //                 lineHeight: 22,
                    //                 align: 'center'
                    //             },
                    //             // abg: {
                    //             //     backgroundColor: '#333',
                    //             //     width: '100%',
                    //             //     align: 'right',
                    //             //     height: 22,
                    //             //     borderRadius: [4, 4, 0, 0]
                    //             // },
                    //             hr: {
                    //                 borderColor: '#aaa',
                    //                 width: '100%',
                    //                 borderWidth: 0.5,
                    //                 height: 0
                    //             },
                    //             b: {
                    //                 fontSize: 16,
                    //                 lineHeight: 33
                    //             },
                    //             per: {
                    //                 color: '#eee',
                    //                 backgroundColor: '#334455',
                    //                 padding: [2, 4],
                    //                 borderRadius: 2
                    //             }
                    //         }
                    //     }
                    // },
                    data: section,
                    // data:[
                    //     {value:93, name:'科室1'},
                    //     {value:33, name:'科室2'},
                    //     {value:46, name:'科室3'},
                    //     {value:26, name:'科室4'},
                    //     {value:32, name:'科室5'},
                    //     {value:105, name:'科室6'},
                    //     {value:105, name:'科室7'}
                    // ]
                }
            ]
        }

        /**
         * 关系图
         */
        // const {categories, data, links} = this.props
        // const option = {
        //     series: [{
        //         type: 'graph',
        //         layout: 'none',
        //         symbolSize: 50,
        //         coordinateSystem: null,
        //         label: {
        //             normal: {
        //                 show: true,
        //                 fontSize: 12,
        //                 fontFamily: '宋体',
        //                 fontWeight: 'bold',
        //                 color: '#5e5e5e'
        //             }
        //         },
        //         edgeLabel: {
        //             normal: {
        //                 show: true,
        //                 textStyle: {
        //                     fontSize: 10
        //                 },
        //                 formatter: function (params) {
        //                     const data = params.data
        //                     const txt = `${data.value} ${data.category ? '个': '次'}`
        //                     return txt
        //                 },
        //             }
        //         },
        //         edgeSymbol: ['none', 'arrow'],
        //         edgeSymbolSize: 8,
        //         categories,
        //         data,
        //         links,
        //     }]
        // }

        return <div className={styles.echarts_box}>
            <div className={styles.items_center}>
                <ReactEcharts
                option={option}
                notMerge={true}
                lazyUpdate={true}
                style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
                theme={"theme_name"}/>
            </div>
            <div className={styles.items_left}>
                <p>接口使用情况 Top6</p>
                <ul className={styles.items_list}>
                    {
                        section.map((el, index) => {
                            return <li key={index}><i style={{background: el.itemStyle.normal.color, opacity: el.itemStyle.normal.opacity || 1}}></i>{el.name}<b>{el.value}</b><span>次</span></li>
                        })
                    }
                </ul>
            </div>
            <div className={styles.items_right}>
                <p>接口组情况 Top6</p>
                <ul className={styles.items_list}>
                    {
                        system.map((el, index) => {
                            return <li key={index}><i style={{background: el.itemStyle.normal.color, opacity: el.itemStyle.normal.opacity || 1}}></i>{el.name}<b>{el.value}</b><span>个</span></li>
                        })
                    }
                </ul>
            </div>
        </div>
    }
}

Graph.propTypes = {
    option: PropTypes.object,
}

export default Graph
