

export const types = {
    UPDATE_STATE: 'home/update_state',
    REQUEST_DATA: 'home/queryData',
}

export const initialState = {
    use: 0, // 接口使用总量
    yesterdayUse: 0, // 昨日接口使用总量
    list: [], // 接口热度排行 15条
    platform: { // 大数据及接口数
    },
    system: [], // 各系统及接口数
    section: [], // 各科室及使用接口次数
    listLoad: true // 列表loading
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
    setup({dispatch, history}, {queryData, updateState}) {
        return history.listen((location = history.location) => {
            const {pathname, search} = location
            if (pathname === '/home' || pathname === '/') {
                dispatch(queryData())
            }
        })
    }
}

export const actions = {
    updateState: params => ({
        type: types.UPDATE_STATE,
        payload: params
    }),

    queryData: params => ({
        type: types.REQUEST_DATA,
        payload: params
    }),

}