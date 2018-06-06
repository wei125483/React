import { put, call, take, fork } from 'redux-saga/effects'

import { types } from 'reducers/monitor/audit'
import { list, getdetails } from 'services/monitor/audit'

function* listFn(payload = {}) {
    yield put({ type: types.UPDATE_STATE, payload: { loading: true } })
    const page = Number(payload.page) || 1
    const pageSize = Number(payload.pageSize) || 10
    const filter = payload.filter || {}
    const params = { page, pageSize, ...filter }
    params.startTime = params.startTime ? params.startTime + ' 00:00:00' : ''
    params.endTime = params.endTime ? params.endTime + ' 00:00:00' : ''
    const data = yield call(list, params)
    if (data.success) {
        const result = data.data || {}
        yield put({
            type: types.UPDATE_STATE, payload: {
                loading: false,
                selectedRowKeys: [],
                filter,
                page,
                pageSize,
                list: result.list || [],
                total: result.total,
            }
        })
    }
}


// 查询列表
function* watchListFn() {
    while (true) {
        let { payload } = yield take(types.REQUEST_LIST)
        yield fork(listFn, payload)
    }
}

export const auditSagas = [
    fork(watchListFn),
]