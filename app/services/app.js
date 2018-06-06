import { request, config } from 'utils'

const { api } = config
const { appUserInfo, appLogout, appGetToken, appPermission, appUserSave, appUpdate } = api

export async function getToken(params) {
    params.grant_type = 'password'
    return request({
        url: appGetToken,
        method: 'post',
        data: params,
    })
}

export async function reToken(params = {}) {
    params.grant_type = 'refresh_token'
    return request({
        url: appGetToken,
        method: 'post',
        data: params,
    })
}

export async function permission(params) {
    return request({
        url: appPermission,
        method: 'get',
        data: params,
    })
}

export async function query(params) {
    return request({
        url: appUserInfo,
        method: 'get',
        data: params,
    })
}

export async function save(params) {
    return request({
        url: appUserSave,
        method: 'post',
        data: params,
        msg: '修改成功'
    })
}

export async function logout(params) {
    return request({
        url: appLogout,
        method: 'get',
        data: params,
    })
}

export async function update(params) {
    return request({
        url: appUpdate,
        method: 'post',
        data: params,
        msg: '同步成功'
    })
}