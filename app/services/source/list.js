import {request, config} from 'utils'

const {api} = config
const {sourceOne, sourceList, sourceTable, sourceCol, sourceCheckUrl, sourceUpdate, sourceDel, sourceTest} = api

export async function list(params) {
    return request({
        url: sourceList,
        method: 'get',
        data: params,
    })
}

export async function table(params) {
    return request({
        url: sourceTable,
        method: 'get',
        data: params,
    })
}

export async function checkurl(params) {
    return request({
        url: sourceCheckUrl,
        method: 'get',
        data: params,
    })
}

export async function cols(params) {
    return request({
        url: sourceCol,
        method: 'get',
        data: params,
    })
}

export async function update(params) {
    return request({
        url: sourceUpdate,
        method: 'post',
        data: params,
        msg: params.id ? '修改成功' : '新增成功'
    })
}

export async function remove(params) {
    return request({
        url: sourceDel,
        method: 'post',
        data: params,
        msg: '删除成功'
    })
}

export async function test(params) {
    return request({
        url: sourceTest,
        method: 'post',
        data: params,
        msg: '测试成功'
    })
}