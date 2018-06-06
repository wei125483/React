import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from 'reducers/role'

import {DropOption, List} from 'components'
import {Modal, Row, Col} from 'antd'
import Filter from './Filter'
import Addeidt from './Addeidt'

const confirm = Modal.confirm

const Role = ({app, role, actions}) => {

    const { appops } = app
    const {updateState, queryList, requestDel, requestUpdate} = actions
    const {list, loading, page, pageSize, total, selectedRowKeys, filter, modalIsAdd, modalShow, item} = role

    const handleMenuClick = (record, e) => {
        if (e.key === '1') {
            updateState({modalIsAdd: false, modalShow: true, item: record})
        } else if (e.key === '2') {
            confirm({
                title: '你确定要删除该角色吗？',
                onOk() {
                    requestDel([record.id])
                },
            })
        }
    }
    const columns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            width: 150,
            key: 'name'
        }, {
            title: '角色权限',
            key: 'permissions',
            render: (text, record) => {
                let apphtml = "";
                const permissions = record.permissions.map((item) => {
                    apphtml += item.name + '、';
                    return item.name;
                })
                if (permissions.length > 5) {
                    apphtml = '';
                    for (let i = 0; i < 5; i++) {
                        apphtml += i === 4 ? permissions[i] + " ..." : permissions[i] + "、";
                    }
                } else {
                    apphtml = apphtml.slice(0, apphtml.length - 1);
                }
                return <span title={permissions.toString()}>{apphtml}</span>
            },
        }, {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks'
        }, {
            title: '操作',
            fixed: 'right',
            key: 'operation',
            width: 100,
            render: (text, record) => {
                if (appops.role_edit.is || appops.role_del.is) {
                    let menuOptions = []
                    if (appops.role_edit.is) {
                        menuOptions.push({key: '1', name: '修改'})
                    }
                    if (appops.role_del.is) {
                        menuOptions.push({key: '2', name: '删除'})
                    }
                    return <DropOption onMenuClick={e => handleMenuClick(record, e)}
                    menuOptions={menuOptions}/>
                }
                return null
            },
        }]

    const filterProps = {
        filter,
        appops,
        selectedRowKeys,
        onFilterChange(value) {
            queryList({filter: {...value}, pageSize})
        },
        onAdd() {
            updateState({modalIsAdd: true, modalShow: true, item: {}})
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
                queryList({filter, page, pageSize})
            },
            onShowSizeChange(page, pageSize) {
                queryList({filter, pageSize})
            },
        },
        rowSelection: appops.role_del.is ? {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                updateState({selectedRowKeys})
            }
        } : null,
    }

    const addeidtProps = {
        treeData: app.allpermission,
        item: modalIsAdd ? {} : item,
        visible: modalShow,
        isAdd: modalIsAdd,
        maskClosable: false,
        title: `${modalIsAdd ? '新增角色' : '修改角色'}`,
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

Role.propTypes = {
    app: PropTypes.object,
    role: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

const mapStateToProps = state => ({
    app: state.app,
    role: state.role,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Role)