import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from 'reducers/api/useCheck'
import {DropOption, List} from 'components'
import Filter from './Filter'
import UseDetail from '../Detail/useDetail'


const useCheckList = ({app, state, actions}) => {
    const {updateState, queryList, requestDel, approval, requestUpdate, bathDel} = actions
    const {appops} = app;
    const {list, loading, page, pageSize, total, selectedRowKeys, filter, modalIsAdd, modalShow, item} = state
    const handleMenuClick = (record, e) => {
        updateState({modalShow: true, item: record})
    }
    const columns = [
        {
            title: '序号',
            width: 50,
            key: 'id',
            render: (text, record, index) => {
                let num = ((page - 1) * pageSize) + (index + 1)
                return <span>{num}</span>
            },
        }, {
            title: '接口名称',
            dataIndex: 'serverInfo.name',
            width: 150,
            key: 'serverInfo.name'
        }, {
            title: '申请者',
            dataIndex: 'applyUsername',
            width: 100,
            key: 'applyUsername'
        }, {
            title: '申请时间',
            width: 150,
            key: 'createDate',
            render: (text, record) => {
                return record.startUseDate + "  -  " + record.endUseDate;
            },
        }, {
            title: '状态',
            width: 100,
            render: (text) => {
                const status = text.approvalState,
                    name = status === 1 ? "待审批" : status === 2 ? "审批通过" : status === 3 ? "审批未通过" : "服务停止",
                    color = status === 1 ? "#ffa10f" : status === 2 ? "#2dc45d" : status === 3 ? "#00c8c6" : "#ff5a5a";
                return <div style={{color}}>{name}</div>;
            },
            key: 'status',
        }, {
            title: '操作',
            key: 'operation',
            width: 100,
            render: (text, record) => {
                // return <a href={"#/api/detail/" + text.id}>详情</a>;
                return <a onClick={(e) => handleMenuClick(record, e)}>详情</a>
            },
        }]
    const filterProps = {
        filter,
        appops,
        selectedRowKeys,
        onFilterChange(value, type, status) {
            const params = {};
            params.ids = JSON.stringify(selectedRowKeys) || "[]";
            params.status = status;
            params.appType = 1;
            if (status) {
                approval(params);
            } else {
                queryList({filter: {...value}, pageSize})
            }
        },
        onAdd() {
            updateState({modalIsAdd: true, modalShow: true})
        },
        onDelete() {
            bathDel({ids: JSON.stringify(selectedRowKeys) || "[]"})
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
        rowSelection: appops.use_api_approval.is ? {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                updateState({selectedRowKeys})
            }
        } : null,
        onShowSizeChange(page, pageSize) {
            queryList({filter, pageSize})
        },
        onChange(page, pageSize) {
            queryList({filter, page, pageSize})
        },
    }
    const addeidtProps = {
        item: item,
        visible: modalShow,
        maskClosable: false,
        title: `接口使用审批详情`,
        wrapClassName: 'vertical-center-modal',
        footer: false,
        onCancel() {
            updateState({modalShow: false})
        },
    }

    return (
        <div>
            <Filter {...filterProps} />
            <List {...listProps} />
            {modalShow && <UseDetail  {...addeidtProps}/>}
        </div>
    )
}

useCheckList.propTypes = {
    login: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

export default connect(({useCheck, app}) => ({state: useCheck, app}), mapDispatchToProps)(useCheckList)