import {put, call, take, fork, select,} from 'redux-saga/effects'

import {isBackPrevPage} from 'utils'
import {types} from 'reducers/source/type'
import {list, update, remove} from 'services/source/type'

function* listFn(payload = {}) {
    yield put({type: types.UPDATE_STATE, payload: {loading: true}})
    const page = Number(payload.page) || 1
    const pageSize = Number(payload.pageSize) || 10
    const filter = payload.filter || {}
    const params = {page, pageSize, ...filter}
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

function* updateFn(payload = {}) {
    const data = yield call(update, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {modalShow: false, loading: true}})
        const {page, pageSize, filter} = yield select(_ => _.sourceType)
        const params = {page, pageSize, ...filter}
        const userData = yield call(list, params)
        if (userData.success) {
            const result = userData.data || {}
            yield put({
                type: types.UPDATE_STATE, payload: {
                    loading: false,
                    list: result.list || [],
                    total: result.total,
                }
            })
        }
    }
}

function* delFn(payload = []) {
    const ids = JSON.stringify(payload)
    const data = yield call(remove, { ids })
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {loading: true}})
        let {page, pageSize, total, filter} = yield select(_ => _.sourceType)
        if (isBackPrevPage({page, pageSize, total, size: payload.length})) {
            page--
        }
        const params = {page, pageSize, ...filter}
        const userData = yield call(list, params)
        if (userData.success) {
            const result = userData.data || {}
            yield put({
                type: types.UPDATE_STATE, payload: {
                    page,
                    selectedRowKeys: [],
                    loading: false,
                    list: result.list || [],
                    total: result.total,
                }
            })
        }
    }
}

// 新增修改
function* watchUpdateFn() {
    while (true) {
        let {payload} = yield take(types.REQUEST_UPDATE)
        yield fork(updateFn, payload)
    }
}

// 查询
function* watchListFn() {
    while (true) {
        let {payload} = yield take(types.REQUEST_LIST)
        yield fork(listFn, payload)
    }
}

// 删除
function* watchDelFn() {
    while (true) {
        let {payload} = yield take(types.REQUEST_DEL)
        yield fork(delFn, payload)
    }
}

export const sourceTypeSagas = [
    fork(watchListFn),
    fork(watchUpdateFn),
    fork(watchDelFn),
]