import { request, config } from 'utils'

const { api } = config
const { appLogin } = api

export async function login(params={}) {
    params.grant_type = 'password'
    return request({
        url: appLogin,
        method: 'post',
        data: params,
    })
}