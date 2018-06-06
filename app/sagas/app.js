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

import { request, config, history, permissions } from 'utils'
import { types } from 'reducers/app'
import { query, logout, permission, save, update } from 'services/app'
import { Modal } from 'antd'
import queryString from 'query-string'

const { api, prefix } = config

function* getUserInfo() {
    const { pathname } = history.location
    let { role, permission, menu } = permissions
    for (let [key, value] of Object.entries(permission)) {
        permission[key]['is'] = false
    }
    const data = yield call(query)
    if (data.success) {
        let result = {}
        result.loading = false
        result.user = data.data || {}
        const permissionCodes = result.user.permissionCodes || []
        if (result.user.permissionCodes.includes('70010')) {
            result.user.parentPerCodes.push('70010')
        }
        if (result.user.permissionCodes.includes('70020')) {
            result.user.parentPerCodes.push('70020')
        }
        result.permissions = { visit: result.user.parentPerCodes || [] }
        menu = menu.filter((el) => {
            if (el.visit) {
                result.permissions.visit.push(el.id)
                return true
            } else if (result.permissions.visit.includes(el.id)) {
                return true
            }
            return false
        })
        result.menu = menu
        permissionCodes.forEach((el) => {
            for (let [key, value] of Object.entries(permission)) {
                if (value.code == el) {
                    permission[key]['is'] = true
                }
            }
        })
        result.appops = permission
        window.localStorage.setItem(`${prefix}appops`, JSON.stringify(result.appops))
        yield put({ type: types.GET_USER_INFO, payload: result })
        const { pathname } = history.location
        if (pathname === '/login') {
            history.push('/')
            // const { locationQuery } = yield select(_ => _.app)
            // const { from } = locationQuery
            // if (from && from !== '/login') {
            //     history.push(from)
            // } else {
            //     history.push('/')
            // }
        }
    } else {
        yield put({ type: types.GET_USER_INFO, payload: { user: null, loading: false } })
    }
}

function* appUpdate() {
    const data = yield call(update)
    if (data.success) {
        history.replace(history.location.pathname || '/')
    }
}

function* appLogout() {
    window.appops = null
    /**Token Login */
    window.tokenInfo = null
    window.localStorage.removeItem(`${prefix}token_info`)
    window.localStorage.removeItem(`${prefix}appops`)
    yield put({ type: types.GET_USER_INFO, payload: { user: null } })
    const { locationPathname } = yield select(_ => _.app)
    history.push({
        pathname: '/login',
        search: queryString.stringify({
            from: locationPathname,
        })
    })
}



function* getPermission() {
    const { allpermission } = yield select(_ => _.app)
    if (!allpermission || allpermission.length === 0) {
        const data = yield call(permission)
        if (data.success) {
            yield put({ type: types.GET_PERMISSION, payload: data.data })
        } else {
            yield put({ type: types.GET_PERMISSION })
        }
    }
}

function* loginState() {
    const { user, locationPathname } = yield select(_ => _.app)
    if (!user) {
        Modal.warning({
            title: '系统提示',
            content: '你还没有登录，请先登录！',
            onOk() {
                history.push({
                    pathname: '/login',
                    search: queryString.stringify({
                        from: locationPathname,
                    })
                })
            }
        })
    }
}

function* saveUser(payload = {}) {
    const data = yield call(save, payload)
    if (data.success) {
        let result = {}
        result.user = data.data || {}
        yield put({ type: types.GET_USER_INFO, payload: result })
    }
}

function* watchLogout() {
    while (true) {
        yield take(types.REQUEST_LOGOUT)
        yield fork(appLogout)
    }
}

function* watchUpdate() {
    while (true) {
        yield take(types.REQUEST_UPDATE)
        yield fork(appUpdate)
    }
}

function* watchLoginState() {
    while (true) {
        yield take(types.LOGIN_STATE)
        yield fork(loginState)
    }
}

function* watchGetPermission() {
    while (true) {
        yield take(types.REQUEST_PERMISSION)
        yield fork(getPermission)
    }
}

function* watchApp() {
    while (true) {
        yield take(types.REQUEST_USER_INFO)
        yield call(getUserInfo)
    }
}

function* watchSaveUser() {
    while (true) {
        let { payload } = yield take(types.REQUEST_SAVE_USER)
        yield call(saveUser, payload)
    }
}

export const appSagas = [
    fork(watchApp),
    fork(watchSaveUser),
    fork(watchLoginState),
    fork(watchGetPermission),
    fork(watchLogout),
    fork(watchUpdate),
]
