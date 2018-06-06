import {request, config} from 'utils'

const {api} = config
const {dataApiOne, dataApiList, dataApiUpdate, dataApiAdd, dataApiApply, dataApiStop, dataApiBacthRemove, dataApplyBacthRemove, dataApiStart, hBaseTable, hBaseCol} = api

export async function query(params) {
    return request({
        url: dataApiOne,
        method: 'get',
        data: params,
    })
}

export async function list(params) {
    return request({
        url: dataApiList,
        method: 'get',
        data: params,
    })
}

export async function add(params) {
    return request({
        url: dataApiAdd,
        method: 'post',
        data: params,
        msg: '新增成功'
    })
}

export async function apply(params) {
    return request({
        url: dataApiApply,
        method: 'post',
        data: params,
        msg: '申请成功'
    })
}

export async function update(params) {
    return request({
        url: dataApiUpdate,
        method: 'post',
        data: params,
        msg: params.id ? '修改成功' : '新增成功'
    })
}

export async function bacthRemove(params) {
    return request({
        url: dataApiBacthRemove,
        method: 'post',
        data: params,
        msg: '删除成功'
    })
}

export async function applyBacthRemove(params) {
    return request({
        url: dataApplyBacthRemove,
        method: 'post',
        data: params,
        msg: '删除成功'
    })
}

export async function remove(params) {
    return request({
        url: dataApiStop,
        method: 'post',
        data: params,
        msg: '停止成功'
    })
}

export async function start(params) {
    return request({
        url: dataApiStart,
        method: 'post',
        data: params,
        msg: '启动成功'
    })
}

export async function hbaseTbName(params) {
    return request({
        url: hBaseTable,
        method: 'get',
        data: params,
    })
}

export async function hbaseColName(params) {
    return request({
        url: hBaseCol,
        method: 'get',
        data: params,
    })
}