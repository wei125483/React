import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from 'reducers/user'

import {DropOption, DataTree} from 'components'
import {Modal, Row, Col} from 'antd'
import Filter from './Filter'
import Addeidt from './Addeidt'

const confirm = Modal.confirm

const User = ({app, user, actions}) => {

    const {appops} = app
    const {updateState, queryList, requestDel, requestUpdate} = actions
    const {list, orgs, roles, loading, page, pageSize, total, selectedRowKeys, filter, modalIsAdd, modalShow, item} = user

    const handleMenuClick = (record, e) => {
        if (e.key === '1') {
            updateState({modalIsAdd: false, modalShow: true, item: record})
        } else if (e.key === '2') {
            confirm({
                title: '你确定要删除该用户吗？',
                onOk() {
                    requestDel([record.id])
                },
            })
        }
    }
    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            width: 150,
            key: 'username'
        }, {
            title: '用户角色',
            key: 'roles',
            width: '200px',
            render: (text, record) => {
                let apphtml = "";
                const roles = record.roles.map((item) => {
                    apphtml += item.name + '、';
                    return item.name;
                })
                if (roles.length > 3) {
                    apphtml = roles[0] + "、" + roles[1] + "、" + roles[2] + " ...";
                } else {
                    apphtml = apphtml.slice(0, apphtml.length - 1);
                }
                return <span title={roles.toString()}>{apphtml}</span>
            },
        }, {
            title: '姓名',
            dataIndex: 'name',
            width: 150,
            key: 'name'
        }, {
            title: '所属机构',
            dataIndex: 'officeName',
            key: 'officeName'
        }, {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone'
        }, {
            title: '手机',
            dataIndex: 'mobile',
            key: 'mobile'
        }, {
            title: '创建时间',
            key: 'createDate',
            dataIndex: 'createDate'
        }, {
            title: '操作',
            fixed: 'right',
            key: 'operation',
            width: 100,
            render: (text, record) => {
                if (appops.user_edit.is || appops.user_del.is) {
                    let menuOptions = []
                    if (appops.user_edit.is) {
                        menuOptions.push({key: '1', name: '修改'})
                    }
                    if (appops.user_del.is) {
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
            queryList({filter: {...filter, ...value}, pageSize})
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
        rowSelection: appops.user_del.is ? {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                updateState({selectedRowKeys})
            }
        } : null,
    }

    const dataTreeProps = {
        listProps,
        treeProps: {
            treeData: orgs,
            onSelect(selectedKeys, info) {
                queryList({filter: {...filter, officeId: selectedKeys[0]}, pageSize})
            }
        }
    }
    const addeidtProps = {
        item: modalIsAdd ? {} : item,
        visible: modalShow,
        isAdd: modalIsAdd,
        maskClosable: false,
        rolesData: roles,
        isPassword: user.isPassword || false,
        updateState,
        treeData: orgs,
        title: `${modalIsAdd ? '新增用户' : '修改用户'}`,
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
            <DataTree {...dataTreeProps} />
            {modalShow && <Addeidt {...addeidtProps} />}
        </div>
    )
}

User.propTypes = {
    app: PropTypes.object,
    user: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(User)