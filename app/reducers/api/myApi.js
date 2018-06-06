export const types = {
    UPDATE_STATE: 'myApi/update_state',
    REQUEST_LIST: 'myApi/list',
    REQUEST_ONE: 'myApi/one',
    REQUEST_UPDATE: 'myApi/update',
    REQUEST_DEL: 'myApi/del',
    REQUEST_RELEASE_DEL: 'myApi/release_del',
    APPLY_SERVER: 'myApi/server',
    REQUEST_APPLY: 'myApi/apply',
}

export const initialState = {
    list: [], // 使用列表数据
    list1: [], // 发布列表数据
    item: {}, // 详情数据
    isApplyModal: false,
    active: "1",
    isDetail: false,
    modalIsAdd: false, // 新增修改弹框类型 false: 新增，true:修改
    modalShow: false, // 是否是新增修改状态
    renewedShow: false,//续期弹框
    selectedRowKeys: [], // 已选项
    filter: { // 搜索条件
        name: '',
    },
    page: 1,
    pageSize: 10,
    total: 0,
    loading: true, // 列表loading
    page1: 1,
    pageSize1: 10,
    total1: 0,
    loading1: true // 列表loading
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
            if (pathname === '/myApi/list') {
                dispatch(queryList())
                dispatch(queryList({isPush: true}))
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

    applyServer: params => ({
        type: types.APPLY_SERVER,
        payload: params
    }),

    apiApply: params => ({
        type: types.REQUEST_APPLY,
        payload: params
    }),

    requestUpdate: params => ({
        type: types.REQUEST_UPDATE,
        payload: params
    }),

    requestDel: ids => ({
        type: types.REQUEST_DEL,
        payload: ids
    }),

    requestReleaseDel: ids => ({
        type: types.REQUEST_RELEASE_DEL,
        payload: ids
    }),
}