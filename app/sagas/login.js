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

import { request, config, history } from 'utils'
import { types as appTypes } from 'reducers/app'
import { types } from 'reducers/login'
import { getToken } from 'services/app'

const api = config.api

function* submitLogin(payload) {
    const data = yield call(getToken, payload)
    yield put({ type: types.GET_LOGIN })
    if (data.success) {
        yield put({ type: appTypes.REQUEST_USER_INFO })
    }
}

function* watchLogin() {
    while (true) {
        let { payload } = yield take(types.REQUEST_LOGIN)
        yield call(submitLogin, payload)
    }
}

export const loginSagas = [
    fork(watchLogin),
]
