import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { actions } from 'reducers/source/manage'

import {DropOption, List} from 'components'
import {Modal} from 'antd'
import Filter from './Filter'
import Addeidt from './Addeidt'

const confirm = Modal.confirm

const SourceManageList = ({ sourceManage, app, actions}) => {
    const { appops } = app
    const {updateState, queryList, requestDel, requestUpdate} = actions
    const {list, orgs, loading, page, pageSize, total, selectedRowKeys, filter, modalIsAdd, modalShow, item} = sourceManage

    const handleMenuClick = (record, e) => {
        if (e.key === '1') {
            record.affiliationOfficeId = record.affiliationOfficeId ? record.affiliationOfficeId.id : ''
            updateState({modalIsAdd: false, modalShow: true, item: record})
        } else if (e.key === '2') {
            confirm({
                title: '你确定要删除该接口组吗？',
                onOk() {
                    requestDel([record.id])
                },
            })
        }
    }

    const columns = [
        {
            title: '接口组名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '接口组编码',
            dataIndex: 'code',
            key: 'code'
        }, {
            title: '所属机构',
            dataIndex: 'affiliationOfficeId',
            key: 'affiliationOfficeId',
            render: (text, record) => {
                return <span>{ record.affiliationOfficeId ? record.affiliationOfficeId.name : '' }</span>
            }
        }, {
            title: '接口组负责人',
            dataIndex: 'supervisor',
            key: 'supervisor',
        }, {
            title: '负责人电话',
            dataIndex: 'phone',
            key: 'phone',
            width: 120,
        }, {
            title: '负责人手机',
            dataIndex: 'mobile',
            key: 'mobile',
            width: 120,
        }, {
            title: '接口组描述',
            dataIndex: 'description',
            key: 'description',
        }, {
            title: '创建日期',
            dataIndex: 'createDate',
            key: 'createDate',
            width: 120,
        }, {
            title: '操作',
            key: 'operation',
            width: 100,
            fixed: 'right',
            render: (text, record) => {
                if (appops.source_manage_edit.is || appops.source_manage_del.is) {
                    let menuOptions = []
                    if (appops.source_manage_edit.is) {
                        menuOptions.push({key: '1', name: '修改'})
                    }
                    if (appops.source_manage_del.is) {
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
        rowSelection: appops.source_manage_del.is ? {
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
        treeData: orgs,
        title: `${modalIsAdd ? '新增接口组' : '修改接口组'}`,
        wrapClassName: 'vertical-center-modal',
        onOk(params) {
            requestUpdate(params)
        },
        onCancel() {
            updateState({modalShow: false})
        },
    }

    return (
        <div>
            <Filter {...filterProps} />
            <List {...listProps} />
            {modalShow && <Addeidt {...addeidtProps} />}
        </div>
    )
}

SourceManageList.propTypes = {
    app: PropTypes.object,
    sourceManage: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

const mapStateToProps = state => ({
    app: state.app,
    sourceManage: state.sourceManage,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourceManageList)