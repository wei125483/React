import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from 'reducers/api/dataApi'
import {DropOption, List} from 'components'
import {Modal} from 'antd'

import Filter from './Filter'
import Addeidt from './Addeidt'
import ApplyModal from './applyModal'
import app from "../../../reducers/app";

const confirm = Modal.confirm

const dataApiList = ({app, state, actions}) => {
    const {updateState, queryList, querySourceTable, querySourceCol, checkSerUrl, applyServer, requestDel, requestBatch, startServer, addServer, hBaseTable, hBaseCol} = actions
    const {list, dbList, dbId, isHBase, hbaseTrList, tableList, colList, trList, loading, dataLoading, tableLoading, trLoading, page, pageSize, total, selectedRowKeys, filter, modalIsAdd, isApplyModal, addShow, item} = state

    const {appops} = app;

    const handleMenuClick = (record, e) => {
        if (e.key === '0') {
            confirm({
                title: '接口删除后，会导致正在使用该接口的用户无法从接口获取相关数据，你确定要删除该接口吗？',
                onOk() {
                    requestBatch([record.id])
                },
            })
        } else if (e.key === '1') {
            record.userName = app.user.username;
            updateState({isApplyModal: true, item: record})
        } else if (e.key === '2') {
            confirm({
                title: '你确定要停止这个数据接口吗？',
                onOk() {
                    requestDel({serverId: record.id})
                },
            })
        } else if (e.key === '3') {
            confirm({
                title: '你确定要启动这个数据接口吗？',
                onOk() {
                    startServer({serverId: record.id})
                },
            })
        } else if (e.key === '4') {
            //详情
            window.location.href = "#/api/detail/" + record.id;
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
            width: 150,
            dataIndex: 'name',
            key: 'name',
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
            title: '申请状态',
            dataIndex: 'applyStatus',
            width: 150,
            key: 'applyStatus',
            render: (text) => {
                const name = text ? "已申请" : "未申请"
                const color = text ? "#2dc45d" : "#ffa10f"
                return <div style={{color}}>{name}</div>;
            },
        }, {
            title: '状态',
            width: 100,
            render: (text) => {
                const status = text.approvalState,
                    name = status === 1 ? "待审批" : status === 2 ? "运行中" : status === 3 ? "审批未通过" : "服务停止",
                    color = status === 1 ? "#ffa10f" : status === 2 ? "#2dc45d" : status === 3 ? "#00c8c6" : "#ff5a5a";
                return <div style={{color}}>{name}</div>;
            },
            key: 'status',
        }, {
            title: '操作',
            key: 'operation',
            width: 100,
            render: (text, record) => {
                const menuOptions = [{key: '4', name: '详情'}];
                if (text.approvalState !== 1) {
                    if (appops.data_api_apply.is && text.approvalState === 2 && !text.applyStatus) {
                        menuOptions.push({key: '1', name: '申请'});
                    }
                    if (appops.data_api_stop.is && text.approvalState === 2) {
                        menuOptions.push({key: '2', name: '停止'});
                    }
                    if (appops.data_api_start.is && text.approvalState === 4) {
                        menuOptions.push({key: '3', name: '启动'});
    
                    }
                }
                menuOptions.push({key: '0', name: '删除'});
                return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions}/>;
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
            updateState({
                modalIsAdd: true,
                addShow: true,
                dbId: '',
                tableList: [],
                colList: [],
            })
        },
        onDelete() {
            requestBatch(selectedRowKeys)
        }
    }
    const listProps = {
        total,
        page,
        pageSize,
        loading,
        columns,
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
        rowSelection: appops.data_api_del.is ? {
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
        item: modalIsAdd ? {} : item,
        visible: addShow,
        dbList,
        trList,
        dataLoading,
        tableLoading,
        trLoading,
        hBaseTable,
        hBaseCol,
        dbId,
        isHBase,
        tableList,
        colList,
        hbaseTrList,
        updateState,
        querySourceTable: (params) => {
            updateState({dataLoading: true, dbId: "", tableList: [], colList: []})
            querySourceTable(params);
        },
        querySourceCol: (params) => {
            updateState({tableLoading: true, colList: []})
            querySourceCol(params);
        },
        checkSerUrl,
        maskClosable: false,
        title: `发布数据接口`,
        wrapClassName: 'vertical-center-modal',
        onOk(params) {
            updateState({loading: true})
            addServer(params);
        },
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
                addShow ? <Addeidt {...addeidtProps} /> : <div><Filter {...filterProps} /><List {...listProps} /></div>
            }
            {isApplyModal && <ApplyModal  {...applyModalProps}/>}
        </div>
    )
}

dataApiList.propTypes = {
    login: PropTypes.object,
    actions: PropTypes.object,
}

const mapStateToProps = state => ({
    app: state.app,
    state: state.dataApi,
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(dataApiList)