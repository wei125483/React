import { request, config } from 'utils'

const { api } = config
const { apiDetailOne} = api

export async function query (params) {
    return request({
        url: apiDetailOne,
        method: 'get',
        data: params,
    })
}
