import {request, config} from 'utils'

const {api} = config
const { sourceTypeList, sourceTypeUpdate, sourceTypeDel} = api

export async function list(params) {
    return request({
        url: sourceTypeList,
        method: 'get',
        data: params,
    })
}

export async function update(params) {
    return request({
        url: sourceTypeUpdate,
        method: 'post',
        data: params,
        msg: params.id ? '修改成功' : '新增成功'
    })
}

export async function remove(params) {
    return request({
        url: sourceTypeDel,
        method: 'post',
        data: params,
        msg: '删除成功'
    })
}