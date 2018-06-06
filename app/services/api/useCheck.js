import { request, config } from 'utils'

const { api } = config
const { useCheckOne, useCheckList, useCheckUpdate, useCheckDel } = api

export async function query (params) {
    return request({
        url: useCheckOne,
        method: 'get',
        data: params,
    })
}

export async function list (params) {
    return request({
        url: useCheckList,
        method: 'get',
        data: params,
    })
}

export async function update (params) {
    return request({
        url: useCheckUpdate,
        method: 'post',
        data: params,
        msg: params.id ? '修改成功' : '新增成功'
    })
}

export async function remove (params) {
    return request({
        url: useCheckDel,
        method: 'post',
        data: params,
        msg: '删除成功'
    })
}