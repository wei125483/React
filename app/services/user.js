import { request, config } from 'utils'

const { api } = config
const { userList, userUpdate, userDel, userReset } = api

export async function list (params = {}) {
    return request({
        url: userList,
        method: 'get',
        data: params,
    })
}

export async function update (params) {
    return request({
        url: userUpdate,
        method: 'post',
        data: params,
        msg: params.id ? '修改成功' : '新增成功'
    })
}

export async function remove (params) {
    return request({
        url: userDel,
        method: 'post',
        data: params,
        msg: '删除成功'
    })
}

export async function reset (params) {
    return request({
        url: userReset,
        method: 'post',
        data: params,
        msg: '重置密码成功'
    })
}