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
import { types } from 'reducers/user'
import { list, update, remove, reset } from 'services/user'
import { list as orgList } from 'services/org'
import { list as roleList } from 'services/role'

function* init(payload = {}) {
    const [users, roles, orgs] = yield [
        call(listFn),
        call(roleList, { page: 1, pageSize: 1000 }),
        call(orgList, {})
    ]
    if (roles.success) {
        const result = roles.data.list || []
        yield put({ type: types.UPDATE_STATE, payload: { 
                roles: result
            } 
        })
    }
    if (orgs.success) {
        const result = orgs.data || []
        yield put({ type: types.UPDATE_STATE, payload: { 
                orgs: result
            } 
        })
    }
    yield put({ type: types.UPDATE_STATE, payload: { loading: false } })
}

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
        yield put({ type: types.UPDATE_STATE, payload: { 
                loading: false, 
                filter,
                page,
                selectedRowKeys: [],
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
        const { page, pageSize, filter } = yield select(_ => _.user)
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
                if (user.id == payload.id) {
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
        let { page, pageSize, total, filter } = yield select(_ => _.user)
        if (isBackPrevPage({ page, pageSize, total, size: payload.length })) {
            page--
        }
        const params = { page, pageSize, ...filter }
        const listData = yield call(list, params)
        if (listData.success) {
            const result = listData.data || {}
            yield put({ type: types.UPDATE_STATE, payload: { 
                    page,
                    loading: false, 
                    selectedRowKeys: [],
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

// 初始化
function* watchInitFn() {
    while (true) {
        let { payload } = yield take(types.REQUEST_INIT)
        yield call(init, { userId: payload })
    }
}

export const userSagas = [
    fork(watchInitFn),
    fork(watchListFn),
    fork(watchUpdateFn),
    fork(watchDelFn),
]