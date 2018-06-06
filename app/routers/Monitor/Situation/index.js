import React from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from 'reducers/monitor/situation'
import {Tabs, Spin} from 'antd'

import General from './General'
import Map from './Map'
import Filter from './Filter'

const TabPane = Tabs.TabPane;
const Situation = ({
                       state,
                       actions
                   }) => {
    const {updateState, queryList} = actions
    const {info, mapList1, mapList7, mapList30, filter, loadingMap, loadingInfo} = state

    const filterProps = {
        filter,
        onFilterChange(value = {}) {
            queryList({filter: value})
        },
    }

    const generalProps = {
        info
    }

    const transformFn = (obj) => {
        const flows = obj.flows || [], newFlows = [];
        const maxValue = Math.max.apply(Math, flows);
        const isMB = (!isNaN(maxValue) && (maxValue / 1048576) < 1000) ? false : true;

        for (let i = 0; i < flows.length; i++) {
            const v = parseInt(flows[i]) / (isMB ? 1048576 : 1024)
            newFlows.push(v.toFixed(2))
        }
        obj.flows = newFlows;
        obj.unit = isMB ? "MB" : "KB";
        return obj
    }

    const map1Props = {
        names: mapList1.name || [],
        userNumbers: mapList1.accessTimes || [],
        flows: mapList1.dataSize || [],
    }

    const map7Props = {
        names: mapList7.name || [],
        userNumbers: mapList7.accessTimes || [],
        flows: mapList7.dataSize || [],
    }

    const map30Props = {
        names: mapList30.name || [],
        userNumbers: mapList30.accessTimes || [],
        flows: mapList30.dataSize || [],
    }

    return (<div>
        <Spin spinning={loadingInfo} style={{height: '180px'}}><General {...generalProps} /></Spin>
        <div style={{paddingBottom: 25, backgroundColor: '#fff'}}>
            <Filter {...filterProps} />
            <Spin spinning={loadingMap} style={{height: '350px'}}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="最近1天访问情况" key="1"><Map {...transformFn(map1Props)} /></TabPane>
                    <TabPane tab="最近7天访问情况" key="2"><Map {...map7Props} /></TabPane>
                    <TabPane tab="最近30天访问情况" key="3"><Map {...map30Props} /></TabPane>
                </Tabs>
            </Spin>
        </div>
    </div>)
}

Situation.propTypes = {
    login: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

export default connect(({situation}) => ({state: situation}), mapDispatchToProps)(Situation)