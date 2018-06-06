import { request, config } from 'utils'

const { api } = config
const { situationInfo, situationMap } = api

export async function info (params) {
    return request({
        url: situationInfo,
        method: 'get',
        data: params,
    })
}

export async function map (params) {
    return request({
        url: situationMap,
        method: 'get',
        data: params,
    })
}