import React from 'react'

import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types'
import {Row, Col, Button, Select, Input, Icon} from 'antd'

const Map = ({
                 names = [],
                 userNumbers = [],
                 flows = [],
                 unit = "KB"
             }) => {
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {

                let res = params[0].name + " 时";

                for (let i = 0, l = params.length; i < l; i++) {
                    let unit = " 个";
                    if (i > 0) {
                        if (params[i].value / 1048576 < 1000) {
                            unit = " KB"
                        } else {
                            unit = " MB"
                        }
                    }
                    if (params[i].seriesType === 'line') {
                        res += '<br/>' + params[i].seriesName + ' : ' + (params[i].value ? params[i].value : '0') + unit;
                    } else {
                        res += '<br/>' + params[i].seriesName + ' : ' + (params[i].value ? params[i].value : '0') + unit;
                    }
                }
                return res;

            }
        },
        grid: {
            top: '16%',
            left: '4%',
            right: '4%',
            bottom: '8%',
            containLabel: true
        },
        legend: {
            data: ['访问用户量', '访问流量']
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            data: names
        }],
        yAxis: [{
            type: 'value',
            name: '访问用户量 (个)',
            min: 0,
            position: 'left',
            splitLine: {
                show: false
            },
            axisLabel: {
                formatter: '{value}'
            }
        }, {
            type: 'value',
            name: `访问流量 (${unit})`,
            min: 0,
            position: 'right',
            splitLine: {
                show: false
            },
            axisLabel: {
                formatter: '{value}'
            }
        }],
        series: [{
            name: '访问用户量',
            type: 'line',
            label: {
                normal: {
                    show: false,
                    position: 'top',
                }
            },
            itemStyle: {
                normal: {
                    color: '#2fc25a'
                }
            },
            data: userNumbers
        }, {
            name: '访问流量',
            type: 'line',
            yAxisIndex: 1,
            label: {
                normal: {
                    show: false,
                    position: 'top'
                }
            },
            itemStyle: {
                normal: {
                    color: '#1890ff'
                }
            },
            data: flows
        }]
    }

    return (
        <div className='echarts-box'>
            <ReactEcharts
                option={option}
                style={{height: '350px'}}
            />
        </div>
    )
}

Map.propTypes = {
    names: PropTypes.array,
    userNumbers: PropTypes.array,
    flows: PropTypes.array,
}

export default Map