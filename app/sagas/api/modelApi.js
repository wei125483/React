import {put, call, take, fork, select,} from 'redux-saga/effects'

import {isBackPrevPage} from 'utils'
import {types} from 'reducers/api/modelApi'
import {query, list, update, remove} from 'services/api/modelApi'

function* listModelApi(payload = {}) {
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

function* updateModelApi(payload = {}) {
    const data = yield call(update, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {modalShow: false, loading: true}})
        const {page, pageSize, filter} = yield select(_ => _.user)
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

function* delModelApi(payload = []) {
    const data = yield call(remove, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {loading: true}})
        let {page, pageSize, total, filter} = yield select(_ => _.user)
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
function* watchUpdateModelApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_UPDATE)
        yield fork(updateModelApi, payload)
    }
}

// 查询
function* watchListModelApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_LIST)
        yield fork(listModelApi, payload)
    }
}

// 删除
function* watchDelModelApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_DEL)
        yield fork(delModelApi, payload)
    }
}

export const modelApiSagas = [
    fork(watchListModelApi),
    fork(watchUpdateModelApi),
    fork(watchDelModelApi),
]