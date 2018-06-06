import { request, config } from 'utils'

const { api } = config
const { modelApiOne, modelApiList, modelApiUpdate, modelApiDel } = api

export async function query (params) {
    return request({
        url: modelApiOne,
        method: 'get',
        data: params,
    })
}

export async function list (params) {
    return request({
        url: modelApiList,
        method: 'get',
        data: params,
    })
}

export async function update (params) {
    return request({
        url: modelApiUpdate,
        method: 'post',
        data: params,
        msg: params.id ? '修改成功' : '新增成功'
    })
}

export async function remove (params) {
    return request({
        url: modelApiDel,
        method: 'post',
        data: params,
        msg: '删除成功'
    })
}