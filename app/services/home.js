import { request, config } from 'utils'

const { api } = config
const { homeData} = api

export async function list (params) {
    return request({
        url: homeData,
        method: 'get',
        data: params,
    })
}
