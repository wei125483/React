import { request, config } from 'utils'

const { api } = config
const { myApiOne, myApiList, myApiUpdate, myApiDel, myReleaseApiDel } = api

export async function query (params) {
    return request({
        url: myApiOne,
        method: 'get',
        data: params,
    })
}

export async function list (params) {
    return request({
        url: myApiList,
        method: 'get',
        data: params,
    })
}

export async function update (params) {
    return request({
        url: myApiUpdate,
        method: 'post',
        data: params,
        msg: params.id ? '修改成功' : '新增成功'
    })
}

export async function remove (params) {
    return request({
        url: myApiDel,
        method: 'post',
        data: params,
        msg: '删除成功'
    })
}

export async function releaseremove (params) {
    return request({
        url: myReleaseApiDel,
        method: 'post',
        data: params,
        msg: '删除成功'
    })
}