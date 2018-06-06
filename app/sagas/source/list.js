import {put, call, take, fork, select,} from 'redux-saga/effects'

import {isBackPrevPage} from 'utils'
import {types} from 'reducers/source/list'
import {list, update, remove, test} from 'services/source/list'
import {list as typeList} from 'services/source/type'
import {list as manageList} from 'services/source/manage'

function* init(payload = {}) {
    const [users, orgs] = yield [
        call(listFn),
        call(typeFn),
        call(manageFn)
    ]
}

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

function* manageFn() {
    const params = {page: 1, pageSize: 1000}
    const data = yield call(manageList, params)
    if (data.success) {
        const result = data.data || {}
        yield put({
            type: types.UPDATE_STATE, payload: {
                manageList: result.list || [],
            }
        })
    }
}

function* typeFn() {
    const params = {page: 1, pageSize: 1000}
    const data = yield call(typeList, params)
    if (data.success) {
        const result = data.data || {}
        yield put({
            type: types.UPDATE_STATE, payload: {
                typeList: result.list || [],
            }
        })
    }
}

function* updateFn(payload = {}) {
    const data = yield call(update, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {modalShow: false, loading: true}})
        const {page, pageSize, filter} = yield select(_ => _.sourceList)
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
    const data = yield call(remove, {ids})
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {loading: true}})
        let {page, pageSize, total, filter} = yield select(_ => _.sourceList)
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

// 测试
function* watchTestFn() {
    while (true) {
        let {payload} = yield take(types.REQUEST_TEST)
        yield call(test, payload)
    }
}

// 初始化
function* watchInitFn() {
    while (true) {
        let { payload } = yield take(types.REQUEST_INIT)
        yield call(init)
    }
}

export const sourceListSagas = [
    fork(watchInitFn),
    fork(watchListFn),
    fork(watchUpdateFn),
    fork(watchDelFn),
    fork(watchTestFn),
]