import {put, call, take, fork, select,} from 'redux-saga/effects'

import {isBackPrevPage} from 'utils'
import {types} from 'reducers/api/pushCheck'
import {query, list, update, approval, remove} from 'services/api/pushCheck'
import {list as serverList, bacthRemove as bacthRemove} from 'services/api/dataApi'

function* listPushCheck(payload = {}) {
    yield put({type: types.UPDATE_STATE, payload: {loading: true}})
    let {page = 1, pageSize = 10, filter = {}} = yield select(_ => _.pushCheck)
    const newpage = Number(payload.page) || page
    const newpageSize = Number(payload.pageSize) || pageSize
    const newfilter = payload.filter || filter
    const params = {page: newpage, pageSize: newpageSize, status: 1, ...newfilter}
    const data = yield call(serverList, params)
    if (data.success) {
        const result = data.data || {}
        yield put({
            type: types.UPDATE_STATE, payload: {
                loading: false,
                selectedRowKeys: [],
                filter: newfilter,
                page: newpage,
                pageSize: newpageSize,
                list: result.list || [],
                total: result.total,
            }
        })
    }
}

function* approvalPushCheck(payload = {}) {
    const data = yield call(approval, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {modalShow: false, loading: true}})
        const {page, pageSize, filter} = yield select(_ => _.pushCheck)
        const params = {page, pageSize, status: 1, ...filter}
        const pushCheckData = yield call(serverList, params)
        if (pushCheckData.success) {
            const result = pushCheckData.data || {}
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
}

function* updatePushCheck(payload = {}) {
    const data = yield call(update, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {modalShow: false, loading: true}})
        const {page, pageSize, filter} = yield select(_ => _.pushCheck)
        const params = {page, pageSize, ...filter}
        const pushCheckData = yield call(list, params)
        if (pushCheckData.success) {
            const result = pushCheckData.data || {}
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

function* delPushCheck(payload = []) {
    const data = yield call(remove, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {loading: true}})
        let {page, pageSize, total, filter} = yield select(_ => _.pushCheck)
        if (isBackPrevPage({page, pageSize, total, size: payload.length})) {
            page--
        }
        const params = {page, pageSize, ...filter}
        const pushCheckData = yield call(list, params)
        if (pushCheckData.success) {
            const result = pushCheckData.data || {}
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

function* applyDelPushCheck(payload = []) {
    const data = yield call(bacthRemove, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {loading: true}})
        let {page, pageSize, total, filter} = yield select(_ => _.pushCheck)
        if (isBackPrevPage({page, pageSize, total, size: payload.length})) {
            page--
        }
        const params = {page, pageSize, status: 1, ...filter}
        const pushCheckData = yield call(serverList, params)
        if (pushCheckData.success) {
            const result = pushCheckData.data || {}
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
function* watchUpdatePushCheck() {
    while (true) {
        let {payload} = yield take(types.REQUEST_UPDATE)
        yield fork(updatePushCheck, payload)
    }
}

// 同意驳回
function* watchApprovalPushCheck() {
    while (true) {
        let {payload} = yield take(types.REQUEST_APPROVAL)
        yield fork(approvalPushCheck, payload)
    }
}

// 查询
function* watchListPushCheck() {
    while (true) {
        let {payload} = yield take(types.REQUEST_LIST)
        yield fork(listPushCheck, payload)
    }
}

// 删除
function* watchDelPushCheck() {
    while (true) {
        let {payload} = yield take(types.REQUEST_DEL)
        yield fork(delPushCheck, payload)
    }
}

// 批量删除
function* watchBachDelPushCheck() {
    while (true) {
        let {payload} = yield take(types.REQUEST_BATHDEL)
        yield fork(applyDelPushCheck, payload)
    }
}

export const pushCheckSagas = [
    fork(watchListPushCheck),
    fork(watchUpdatePushCheck),
    fork(watchApprovalPushCheck),
    fork(watchDelPushCheck),
    fork(watchBachDelPushCheck),
]