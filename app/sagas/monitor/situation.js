import {put, call, take, fork} from 'redux-saga/effects'

import { types } from 'reducers/monitor/situation'
import { info, map } from 'services/monitor/situation'

function* init() {
    yield put({ type: types.UPDATE_STATE, payload: { loadingInfo: true, loadingMap: true } })
    const [infoData, mapData] = yield [
        call(info),
        call(map),
    ]
    let mapList1 = {}
    let mapList7 = {}
    let mapList30 = {}
    if (mapData.success) {
        mapList1 = mapData.data.past1day || {}
        mapList7 = mapData.data.past7day || {}
        mapList30 = mapData.data.past30day || {}
    }
    yield put({ type: types.UPDATE_STATE, payload: { info: infoData.data || {}, mapList1, mapList7, mapList30, loadingInfo: false, loadingMap: false } })
}

function* upDateMap(payload = {}) {
    const filter = payload.filter || {}
    yield put({ type: types.UPDATE_STATE, payload: { loadingMap: true } })
    const data = yield call(map, { ...filter })
    let mapList1 = {}
    let mapList7 = {}
    let mapList30 = {}
    if (data.success) {
        mapList1 = data.data.past1day || {}
        mapList7 = data.data.past7day || {}
        mapList30 = data.data.past30day || {}
    }
    yield put({ type: types.UPDATE_STATE, payload: { filter, mapList1, mapList7, mapList30, loadingMap: false } })
}

// 初始化
function* watchInitFn() {
    while (true) {
        yield take(types.REQUEST_INIT)
        yield call(init)
    }
}

// 更新图表
function* watchUpDateMapFn() {
    while (true) {
        let { payload } = yield take(types.REQUEST_DATA)
        yield fork(upDateMap, payload)
    }
}

export const situationSagas = [
    fork(watchInitFn),
    fork(watchUpDateMapFn),
]