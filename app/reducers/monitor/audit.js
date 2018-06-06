export const types = {
    UPDATE_STATE: 'monitor/audit/update_state',
    REQUEST_LIST: 'monitor/audit/list',
}

export const initialState = {
    list: [], // 列表数据
    filter: { // 搜索条件
        interfaceName: '',
        username: '',
        action: '',
        startTime: '',
        endTime: '',
    },
    page: 1,
    pageSize: 10,
    total: 0,
    loading: true // 列表loading
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
            if (pathname === '/monitor/audit') {
                dispatch({
                    type: types.UPDATE_STATE
                })
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
}
