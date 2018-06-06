import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from 'reducers/api/pushCheck'
import {DropOption, List} from 'components'
import Filter from './Filter'
import Addeidt from './Addeidt'


const pushCheckList = ({app, state, actions}) => {
    const {updateState, queryList, requestDel, approval, requestUpdate, bathDel} = actions
    const {list, loading, page, pageSize, total, selectedRowKeys, filter, modalIsAdd, modalShow, item} = state
    const handleMenuClick = (record, e) => {
        if (e.key === '1') {
            updateState({modalIsAdd: false, modalShow: true, record})
        }
    }
    const {appops} = app;
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
            dataIndex: 'name',
            width: 150,
            key: 'name'
        }, {
            title: '调用地址',
            dataIndex: 'serverPath',
            width: 100,
            key: 'serverPath'
        }, {
            title: '数据源',
            dataIndex: 'dbInfo.dbName',
            width: 100,
            key: 'dbInfo.dbName'
        }, {
            title: '创建者',
            dataIndex: 'pubUserName',
            width: 100,
            key: 'pubUserName'
        }, {
            title: '创建时间',
            dataIndex: 'createDate',
            width: 150,
            key: 'createDate',
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
                return <a href={"#/api/detail/" + text.id}>详情</a>;
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
        rowSelection: appops.push_api_approval.is ? {
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
        onEditItem(item) {
            updateState({modalIsAdd: false, modalShow: true, item})
        },
        onDelItem(id) {
            requestDel([id])
        }
    }
    const addeidtProps = {
        item: modalIsAdd ? {} : item,
        visible: modalShow,
        maskClosable: false,
        title: `${modalIsAdd ? '新增数据源类型' : '修改数据源类型'}`,
        wrapClassName: 'vertical-center-modal',
        onOk(params) {
            requestUpdate(params)
        },
        onCancel() {
            updateState({modalShow: false})
        }
    }

    return (
        <div>
            <Filter {...filterProps} />
            <List {...listProps} />
            {modalShow && <Addeidt {...addeidtProps} />}
        </div>
    )
}

pushCheckList.propTypes = {
    login: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

export default connect(({pushCheck, app}) => ({state: pushCheck, app}), mapDispatchToProps)(pushCheckList)