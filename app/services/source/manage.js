import {request, config} from 'utils'

const {api} = config
const { sourceManageList, sourceManageUpdate, sourceManageDel } = api

export async function list(params) {
    return request({
        url: sourceManageList,
        method: 'get',
        data: params,
    })
}

export async function update(params) {
    return request({
        url: sourceManageUpdate,
        method: 'post',
        data: params,
        msg: params.id ? '修改成功' : '新增成功'
    })
}

export async function remove(params) {
    return request({
        url: sourceManageDel,
        method: 'post',
        data: params,
        msg: '删除成功'
    })
}