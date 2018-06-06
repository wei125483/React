import {history} from 'utils'
import {put, call, take, fork,} from 'redux-saga/effects'

import {types} from 'reducers/api/apiDetail'
import {query} from 'services/api/apiDetail'

function* oneApiDetail(payload = {}) {
    yield put({type: types.UPDATE_STATE, payload: {loading: true}})
    const serverIds = history.location.pathname.split("/");
    payload.id = serverIds[serverIds.length - 1]
    const params = {serverId: payload.id}
    const data = yield call(query, params)
    if (data.success) {
        const result = data.data || {}
        yield put({
            type: types.UPDATE_STATE, payload: {
                loading: false,
                item: result,
            }
        })
    }
}

// 查询
function* watchOneApiDetail() {
    while (true) {
        let {payload} = yield take(types.REQUEST_ONE)
        yield fork(oneApiDetail, payload)
    }
}

export const apiDetailSagas = [
    fork(watchOneApiDetail),
]