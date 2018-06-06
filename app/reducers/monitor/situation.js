export const types = {
    UPDATE_STATE: 'monitor/situation/update_state',
    REQUEST_INIT: 'monitor/situation/init',
    REQUEST_DATA: 'monitor/situation/query_data',
}

export const initialState = {
    loadingInfo: false,
    loadingMap: false,
    info: {
        accessTimes: 0, // 访问次数
        accessUsers: 0, // 访问用户量
        dataSize: 0, // 访问流量
        interfaceAmount: 0, // 已发布接口
    },
    mapList1: {},
    mapList7: {},
    mapList30: {},
    filter: { // 搜索条件
        'username': '',
        'interfaceName': '',
    },
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
    setup({dispatch, history}) {
        return history.listen((location = history.location) => {
            const {pathname, search} = location
            if (pathname === '/monitor/situation') {
                dispatch({
                    type: types.UPDATE_STATE
                })
                dispatch({
                    type: types.REQUEST_INIT
                })
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
        type: types.REQUEST_DATA,
        payload: params
    }),

}