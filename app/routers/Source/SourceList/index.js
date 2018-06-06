import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from 'reducers/source/list'

import JsonView from 'react-json-view'
import { DropOption, List } from 'components'
import { Modal } from 'antd'
import Filter from './Filter'
import Addeidt from './Addeidt'

const confirm = Modal.confirm

const SourceList = ({ app, sourceList, actions }) => {
    const { appops } = app
    const { updateState, queryList, requestDel, requestUpdate, requestTest } = actions
    const { list, typeList, manageList, loading, page, pageSize, total, selectedRowKeys, filter, modalIsAdd, modalShow, item } = sourceList

    const handleMenuClick = (record, e) => {
        if (e.key === '1') {
            record.serviceSystemId = record.serviceSystemId ? record.serviceSystemId.id : ''
            updateState({ modalIsAdd: false, modalShow: true, item: record })
        } else if (e.key === '2') {
            confirm({
                title: '你确定要删除该数据源吗？',
                onOk() {
                    requestDel([record.id])
                },
            })
        }
    }
    const columns = [
        {
            title: '数据源名称',
            dataIndex: 'dbName',
            key: 'dbName',
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (text, record) => {
                let name = record.dbType ? record.dbType.type : ''
                return <span>{name}</span>
            }
        }, {
            title: '接口组',
            dataIndex: 'serviceSystemId',
            key: 'serviceSystemId',
            render: (text, record) => {
                return <span>{ record.serviceSystemId ? record.serviceSystemId.name : '' }</span>
            }
        }, {
            title: '数据库名',
            dataIndex: 'instance',
            key: 'instance'
        }, {
            title: 'IP',
            dataIndex: 'host',
            key: 'host'
        }, {
            title: '创建者',
            dataIndex: 'createUser',
            key: 'createUser'
        }, {
            title: '创建时间',
            dataIndex: 'createDate',
            width: 120,
            key: 'createDate'
        }, {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
                if (appops.source_list_edit.is || appops.source_list_del.is) {
                    let menuOptions = []
                    if (appops.source_list_edit.is) {
                        menuOptions.push({key: '1', name: '修改'})
                    }
                    if (appops.source_list_del.is) {
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
        typeList,
        selectedRowKeys,
        onFilterChange(value) {
            queryList({ filter: { ...value }, pageSize })
        },
        onAdd() {
            updateState({ modalIsAdd: true, modalShow: true })
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
        rowSelection: appops.source_list_del.is ? {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                updateState({ selectedRowKeys })
            }
        } : null,
    }
    const addeidtProps = {
        typeList,
        manageList,
        item: modalIsAdd ? {} : item,
        visible: modalShow,
        isAdd: modalIsAdd,
        maskClosable: false,
        title: `${modalIsAdd ? '新增数据源' : '修改数据源'}`,
        wrapClassName: 'vertical-center-modal',
        onOk(params) {
            requestUpdate(params)
        },
        onCancel() {
            updateState({ modalShow: false })
        },
        onTest(params) {
            requestTest(params)
        }
    }

    const json = {
        array: [1, 2, 3],
        bool: true,
        object: {
            foo: 'bar'
        },
        immutable: {
            foo: [{
                bool: true,
                arrs: [1,2,3]
            }]
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

SourceList.propTypes = {
    sourceList: PropTypes.object,
    app: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

const mapStateToProps = state => ({
    app: state.app,
    sourceList: state.sourceList,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourceList)