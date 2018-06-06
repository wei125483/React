import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from 'reducers/org'

import { DropOption, DataTree } from 'components'
import { Modal, Row, Col } from 'antd'
import Filter from './Filter'
import Addeidt from './Addeidt'

const confirm = Modal.confirm

const Org = ({ 
    app,
    org,
    actions 
}) => {

    const { appops } = app
    const { updateState, queryList, requestDel, requestUpdate } = actions
    const { list, tableList, loading, modalIsAdd, modalShow, item, curKey } = org

    const handleMenuClick = (record, e) => {
        if (e.key === '1') {
            updateState({ modalIsAdd: false, modalShow: true, item: record })
        } else if (e.key === '2') {
            confirm({
                title: '你确定要删除该机构吗？',
                onOk() {
                    requestDel([record.id])
                },
            })
        }
    }

    const filterProps = {
        appops,
        onAdd() {
            updateState({ modalIsAdd: true, modalShow: true, item: {} })
        }
    }

    const columns = [{
        title: '机构名',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        className: 'tl'
    }, {
        title: '机构权限',
        key: 'permissionIds',
        width: '40%',
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
        title: '机构编码',
        dataIndex: 'code',
        key: 'code',
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
            if (appops.org_edit.is || appops.org_del.is) {
                let menuOptions = []
                if (appops.org_edit.is) {
                    menuOptions.push({key: '1', name: '修改'})
                }
                if (appops.org_del.is) {
                    menuOptions.push({key: '2', name: '删除'})
                }
                return <DropOption onMenuClick={e => handleMenuClick(record, e)}
                menuOptions={menuOptions}/>
            }
            return null
        },
    }]

    const listProps = {
        columns,
        loading,
        list: tableList,
    }

    const treeProps = {
        treeData: list,
        onSelect(selectedKeys, info) {
            let curKey 
            let tableList
            if (selectedKeys && selectedKeys[0]) {
                curKey = selectedKeys[0]
            }
            try {
                tableList = [info.selectedNodes[0].props.dataRef]
            } catch (error) {
                tableList = []
            }
            updateState({ curKey, tableList })
        }
    }

    const dataTreeProps = {
        treeProps,
        listProps,
    }

    const addeidtProps = {
        treeData: list,
        allpermission: app.allpermission,
        item: modalIsAdd ? {} : item,
        visible: modalShow,
        isAdd: modalIsAdd,
        maskClosable: false,
        title: `${modalIsAdd ? '新增机构' : '修改机构'}`,
        wrapClassName: 'vertical-center-modal',
        onOk(params) {
            requestUpdate(params)
        },
        onCancel() {
            updateState({ modalShow: false })
        }
    }

    return (
        <div>
            <Filter {...filterProps} />
            <DataTree {...dataTreeProps} />
            {modalShow && <Addeidt {...addeidtProps} />}
        </div>
    )
}

Org.propTypes = {
    app: PropTypes.object,
    org: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

const mapStateToProps = state => ({
    app: state.app,
    org: state.org,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Org)