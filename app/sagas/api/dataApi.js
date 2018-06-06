import {put, call, take, fork, select,} from 'redux-saga/effects'

import {isBackPrevPage} from 'utils'
import {types} from 'reducers/api/dataApi'
import {
    query,
    list,
    update,
    apply,
    start,
    add,
    remove,
    bacthRemove,
    hbaseTbName,
    hbaseColName
} from 'services/api/dataApi'
import {list as dataList, table as tableList, cols as rolList, checkurl} from 'services/source/list'

function* listDataApi(payload = {}) {
    yield put({type: types.UPDATE_STATE, payload: {loading: true}})
    let {page = 1, pageSize = 10, filter = {}} = yield select(_ => _.dataApi)
    const newpage = Number(payload.page) || page
    const newpageSize = Number(payload.pageSize) || pageSize
    const newfilter = payload.filter || filter
    const params = {page: newpage, pageSize: newpageSize, ...newfilter}
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

//获取数据【库】信息
function* sourceDataList() {
    const params = {page: 1, pageSize: 1000}

    const data = yield call(dataList, params)
    if (data.success) {
        const result = data.data || {}
        yield put({
            type: types.UPDATE_STATE, payload: {
                dbList: result.list || [],
            }
        })
    }
}

//根据数据库ID获数据【表】信息
function* sourceTableList(payload = {}) {
    const dbId = payload.dbId
    const params = {dbId}
    const data = yield call(tableList, params)
    if (data.success) {
        let result = data.data || []
        result = result.map(function (item) {
            let list = {};
            list.tbName = item;
            return list
        })
        yield put({
            type: types.UPDATE_STATE, payload: {
                tableList: result || [],
                dataLoading: false,
                colList: [],
                sortList: [],
                dbId: dbId
            }
        })
    } else {
        yield put({
            type: types.UPDATE_STATE, payload: {
                dataLoading: false,
            }
        })
    }
}

//根据数据库ID和数据表名称获取【列】信息
function* sourceColList(payload = {}) {
    const dbId = payload.dbId
    const tbName = payload.tbName
    const params = {dbId, tbName}
    const data = yield call(rolList, params)
    if (data.success) {
        let result = data.data || []
        result = result.map((item, index) => {
            let list = item;
            list.rowKey = index;
            return list
        })
        yield put({
            type: types.UPDATE_STATE, payload: {
                colList: result || [],
                tableLoading: false,
                sortList: []
            }
        })
    } else {
        yield put({
            type: types.UPDATE_STATE, payload: {
                tableLoading: false,
            }
        })
    }
}

//根据HBase数据库ID获数据【表】信息
function* hBaseTableList(payload = {}) {
    yield put({
        type: types.UPDATE_STATE, payload: {
            tableLoading: true,
        }
    })
    const dbId = payload.dbId
    const namespace = payload.namespace
    const params = {dbId, namespace}
    const data = yield call(hbaseTbName, params)
    if (data.success) {
        let result = data.data || []
        result = result.map(function (item) {
            let list = {};
            list.name = item;
            return list
        })
        yield put({
            type: types.UPDATE_STATE, payload: {
                colList: result || [],
                tableLoading: false,
                dbId
            }
        })
    } else {
        yield put({
            type: types.UPDATE_STATE, payload: {
                tableLoading: false,
            }
        })
    }
}

//根据HBase数据库ID和数据表名称获取【列】信息
function* hBaseColList(payload = {}) {
    yield put({
        type: types.UPDATE_STATE, payload: {
            trLoading: true,
        }
    })
    const dbId = payload.dbId
    const tbName = payload.tbName
    const namespace = payload.namespace
    const params = {dbId, tbName, namespace}
    const data = yield call(hbaseColName, params)
    if (data.success) {
        let result = data.data || []
        result = result.map((item, index) => {
            let list = {};
            list.name = item;
            return list
        })
        yield put({
            type: types.UPDATE_STATE, payload: {
                hbaseTrList: result || [],
                trLoading: false,
            }
        })
    } else {
        yield put({
            type: types.UPDATE_STATE, payload: {
                tableLoading: false,
            }
        })
    }
}

//验证【调用地址】是否在数据库中已存在
function* sourceChekcUlr(payload = {}) {
    const serverPath = payload.serverPath
    const params = {serverPath}
    const data = yield call(checkurl, params)
    if (data.success) {
        const result = data.data;
        if (payload.callback) {
            result ? payload.callback() : payload.callback('输入的调用地址已存在');
        }
    }
}

//操作完成后，获取数据列表信息
function* getListInfo(payload = []) {
    yield put({type: types.UPDATE_STATE, payload: {modalShow: false, loading: true}})
    let {page, pageSize, total, filter} = yield select(_ => _.dataApi)
    if (payload.length > 0) {
        if (isBackPrevPage({page, pageSize, total, size: payload.length})) {
            page--
        }
    }
    const params = {page, pageSize, ...filter}
    const dataList = yield call(list, params)
    if (dataList.success) {
        const result = dataList.data || {}
        yield put({
            type: types.UPDATE_STATE, payload: {
                page,
                loading: false,
                modalIsAdd: false,
                isApplyModal: false,
                selectedRowKeys: [], // 已选项
                item: {}, // 详情数据
                addShow: false, // 是否是新增修改状态
                list: result.list || [],
                total: result.total,
            }
        })
    }
}

//添加数据服务接口
function* addDataApi(payload = {}) {
    const data = yield call(add, payload)
    if (data.success) {
        yield put({
            type: types.UPDATE_STATE, payload: {
                dbId: '',
                tableList: [], // 数据源表信息
                colList: [], // 数据源列信息
                item: {}, // 详情数据
                loading: false
            }
        })
        yield fork(getListInfo)
    }
}

//申请数据服务接口
function* applyDataApi(payload = {}) {
    const data = yield call(apply, payload)
    if (data.success) {
        yield fork(getListInfo)
    }
}

function* updateDataApi(payload = {}) {
    const data = yield call(update, payload)
    if (data.success) {
        yield fork(getListInfo)
    }
}

//批量删除
function* bacthDelDataApi(payload = []) {
    const ids = JSON.stringify(payload)
    const data = yield call(bacthRemove, {ids})
    if (data.success) {
        yield fork(getListInfo, payload)
    }
}

//停止服务
function* delDataApi(payload = []) {
    const data = yield call(remove, payload)
    if (data.success) {
        yield fork(getListInfo)
    }
}

//启动服务
function* startDataApi(payload = []) {
    const data = yield call(start, payload)
    if (data.success) {
        yield fork(getListInfo)
    }
}

// 新增修改
function* watchAddDataApi() {
    while (true) {
        let {payload} = yield take(types.ADD_SERVER)
        yield fork(addDataApi, payload)
    }
}

// 申请
function* watchApplyDataApi() {
    while (true) {
        let {payload} = yield take(types.APPLY_SERVER)
        yield fork(applyDataApi, payload)
    }
}

function* watchUpdateDataApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_UPDATE)
        yield fork(updateDataApi, payload)
    }
}

// 查询数据库列表
function* watchSourceData() {
    while (true) {
        yield take(types.DB_LIST)
        yield fork(sourceDataList)
    }
}

// 根据数据库ID查询表结构
function* watchSourceTable() {
    while (true) {
        let {payload} = yield take(types.TABLE_LIST)
        yield fork(sourceTableList, payload)
    }
}

// 根据数据库ID和表名查询列表字段
function* watchColByTable() {
    while (true) {
        let {payload} = yield take(types.COL_LIST)
        yield fork(sourceColList, payload)
    }
}

// 根据HBASE数据库ID查询表结构
function* watchHBaseTable() {
    while (true) {
        let {payload} = yield take(types.HBASE_TABLE_LIST)
        yield fork(hBaseTableList, payload)
    }
}

// 根据HBASE数据库ID和表名查询列表字段
function* watchHBaseCol() {
    while (true) {
        let {payload} = yield take(types.HBASE_COL_LIST)
        yield fork(hBaseColList, payload)
    }
}

function* watchCheckUrl() {
    while (true) {
        let {payload} = yield take(types.CHECK_URL)
        yield fork(sourceChekcUlr, payload)
    }
}

// 查询
function* watchListDataApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_LIST)
        yield fork(listDataApi, payload)
    }
}

// 停止
function* watchDelDataApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_DEL)
        yield fork(delDataApi, payload)
    }
}

// 批量删除
function* watchBacthDelDataApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_BATCHDEL)
        yield fork(bacthDelDataApi, payload)
    }
}

// 启动
function* watchStartDataApi() {
    while (true) {
        let {payload} = yield take(types.REQUEST_START)
        yield fork(startDataApi, payload)
    }
}

export const dataApiSagas = [
    fork(watchListDataApi),
    fork(watchAddDataApi),
    fork(watchApplyDataApi),
    fork(watchSourceData),
    fork(watchSourceTable),
    fork(watchColByTable),
    fork(watchCheckUrl),
    fork(watchUpdateDataApi),
    fork(watchBacthDelDataApi),
    fork(watchDelDataApi),
    fork(watchStartDataApi),
    fork(watchHBaseTable),
    fork(watchHBaseCol),
]