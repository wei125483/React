import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {DropOption, List} from 'components'
import {actions} from 'reducers/api/myApi'
import UseDetail from '../Detail/useDetail'
import ApplyModal from './ApplyModal'
import DataApplyModal from './DataApplyModal'
import {history} from 'utils'


import {Tabs, Modal} from 'antd'
const confirm = Modal.confirm

const TabPane = Tabs.TabPane;


const myApiList = ({app, state, actions}) => {
    const {updateState, queryList, apiApply, requestDel, requestReleaseDel, requestUpdate, applyServer} = actions
    const {list, loading, active, page, pageSize, total, list1, loading1, page1, pageSize1, total1, selectedRowKeys, filter, item, modalShow, renewedShow, isApplyModal} = state
    const {appops} = app
    const handleMenuClick = (record, e) => {
        if (e.key === '1') {
            const newObj = {serverInfo: {}}
            newObj.serverInfo.name = record.serverInfo.name
            newObj.applyUsername = record.applyUsername
            newObj.startUseDate = record.startUseDate
            newObj.endUseDate = record.endUseDate
            newObj.applyReason = record.applyReason
            newObj.id = record.serverInfo.id;
            updateState({modalShow: true, item: newObj})
        } else if (e.key === '2') {
            updateState({renewedShow: true, item: record})
        } else if (e.key === '3') {
            record.userName = app.user.username;
            updateState({isApplyModal: true, item: record})
        } else if (e.key === '4') {
            confirm({
                title: '你确定要删除该接口吗？',
                onOk() {
                    requestDel([record.id])
                },
            })
        }
    }

    const handleMenuClick2 = (record, e) => {
        if (e.key === '1') {
            history.push({
                pathname: `/api/detail/${record.id}`
            })
        } else if (e.key === '2') {
            confirm({
                title: '接口删除后，会导致正在使用该接口的用户无法从接口获取相关数据，你确定要删除该接口吗？',
                onOk() {
                    requestReleaseDel([record.id])
                },
            })
        }
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
            title: '调用地址',
            dataIndex: 'serverPath',
            width: 100,
            key: 'serverPath'
        }, {
            title: '数据源',
            dataIndex: 'serverInfo.dbInfo.dbName',
            width: 100,
            key: 'serverInfo.dbInfo.dbName'
        }, {
            title: '创建者',
            dataIndex: 'serverInfo.pubUserName',
            width: 100,
            key: 'serverInfo.pubUserName'
        }, {
            title: '状态',
            width: 100,
            key: 'approvalState',
            render: (text) => {
                let status = text.approvalState,
                    name = "",
                    color = "#ff5a5a";
                if (status == 1) {
                    name = "待审批"
                    color = "#ffa10f"
                } else if (status == 2) {
                    name = "审批通过"
                    color = "#2dc45d"
                } else if (status == 3) {
                    name = "驳回"
                    color = "#ff5a5a"
                } else if (status == 5) {
                    name = "失效"
                    color = "#ffa10f"
                }
                return <div style={{color}}>{name}</div>;
            },
        }, {
            title: '使用时间',
            width: 200,
            key: 'createDate',
            render: (text, record) => {
                return record.startUseDate + "  -  " + record.endUseDate;
            },
        }, {
            title: '操作',
            key: 'operation',
            width: 100,
            render: (text, record) => {
                const status = text.approvalState;
                let menuOptions = [{key: '1', name: '详情'}]
                if (status === 2) {
                    menuOptions.push({key: '2', name: '续期'})
                } else if (status === 3) {
                    menuOptions.push({key: '3', name: '申请'})
                }
                menuOptions.push({key: '4', name: '删除'})
                return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions}/>
            },
        }]

    const columns1 = [
        {
            title: '序号',
            width: 50,
            key: 'id',
            render: (text, record, index) => {
                let num = ((page1 - 1) * pageSize1) + (index + 1)
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
            title: '创建时间',
            dataIndex: 'createDate',
            width: 150,
            key: 'createDate',
        }, {
            title: '操作',
            key: 'operation',
            width: 100,
            render: (text, record) => {
                //return <a href={"#/api/detail/" + text.id}>详情</a>;
                const status = text.approvalState;
                let menuOptions = [{key: '1', name: '详情'}, {key: '2', name: '删除'}]
                return <DropOption onMenuClick={e => handleMenuClick2(record, e)} menuOptions={menuOptions}/>
            },
        }]

    const listUses = {
        total,
        page,
        pageSize,
        loading,
        list,
        columns,
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
        onShowSizeChange(page, pageSize) {
            queryList({filter, pageSize})
        },
        onChange(page, pageSize) {
            queryList({filter, page, pageSize})
        },
    }
    const listPush = {
        total: total1,
        page: page1,
        pageSize: pageSize1,
        loading: loading1,
        list: list1,
        columns: columns1,
        pagination: {
            total: total1,
            current: page1,
            pageSize,
            onChange(page, pageSize) {
                queryList({filter, isPush: true, page, pageSize})
            },
            onShowSizeChange(page, pageSize) {
                queryList({filter, isPush: true, pageSize})
            },
        },
        onShowSizeChange(page, pageSize) {
            queryList({filter, isPush: true, pageSize})
        },
        onChange(page, pageSize) {
            queryList({filter, isPush: true, page, pageSize})
        },
    }

    const modalProps = {
        item: item,
        visible: modalShow,
        maskClosable: false,
        title: `我使用的接口详情`,
        wrapClassName: 'vertical-center-modal',
        footer: false,
        onCancel() {
            updateState({modalShow: false})
        },
    }

    const renewedProps = {
        item: item,
        visible: renewedShow,
        maskClosable: false,
        showToday: false,
        title: `接口续期`,
        wrapClassName: 'vertical-center-modal',
        confirmLoading: loading1,
        onOk(values) {
            updateState({loading1: true})
            apiApply(values);
        },
        onCancel() {
            updateState({renewedShow: false})
        },
    }

    const tabsCallback = (key) => {
        updateState({active: key})
    }

    const applyModalProps = {
        item: item,
        visible: isApplyModal,
        maskClosable: false,
        title: `接口申请`,
        wrapClassName: 'vertical-center-modal',
        onOk(params) {
            const time = params.time;
            delete  params.time;
            params.type = 1;
            params.startDate = new Date(time[0]).format("yyyy-MM-dd hh:mm:ss");
            params.endDate = new Date(time[1]).format("yyyy-MM-dd hh:mm:ss");
            params.applyReason = params.applyReason || '';
            applyServer(params);
        },
        onCancel() {
            updateState({isApplyModal: false})
        }
    }

    return (
        <div>
            {
                (appops.my_api_use.is || appops.my_api_push.is) ?
                    <Tabs defaultActiveKey={active} onChange={tabsCallback}>
                        {
                            appops.my_api_use.is && <TabPane tab="我使用的接口" key="1"><List {...listUses} /></TabPane>
                        }
                        {
                            appops.my_api_push.is && <TabPane tab="我发布的接口"
                                                              key={appops.my_api_use.is ? "2" : "1"}><List {...listPush} /></TabPane>
                        }
                    </Tabs> : <p style={{textAlign: "center", lineHeight: "60px", border: "1px solid #ccc"}}>你没有访问权限</p>
            }
            {modalShow && <UseDetail  {...modalProps}/>}
            {renewedShow && <ApplyModal  {...renewedProps}/>}
            {isApplyModal && <DataApplyModal  {...applyModalProps}/>}
        </div>
    )
}

myApiList.propTypes = {
    login: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

export default connect((state) => ({state: state.myApi, app: state.app}), mapDispatchToProps)(myApiList)