export const types = {
    UPDATE_STATE: 'dataApi/update_state',
    REQUEST_LIST: 'dataApi/list',
    DB_LIST: 'sourceData/list',
    TABLE_LIST: 'sourceTable/list',
    COL_LIST: 'sourceRol/list',
    HBASE_TABLE_LIST: 'hBaseTable/list',
    HBASE_COL_LIST: 'hBaseCol/list',
    CHECK_URL: 'server/check_url',
    REQUEST_ONE: 'dataApi/one',
    ADD_SERVER: 'dataApi/add',
    APPLY_SERVER: 'dataApi/apply',
    REQUEST_UPDATE: 'dataApi/update',
    REQUEST_DEL: 'dataApi/stop',
    REQUEST_BATCHDEL: 'dataApi/batchdel',
    REQUEST_START: 'dataApi/start',
}

export const initialState = {
    list: [], // 列表数据
    dbList: [], //数据源信息
    dbId: '',
    tableList: [], // 数据源表信息
    colList: [], // 数据源列信息
    hbaseTrList: [], // 数据源列信息
    item: {}, // 详情数据
    isApplyModal: false,
    modalIsAdd: false, // 新增修改弹框类型 false: 新增，true:修改
    addShow: false, // 是否是新增修改状态
    isHBase: false,
    selectedRowKeys: [], // 已选项
    filter: { // 搜索条件
        name: '',
    },
    page: 1,
    pageSize: 10,
    total: 0,
    loading: true, // 列表loading
    dataLoading: false, // 列表loading
    tableLoading: false, // 列表loading
    trLoading: false, // 字段loading
}

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case types.UPDATE_STATE:
            if (!payload) {
                return initialState
            }
            return {...state, ...payload}
        default:
            return state
    }
}

export const subscriptions = {
    setup({dispatch, history}, {queryList, updateState}) {
        return history.listen((location = history.location) => {
            const {pathname, search} = location
            if (pathname === '/dataApi/list') {
                dispatch({type: types.UPDATE_STATE, payload: {addShow: false,}})
                dispatch({type: types.DB_LIST})
                dispatch(queryList())
            }
        })
    }
}

export const actions = {
    updateState: params => ({
        type: types.UPDATE_STATE,
        payload: params
    }),

    queryList: params => ({
        type: types.REQUEST_LIST,
        payload: params
    }),

    querySourceTable: params => ({
        type: types.TABLE_LIST,
        payload: params
    }),

    querySourceCol: params => ({
        type: types.COL_LIST,
        payload: params
    }),

    hBaseTable: params => ({
        type: types.HBASE_TABLE_LIST,
        payload: params
    }),
    hBaseCol: params => ({
        type: types.HBASE_COL_LIST,
        payload: params
    }),
    checkSerUrl: params => ({
        type: types.CHECK_URL,
        payload: params
    }),

    addServer: params => ({
        type: types.ADD_SERVER,
        payload: params
    }),

    applyServer: params => ({
        type: types.APPLY_SERVER,
        payload: params
    }),

    queryOne: id => ({
        type: types.REQUEST_ONE,
        payload: id
    }),

    requestUpdate: params => ({
        type: types.REQUEST_UPDATE,
        payload: params
    }),

    requestDel: ids => ({
        type: types.REQUEST_DEL,
        payload: ids
    }),

    requestBatch: ids => ({
        type: types.REQUEST_BATCHDEL,
        payload: ids
    }),

    startServer: ids => ({
        type: types.REQUEST_START,
        payload: ids
    }),
}