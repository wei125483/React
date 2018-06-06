import {request, config} from 'utils'

const {api} = config
const { auditList } = api

export async function list(params = {}) {
    return request({
        url: auditList,
        method: 'get',
        data: params,
    })
}
