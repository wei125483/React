import {put, call, take, fork, select,} from 'redux-saga/effects'

import {isBackPrevPage} from 'utils'
import {types} from 'reducers/api/useCheck'
import {query, list, update, remove} from 'services/api/useCheck'
import {approval} from 'services/api/pushCheck'
import {applyBacthRemove} from 'services/api/dataApi'

function* listUseCheck(payload = {}) {
    yield put({type: types.UPDATE_STATE, payload: {loading: true}})
    let {page = 1, pageSize = 10, filter = {}} = yield select(_ => _.useCheck)
    const newpage = Number(payload.page) || page
    const newpageSize = Number(payload.pageSize) || pageSize
    const newfilter = payload.filter || filter
    const params = {page: newpage, pageSize: newpageSize, status: 1, ...newfilter}
    const data = yield call(list, params)
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

function* updateUseCheck(payload = {}) {
    const data = yield call(update, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {modalShow: false, loading: true}})
        const {page, pageSize, filter} = yield select(_ => _.useCheck)
        const params = {page, pageSize, status: 1, ...filter}
        const useCheckData = yield call(list, params)
        if (useCheckData.success) {
            const result = useCheckData.data || {}
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

function* approvalUseCheck(payload = {}) {
    const data = yield call(approval, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {modalShow: false, loading: true}})
        const {page, pageSize, filter} = yield select(_ => _.useCheck)
        const params = {page, pageSize, status: 1, ...filter}
        const useCheckData = yield call(list, params)
        if (useCheckData.success) {
            const result = useCheckData.data || {}
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

function* delUseCheck(payload = []) {
    const data = yield call(remove, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {loading: true}})
        let {page, pageSize, total, filter} = yield select(_ => _.useCheck)
        if (isBackPrevPage({page, pageSize, total, size: payload.length})) {
            page--
        }
        const params = {page, pageSize, status: 1, ...filter}
        const useCheckData = yield call(list, params)
        if (useCheckData.success) {
            const result = useCheckData.data || {}
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

function* applyDelUseCheck(payload = []) {
    const data = yield call(applyBacthRemove, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {loading: true}})
        let {page, pageSize, total, filter} = yield select(_ => _.useCheck)
        if (isBackPrevPage({page, pageSize, total, size: payload.length})) {
            page--
        }
        const params = {page, pageSize, status: 1, ...filter}
        const useCheckData = yield call(list, params)
        if (useCheckData.success) {
            const result = useCheckData.data || {}
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
function* watchUpdateUseCheck() {
    while (true) {
        let {payload} = yield take(types.REQUEST_UPDATE)
        yield fork(updateUseCheck, payload)
    }
}

// 查询
function* watchListUseCheck() {
    while (true) {
        let {payload} = yield take(types.REQUEST_LIST)
        yield fork(listUseCheck, payload)
    }
}

// 删除
function* watchDelUseCheck() {
    while (true) {
        let {payload} = yield take(types.REQUEST_DEL)
        yield fork(delUseCheck, payload)
    }
}

// 批量删除
function* watchBachDelUseCheck() {
    while (true) {
        let {payload} = yield take(types.REQUEST_BATHDEL)
        yield fork(applyDelUseCheck, payload)
    }
}

// 同意驳回
function* watchApprovalUseCheck() {
    while (true) {
        let {payload} = yield take(types.REQUEST_APPROVAL)
        yield fork(approvalUseCheck, payload)
    }
}

export const useCheckSagas = [
    fork(watchListUseCheck),
    fork(watchUpdateUseCheck),
    fork(watchDelUseCheck),
    fork(watchApprovalUseCheck),
    fork(watchBachDelUseCheck),
]