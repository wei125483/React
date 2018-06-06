import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types'

class Pie extends Component {
    render() {
        const { data, legend, formatter } = this.props

        let sum = 0

        data.forEach((el) =>{
            if (el.value) {
                sum += el.value
            }
        })

        let showValue = sum/100 * 5

        const option = {
            tooltip: {
                trigger: "item",
                formatter
            },
            legend: {
                "orient": "vertical",
                "align": "auto",
                "z": "103",
                "itemGap": 16,
                "itemWidth": 15,
                "left": "70%",
                "top": "10%",
                "data": legend,
                "selectedMode": false,
                "textStyle": {
                    "color": "#666"
                }
            },
            series: [{
                "legendHoverLink": false,
                "type": "pie",
                "startAngle": "50",
                "radius": ["40%", "85%"],
                "center": ["32%", "51%"],
                "data": data.map((item) => {
                    if (item.value < showValue) {
                        item.label = {
                            normal: {
                                show: false
                            }
                        }
                    }
                    return item
                }),
                "label": {
                    "normal": {
                        show: true,
                        position: 'inner',
                        formatter: '{d}%',
                        show: true,
                        textStyle: {
                            color: '#fff',
                            fontSize: 11
                        }
                    }
                },
            }]
        };

        return <div className='echarts-box'>
            <ReactEcharts
                option={option}
                notMerge={true}
                lazyUpdate={true}
                style={{ height: '220px' }}
                theme={"theme_name"} />
        </div>
    }
}

Pie.propTypes = {
    option: PropTypes.object,
}

export default Pie
