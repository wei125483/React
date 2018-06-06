import {request, config} from 'utils'

const {api} = config
const {pushCheckOne, pushCheckList, pushCheckUpdate, pushCheckApproval, pushCheckApply, pushCheckDel} = api

export async function query(params) {
    return request({
        url: pushCheckOne,
        method: 'get',
        data: params,
    })
}

export async function list(params) {
    return request({
        url: pushCheckList,
        method: 'get',
        data: params,
    })
}

export async function update(params) {
    return request({
        url: pushCheckUpdate,
        method: 'post',
        data: params,
        msg: params.id ? '修改成功' : '新增成功'
    })
}

/**
 *
 * @param params.appType===1   //使用审批，else:发布审批
 * @returns {Promise.<*>}
 */
export async function approval(params) {
    return request({
        url: params.appType === 1 ? pushCheckApply : pushCheckApproval,
        method: 'post',
        data: params,
        msg: params.status == "0" ? '操作成功' : '驳回成功'
    })
}

export async function remove(params) {
    return request({
        url: pushCheckDel,
        method: 'post',
        data: params,
        msg: '删除成功'
    })
}