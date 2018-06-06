import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import echarts from 'echarts';
import { List } from 'components'
import { prefix } from 'config'
import { Tabs, Row, Col, Icon } from 'antd'
import { connect } from 'react-redux'
import { actions } from 'reducers/home'
import Graph from './Graph'
import Pie from './Pie'
import styles from './index.less'
const TabPane = Tabs.TabPane

// const Imgs = {
//     'ping-tai': require('assets/images/ping-tai.png'),

//     'an-quan': require('assets/images/an-quan.png'),
//     'cai-wu': require('assets/images/cai-wu.png'),
//     'ji-shu': require('assets/images/ji-shu.png'),
//     'ke-yun': require('assets/images/ke-yun.png'),
//     'xin-xi': require('assets/images/xin-xi.png'),

//     'huan-jing': require('assets/images/huan-jing.png'),
//     'lv-fu': require('assets/images/lv-fu.png'),
//     'shi-pin': require('assets/images/shi-pin.png'),
//     'zhan-wu': require('assets/images/zhan-wu.png'),
//     'fen-xi': require('assets/images/fen-xi.png'),
//     'zhu-ti': require('assets/images/zhu-ti.png'),
// }

class Home extends Component {

    componentDidMount() {
        this.interval = setInterval(() => this.props.actions.queryData(),  5 * 60 * 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        const { state } = this.props
        let { use, yesterdayUse, list, platform, system, section } = state
        const linksColor = ['#43a6f7', '#f5cb62']

        //let pieColor = [ "#d46b08", "#7cb305", "#096dd9", "#c41d7f", "#531dab", "#08979c", "#d4b106", "#d4380d", "#1d39c4", "#389e0d", "#d48806", "#cf1322"]
        //let pieColor2 = [ "#ff4d4f", "#ffc53d", "#73d13d", "#597ef7", "#9254de", "#13c2c2", "#ffec3d", "#ff7a45", "#ffa940", "#bae637", "#40a9ff", "#f759ab"]
        // let pieColor = ["#e47b7d", "#e48579", "#e49376","#e4a971", "#e4b96c", "#e3d165","#e3e560"]
        // let pieColor2 = ["#5182fa", "#4d8cf7", "#459cf1","#40a8ed", "#3ab6e8", "#30cce0","#2cd6dd"]
        // pieColor.concat(pieColor)
        // pieColor2.concat(pieColor2)

        // system = [
        //     {
        //         name: "服务发布系统",
        //         value: "45",
        //     },
        //     {
        //         name: "服务信息系统",
        //         value: "88",
        //     },
        //     {
        //         name: "客设信息系统",
        //         value: "96",
        //     },
        //     {
        //         name: "客设信息系统1",
        //         value: "30",
        //     },
        //     {
        //         name: "客设信息系统2",
        //         value: "60",
        //     },
        //     {
        //         name: "客设信息系统3",
        //         value: "5",
        //     },
        // ]

        // section = [
        //     {
        //         name: "信息科",
        //         value: "156",
        //     },
        //     {
        //         name: "信息科2",
        //         value: "587",
        //     },
        //     {
        //         name: "信息科3",
        //         value: "96",
        //     },
        //     {
        //         name: "信息科4",
        //         value: "668",
        //     },
        //     {
        //         name: "信息科5",
        //         value: "53",
        //     },
        //     {
        //         name: "信息科6",
        //         value: "782",
        //     },
        // ]


        /**
         * 关系图
         */
        // const nodeCenterList = {
        //     name: platform.name || '大数据服务中心',
        //     x: 500,
        //     y: 275,
        //     value: platform.value || '大数据服务中心',
        //     symbolSize: 100,
        //     category: 2,
        //     symbol: `image://${Imgs['ping-tai']}`,
        //     label: {
        //         normal: {
        //             fontSize: 15,
        //             position: 'bottom',
        //         }
        //     },
        // }

        // let nodeList = []

        // nodeList = section.map((el, index) => {
        //     return {
        //         name: el.name,
        //         x: 0,
        //         y: index * 150,
        //         value: el.value,
        //         category: 0,
        //         symbol: !!Imgs[el.image] ? `image://${Imgs[el.image]}` : null,
        //     }
        // })

        // nodeList = nodeList.concat(system.map((el, index) => {
        //     return {
        //         name: el.name,
        //         x: 1000,
        //         y: index * 120,
        //         value: el.value,
        //         category: 1,
        //         symbol: !!Imgs[el.image] ? `image://${Imgs[el.image]}` : null,
        //     }
        // }))

        // const option = {
        //     categories: [
        //         {
        //             name: '部门',
        //             itemStyle: {
        //                 normal: {
        //                     color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
        //                         offset: 0,
        //                         color: '#01acca'
        //                     }, {
        //                         offset: 1,
        //                         color: '#5adbe7'
        //                     }]),
        //                 },
        //             },
        //             label: {
        //                 normal: {
        //                     position: 'bottom',
        //                 }
        //             },
        //         }, {
        //             name: '中心',
        //             itemStyle: {
        //                 normal: {
        //                     color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
        //                         offset: 0,
        //                         color: '#ffb402'
        //                     }, {
        //                         offset: 1,
        //                         color: '#ffdc84'
        //                     }]),
        //                 }
        //             },
        //             label: {
        //                 normal: {
        //                     position: 'bottom',
        //                 }
        //             },
        //         }, {
        //             name: '系统',
        //             itemStyle: {
        //                 normal: {
        //                     color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
        //                         offset: 0,
        //                         color: '#167fff'
        //                     }, {
        //                         offset: 1,
        //                         color: '#35c1ff'
        //                     }]),
        //                 }
        //             },
        //         }],
        //     data: nodeList.concat([nodeCenterList]),
        //     links: nodeList.map((el) => {
        //         let source, target
        //         if (el.category) {
        //             source = el.name
        //             target = nodeCenterList.name
        //         } else {
        //             source = nodeCenterList.name
        //             target = el.name
        //         }
        //         return {
        //             source,
        //             target,
        //             category: el.category,
        //             value: el.value,
        //             lineStyle: {
        //                 normal: {
        //                     color: el.category ? linksColor[1] : linksColor[0],
        //                     curveness: -0.1,
        //                 }
        //             },
        //         }
        //     }),
        // }

        const columns = [
            {
                title: '接口名称',
                dataIndex: 'name',
                key: 'name'
            }, {
                title: '次数',
                key: 'num',
                width: 60,
                dataIndex: 'num',
                fixed: 'right',
                render: (text, record) => {
                    const number = record.num, color = "#088ECA";
                    return <div style={{ color }}>{number}</div>;
                },
            }]

        const releaseData = []
        const releaseLegend = []
        const useData = []
        const useLegend = []
        system.forEach((el, index) => {
            el.itemStyle = {
                "normal": {
                    "color": `rgba(255, 86, 19, ${system.length == 1 ? '0.7' : (system.length - index) / system.length})`
                    
                }
            }
            releaseLegend.push(el.name)
            releaseData.push({
                "value": el.value,
                "name": el.name,
                "itemStyle": el.itemStyle
            })
        })

        section.forEach((el, index) => {
            el.itemStyle = {
                "normal": {
                    "color": `rgba(0, 174, 255, ${section.length == 1 ? '0.7' : (section.length - index) / section.length})`
                    //"opacity": (section.length - index) / section.length,
                    //"color": pieColor[index]
                }
            }
            useLegend.push(el.name)
            useData.push({
                "value": el.value,
                "name": el.name,
                "itemStyle": el.itemStyle
            })
        })

        const releaseOption = {
            formatter: "{b}: {d}% <br />{c}个",
            data: releaseData,
            legend: releaseLegend
        }

        const useOption = {
            formatter: "{b}: {d}% <br />{c}次",
            data: useData,
            legend: useLegend
        }

        const listProps = {
            columns,
            scroll: { x: false, y: 740 },
            list: list.slice(0, 15),
            pagination: false
        }

        return (<div className={styles.home}>
            <Row className={styles.row}>
                <Col className={styles.item} xl={{ span: 19 }} md={{ span: 24 }} sm={{ span: 24 }}>
                    <div className={styles.map_box}>
                        <div className={styles.titleDiv}>概况</div>
                        {/* 关系图  { (nodeList.length > 0 || !!platform.name) && <Graph {...option} /> } */}
                        <Graph system={system} section={section} />
                    </div>
                    <div className="home_pie_box" style={{ margin: "24px -12px 0px", backgroundColor: "transparent" }}>
                        <Col className={styles.item + " " + styles.pie_box} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="发布情况 Top6" key="1"><Pie {...releaseOption} /></TabPane>
                                <TabPane tab="使用情况 Top6" key="2"><Pie {...useOption} /></TabPane>
                            </Tabs>
                        </Col>
                        <Col className={styles.item} xl={{ span: 14 }} md={{ span: 24 }} sm={{ span: 24 }}>
                            <div className={styles.titleDiv}>接口使用量</div>
                            <Row>
                                <Col className={styles.item + "  fx-ac"} style={{ height: "220px" }} md={12} sm={{ span: 24 }}>
                                    <Row className={"fx-1"}>
                                        <Col span={8}>
                                            <Icon className={styles.fs68} type="fork" />
                                        </Col>
                                        <Col span={16}>
                                            <div className={styles.title}>接口使用总量</div>
                                            <div className={styles.num}>{use} <span>次</span></div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className={styles.item + "  fx-ac"} style={{ height: "220px" }} md={12} sm={{ span: 24 }}>
                                    <Row className={"fx-1"}>
                                        <Col span={8}>
                                            <Icon className={styles.fs68} type="fork" />
                                        </Col>
                                        <Col span={16}>
                                            <div className={styles.title}>昨日接口使用总量</div>
                                            <div className={styles.num}>{yesterdayUse} <span>次</span></div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </div>
                </Col>
                <Col className={styles.item + " " + styles.ranking} xl={{ span: 5 }} md={{ span: 24 }} sm={{ span: 24 }}>
                    <div className={styles.titleDiv}>接口热度排行 Top15</div>
                    <div className="table_home_list">
                        <List {...listProps} />
                    </div>
                </Col>
            </Row>
        </div>)
    }
}

Home.propTypes = {
    state: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

export default connect(({ home }) => ({ state: home }), mapDispatchToProps)(Home)