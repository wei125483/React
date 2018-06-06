export const types = {
    UPDATE_STATE: 'modelApi/update_state',
    REQUEST_LIST: 'modelApi/list',
    REQUEST_ONE: 'modelApi/one',
    REQUEST_UPDATE: 'modelApi/update',
    REQUEST_DEL: 'modelApi/del',
}

export const initialState = {
    list: [], // 列表数据
    item: {}, // 详情数据
    modalIsAdd: false, // 新增修改弹框类型 false: 新增，true:修改
    modalShow: false, // 是否是新增修改状态 
    selectedRowKeys: [], // 已选项
    filter: { // 搜索条件
        name: '',
    },
    page: 1,
    pageSize: 10,
    total: 0,
    loading: true // 列表loading
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case types.UPDATE_STATE:
            if (!payload) {
                return initialState
            }
            return { ...state, ...payload }
        default:
            return state
    }
}

export const subscriptions = {
    setup({ dispatch, history }, { queryList, updateState }) {
        return history.listen((location = history.location) => {
            const { pathname, search } = location
            if (pathname === '/modelApi/list') {
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
}