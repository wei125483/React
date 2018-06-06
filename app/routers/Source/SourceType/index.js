import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { actions } from 'reducers/source/type'

import {DropOption, List} from 'components'
import {Modal} from 'antd'
import Filter from './Filter'
import Addeidt from './Addeidt'

const confirm = Modal.confirm


const SourceTypeList = ({ sourceType, app, actions}) => {
    const { appops } = app
    const {updateState, queryList, requestDel, requestUpdate} = actions
    const {list, loading, page, pageSize, total, selectedRowKeys, filter, modalIsAdd, modalShow, item} = sourceType

    const handleMenuClick = (record, e) => {
        if (e.key === '1') {
            updateState({modalIsAdd: false, modalShow: true, item: record})
        } else if (e.key === '2') {
            confirm({
                title: '你确定要删除该数据源类型吗？',
                onOk() {
                    requestDel([record.id])
                },
            })
        }
    }

    const columns = [
        {
            title: '类型名称',
            dataIndex: 'type',
            key: 'type',
        }, {
            title: '驱动类',
            dataIndex: 'driverName',
            key: 'driverName'
        }, {
            title: '创建者',
            dataIndex: 'createUser',
            key: 'createUser'
        }, {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
            width: 120,
        }, {
            title: '操作',
            key: 'operation',
            width: 100,
            fixed: 'right',
            render: (text, record) => {
                if (appops.source_type_edit.is || appops.source_type_del.is) {
                    let menuOptions = []
                    if (appops.source_type_edit.is) {
                        menuOptions.push({key: '1', name: '修改'})
                    }
                    if (appops.source_type_del.is) {
                        menuOptions.push({key: '2', name: '删除'})
                    }
                    return <DropOption onMenuClick={e => handleMenuClick(record, e)}
                    menuOptions={menuOptions}/>
                }
                return null
            },
        }]

    const filterProps = {
        appops,
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
        rowSelection: appops.source_type_del.is ? {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                updateState({selectedRowKeys})
            }
        } : null,
    }
    const addeidtProps = {
        item: modalIsAdd ? {} : item,
        visible: modalShow,
        isAdd: modalIsAdd,
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

SourceTypeList.propTypes = {
    app: PropTypes.object,
    sourceType: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

const mapStateToProps = state => ({
    app: state.app,
    sourceType: state.sourceType,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourceTypeList)