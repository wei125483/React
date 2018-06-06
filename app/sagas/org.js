import {
    takeEvery,
    delay,
    takeLatest,
    buffers,
    channel,
    eventChannel,
    END
} from 'redux-saga'
import {
    put,
    call,
    take,
    fork,
    select,
    actionChannel,
    cancel,
    cancelled
} from 'redux-saga/effects'

import { request, config, history, getCurInfo } from 'utils'
import { types as appTypes } from 'reducers/app'
import { types } from 'reducers/org'
import { list, update, remove } from 'services/org'

function* listFn() {
    yield put({ type: types.UPDATE_STATE, payload: { loading: true, modalShow: false } })
    const data = yield call(list)
    if (data.success) {
        const result = data.data || []
        const params = { 
            loading: false, 
            list: result || [],
        }
        const { curKey } = yield select(_ => _.org)
        let tableList = []
        if (curKey) {
            tableList = getCurInfo(result, curKey)
        }
        yield put({ type: types.UPDATE_STATE, payload: { 
                tableList,
                loading: false, 
                list: result || [],
            } 
        })
    }
}

function* updateFn(payload = {}) {
    const data = yield call(update, payload)
    if (data.success) {
        yield fork(listFn)
        if (!!payload.id) {
            const { user } = yield select(_ => _.app)
            if (user.officeId == payload.id) {
                yield put({ type: appTypes.REQUEST_USER_INFO })
            }
        }
    }
}

function* delFn(payload = []) {
    const ids = JSON.stringify(payload)
    const data = yield call(remove, { ids })
    if (data.success) {
        const { user } = yield select(_ => _.app)
        yield fork(listFn)
        if (payload.includes(user.officeId)) {
            yield put({ type: appTypes.REQUEST_USER_INFO })
        }
    }
}

// 新增修改
function* watchUpdateFn() {
    while (true) {
        let { payload } = yield take(types.REQUEST_UPDATE)
        yield fork(updateFn, payload)
    }
}

// 查询
function* watchListFn() {
    while (true) {
        yield take(types.REQUEST_LIST)
        yield fork(listFn)
    }
}

// 删除
function* watchDelFn() {
    while (true) {
        let { payload } = yield take(types.REQUEST_DEL)
        yield fork(delFn, payload)
    }
}

export const orgSagas = [
    fork(watchListFn),
    fork(watchUpdateFn),
    fork(watchDelFn),
]