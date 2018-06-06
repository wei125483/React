import {put, call, take, fork, select,} from 'redux-saga/effects'
import {prefix} from 'config'

import {isBackPrevPage} from 'utils'
import {types} from 'reducers/api/myApi'
import {query, update, remove, releaseremove} from 'services/api/myApi'
import {list as serverList} from 'services/api/useCheck'
import {list as pushList, apply} from 'services/api/dataApi'


function* listMyApi(payload = {}) {
    yield put({
        type: types.UPDATE_STATE, payload: {
            loading: true,
            isDetail: false,
            renewedShow: false,
            isApplyModal: false,
            modalShow: false,
        }
    })

    let {page = 1, pageSize = 10, page1 = 1, pageSize1 = 10, filter = {}} = yield select(_ => _.myApi)

    const appops = JSON.parse(window.localStorage.getItem(`${prefix}appops`)) || [];
    page = payload.isPush ? page1 : page;
    pageSize = payload.isPush ? pageSize1 : pageSize;

    const newpage = Number(payload.page) || page
    const newpageSize = Number(payload.pageSize) || pageSize
    const newfilter = payload.filter || filter
    const params = {page: newpage, pageSize: newpageSize, owner: 1, ...newfilter}
    if (!appops.my_api_use.is && !payload.isPush) {
        return false;
    }
    if (!appops.my_api_push.is && payload.isPush) {
        return false;
    }
    const data = yield call((payload.isPush ? pushList : serverList), params)
    if (data.success) {
        const result = data.data || {}
        payload.isPush ? yield put({
            type: types.UPDATE_STATE, payload: {
                loading1: false,
                loading: false,
                item: {},
                selectedRowKeys: [],
                filter: newfilter,
                list1: result.list || [],
                page1: newpage,
                pageSize1: newpageSize,
                total1: result.total,
            }
        }) : yield put({
            type: types.UPDATE_STATE, payload: {
                loading: false,
                loading1: false,
                item: {},
                selectedRowKeys: [],
                filter: newfilter,
                list: result.list || [],
                page: newpage,
                pageSize: newpageSize,
                total: result.total,
            }
        })

    }
}

function* updateMyApi(payload = {}) {
    const data = yield call(update, payload)
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {modalShow: false, loading: true}})
        const {page, pageSize, filter} = yield select(_ => _.myApi)
        const params = {page, pageSize, ...filter}
        const myApiData = yield call(list, params)
        if (myApiData.success) {
            const result = myApiData.data || {}
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

function* delMyApi(payload = []) {
    const ids = JSON.stringify(payload)
    let data = yield call(remove, {ids})
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {loading: true}})
        let {page, pageSize, total, filter} = yield select(_ => _.myApi)
        if (isBackPrevPage({page, pageSize, total, size: payload.length})) {
            page--
        }
        yield put({
            type: types.UPDATE_STATE, payload: {
                page,
            }
        })
        yield call(listMyApi)
    }
}

function* delReleaseMyApi(payload = []) {
    const ids = JSON.stringify(payload)
    let data = yield call(releaseremove, {ids})
    if (data.success) {
        yield put({type: types.UPDATE_STATE, payload: {loading1: true}})
        let {page1, pageSize1, total1} = yield select(_ => _.myApi)
        if (isBackPrevPage({page: page1, pageSize: pageSize1, total: total1, size: payload.length})) {
            page1--
        }
        yield put({
            type: types.UPDATE_STATE, payload: {
                page1,
            }
        })
        yield call(listMyApi, {isPush: true})
    }
}

//申请数据服务接口
function* applyDataApi(payload = {}) {
    const data = yield call(apply, payload)
    if (data.success) {
        yield fork(listMyApi)
    }
    yield put({
        type: types.UPDATE_STATE, payload: {
            renewedShow: false,
            loading1: false,
        }
    })
}

//申请数据服务接口
function* myApplyDataApi(payload = {}) {
    const data = yield call(apply, payload)
    if (data.success) {
        yield fork(listMyApi)
    }
}


// 新增修改
function* watchUpdateMyApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_UPDATE)
        yield fork(updateMyApi, payload)
    }
}

// 申请
function* watchApplyDataApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_APPLY)
        yield fork(applyDataApi, payload)
    }
}

// 查询
function* watchListMyApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_LIST)
        yield fork(listMyApi, payload)
    }
}

// 删除
function* watchDelMyApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_DEL)
        yield fork(delMyApi, payload)
    }
}

// 删除我发布的接口
function* watchReleaseDelMyApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_RELEASE_DEL)
        yield fork(delReleaseMyApi, payload)
    }
}

// 申请
function* watchMyApplyDataApi() {
    while (true) {
        let {payload} = yield take(types.APPLY_SERVER)
        yield fork(myApplyDataApi, payload)
    }
}

export const myApiSagas = [
    fork(watchListMyApi),
    fork(watchUpdateMyApi),
    fork(watchDelMyApi),
    fork(watchReleaseDelMyApi),
    fork(watchApplyDataApi),
    fork(watchMyApplyDataApi),
]