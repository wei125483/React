import {put, call, take, fork} from 'redux-saga/effects'

import {types} from 'reducers/home'
import {list} from 'services/home'

function* listHome(payload = {}) {
    yield put({type: types.UPDATE_STATE, payload: {loading: true}})
    const data = yield call(list)
    if (data.success) {
        const result = data.data || {}
        yield put({
            type: types.UPDATE_STATE, payload: {
                loading: false,
                use: result.use || 0,
                yesterdayUse: result.yesterdayUse || 0,
                list: result.list || [],
                platform: result.platform || {},
                system: result.system || [],
                section: result.section || [],
            }
        })
    }
}

// 查询
function* watchListHome() {
    while (true) {
        let {payload} = yield take(types.REQUEST_DATA)
        yield fork(listHome, payload)
    }
}

export const homeSagas = [
    fork(watchListHome),
]