export const types = {
    UPDATE_STATE: 'apiDetail/update_state',
    REQUEST_ONE: 'apiDetail/one',
}

export const initialState = {
    item: {}, // 详情数据
    serverId: "",
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
    setup({dispatch, history}, {queryOne, updateState}) {
        return history.listen((location = history.location) => {
            const {pathname} = location
            if (pathname.indexOf('/api/detail/') !== -1) {
                dispatch(queryOne())
            }
        })
    }
}

export const actions = {
    updateState: params => ({
        type: types.UPDATE_STATE,
        payload: params
    }),

    queryOne: id => ({
        type: types.REQUEST_ONE,
        payload: id
    }),
}