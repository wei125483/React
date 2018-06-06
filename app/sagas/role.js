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

import { request, config, history, isBackPrevPage } from 'utils' 
import { types as appTypes } from 'reducers/app'
import { types } from 'reducers/role'
import { list, update, remove } from 'services/role'

function* listFn(payload = {}) {
    yield put({ type: types.UPDATE_STATE, payload: { loading: true } })
    const page = Number(payload.page) || 1
    const pageSize = Number(payload.pageSize) || 10
    const filter = payload.filter || {}
    const params = { page, pageSize, ...filter }
    const data = yield call(list, params)
    if (data.success) {
        const result = data.data || {}
        yield put({ type: types.UPDATE_STATE, payload: { 
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
        yield put({ type: types.UPDATE_STATE, payload: { modalShow: false,  loading: true }})
        const { page, pageSize, filter } = yield select(_ => _.role)
        const params = { page, pageSize, ...filter }
        const listData = yield call(list, params)
        if (listData.success) {
            const result = listData.data || {}
            yield put({ type: types.UPDATE_STATE, payload: { 
                    loading: false, 
                    list: result.list || [],
                    total: result.total,
                } 
            })
            if (!!payload.id) {
                const { user } = yield select(_ => _.app)
                const roleIds = JSON.parse(user.roleIds || null) || []
                if (roleIds.includes(payload.id)) {
                    yield put({ type: appTypes.REQUEST_USER_INFO })
                }
            }
        }
    }
}

function* delFn(payload = []) {
    const ids = JSON.stringify(payload)
    const data = yield call(remove, { ids })
    if (data.success) {
        yield put({ type: types.UPDATE_STATE, payload: { loading: true } })
        let { page, pageSize, total, filter } = yield select(_ => _.role)
        if (isBackPrevPage({ page, pageSize, total, size: payload.length })) {
            page--
        }
        const params = { page, pageSize, ...filter }
        const listData = yield call(list, params)
        if (listData.success) {
            const result = listData.data || {}
            yield put({ type: types.UPDATE_STATE, payload: { 
                    page,
                    selectedRowKeys: [],
                    loading: false, 
                    list: result.list || [],
                    total: result.total,
                } 
            })
        }
        const { user } = yield select(_ => _.app)
        const roleIds = JSON.parse(user.roleIds || null) || []
        let flag = false
        roleIds.forEach((el) => {
            if (payload.includes(el)) {
                flag = true
                return false
            }
        })
        if (flag) {
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
        let { payload } = yield take(types.REQUEST_LIST)
        yield fork(listFn, payload)
    }
}

// 删除
function* watchDelFn() {
    while (true) {
        let { payload } = yield take(types.REQUEST_DEL)
        yield fork(delFn, payload)
    }
}

export const roleSagas = [
    fork(watchListFn),
    fork(watchUpdateFn),
    fork(watchDelFn),
]