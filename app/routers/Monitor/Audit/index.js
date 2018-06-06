import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from 'reducers/monitor/audit'
import {DropOption, List} from 'components'
import Filter from './Filter'

const AuditList = ({state, actions}) => {
    const {updateState, queryList} = actions
    const {list, loading, page, pageSize, total, filter} = state

    const handleMenuClick = (record, e) => {
        if (e.key === '1') {
            updateState({modalIsAdd: false, modalShow: true, item: record})
        }
    }
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 100,
            key: 'index',
            render: (text, record, index) => {
                let num = ((page - 1) * pageSize) + (index + 1)
                return <span>{ num }</span>
            },
        }, {
            title: '接口名称',
            dataIndex: 'serverName',
            key: 'serverName'
        }, {
            title: '数据源',
            dataIndex: 'dbName',
            key: 'dbName',
            render: (text, record) => {
                let dbName = ''
                if (record.invokeServerInfo && record.invokeServerInfo.dbInfo) {
                    dbName = record.invokeServerInfo.dbInfo.dbName
                }
                return dbName
            },
        }, {
            title: '用户名称',
            dataIndex: 'username',
            width: 150,
            key: 'username',
            render: (text, record) => {
                let username = record.invokeUser ? record.invokeUser.username : ''
                return username
            },
        }, {
            title: '访问时间',
            dataIndex: 'invokeDate',
            width: 150,
            key: 'invokeDate',
            render: (text, record) => {
                let invokeDate = ''
                if (record.invokeDate) {
                    invokeDate = new Date(record.invokeDate).format('yyyy-MM-dd hh:mm:ss')
                }
                return invokeDate
            },
        }, {
            title: '操作结果',
            dataIndex: 'invokeStatus',
            width: 110,
            key: 'invokeStatus',
            render: (text, record) => {
                let statusText = record.invokeStatus == '0' ? '成功' : '失败'
                let fontColor = record.invokeStatus == '0' ? '#00a854' : '#f04134'
                return <span style={{ color: fontColor }}>{statusText}</span>
            },
        }]

    const filterProps = {
        filter,
        onFilterChange(value) {
            queryList({filter: {...value}, pageSize})
        }
    }

    const listProps = {
        total,
        page,
        pageSize,
        columns,
        loading,
        list,
        pagination: {
            total,
            current: page,
            pageSize,
            onChange(page, pageSize) {
                queryList({filter, page, pageSize})
            },
            onShowSizeChange(page, pageSize) {
                queryList({filter, pageSize})
            },
        },
    }

    return (
        <div>
            <Filter {...filterProps} />
            <List {...listProps} />
        </div>
    )
}

AuditList.propTypes = {
    state: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})
export default connect(({audit}) => ({state: audit}), mapDispatchToProps)(AuditList)
