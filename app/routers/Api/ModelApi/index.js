import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from 'reducers/api/modelApi'
import {DropOption, List} from 'components'
import {Modal} from 'antd'
import Filter from './Filter'
import Addeidt from './Addeidt'

const confirm = Modal.confirm

const modelApiList = ({state, actions}) => {
    const {updateState, queryList, requestDel, requestUpdate} = actions
    const {list, loading, page, pageSize, total, selectedRowKeys, filter, modalIsAdd, modalShow, item} = state
    const handleMenuClick = (record, e) => {
        if (e.key === '1') {
            updateState({modalIsAdd: false, modalShow: true, record})
        } else if (e.key === '2') {
            confirm({
                title: '你确定要停止这个模型接口吗？',
                onOk() {
                    requestDel([record.id])
                },
            })
        }
    }
    const columns = [
        {
            title: '序号',
            width: 50,
            key: 'id',
            render: (text, rows, index) => {
                return index + 1
            },
        }, {
            title: '接口名称',
            dataIndex: 'name',
            width: 100,
            key: 'name'
        }, {
            title: '创建者',
            dataIndex: 'creator',
            width: 100,
            key: 'creator'
        }, {
            title: '创建时间',
            width: 150,
            dataIndex: 'date',
            key: 'date',
        }, {
            title: '状态',
            width: 100,
            render: (text) => {
                const status = text.status,
                    name = status === 1 ? "待审批" : status === 2 ? "使用中" : "已完成",
                    color = status === 1 ? "#ffa10f" : status === 2 ? "#00c8c6" : "#2dc45d";
                return <div style={{color}}>{name}</div>;
            },
            key: 'status',
        }, {
            title: '操作',
            key: 'operation',
            width: 100,
            render: (text, record) => {
                return <DropOption onMenuClick={e => handleMenuClick(record, e)}
                                   menuOptions={[{key: '1', name: '详情'}, {key: '2', name: '停止'}]}/>
            },
        }]

    const filterProps = {
        filter,
        selectedRowKeys,
        onFilterChange(value) {
            queryList({filter: {...value}, pageSize})
        },
        onAdd() {
            updateState({modalIsAdd: true, modalShow: true})
        },
        onDelete() {
            requestDel(selectedRowKeys)
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
                queryList({ filter, page, pageSize })
            },
            onShowSizeChange(page, pageSize) {
                queryList({ filter, pageSize })
            },
        },
        rowSelection: {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                updateState({selectedRowKeys})
            }
        },
        onShowSizeChange(page, pageSize) {
            queryList({filter, pageSize})
        },
        onChange(page, pageSize) {
            queryList({filter, page, pageSize})
        },
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

modelApiList.propTypes = {
    login: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

export default connect(({modelApi}) => ({state: modelApi}), mapDispatchToProps)(modelApiList)