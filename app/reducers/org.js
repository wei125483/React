import { types as appTypes } from './app'

export const types = {
    UPDATE_STATE: 'org/update_state',
    REQUEST_LIST: 'org/list',
    REQUEST_UPDATE: 'org/update',
    REQUEST_DEL: 'org/del',
}

export const initialState = {
    list: [], // 树列表数据
    tableList: [], //  表格列表数据
    item: {}, // 详情数据
    curKey: undefined, // 当前选择的机构
    modalIsAdd: false, // 新增修改弹框类型 false: 新增，true:修改
    modalShow: false, // 是否是新增修改状态 
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
    setup({ dispatch, history }, { queryList }) {
        return history.listen((location = history.location) => {
            const { pathname, search } = location
            if (pathname === '/org') {
                dispatch({
                    type: types.UPDATE_STATE
                })
                dispatch(queryList())
                dispatch({
                    type: appTypes.REQUEST_PERMISSION
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
        type: types.REQUEST_LIST,
        payload: params
    }),

    requestUpdate: params => ({
        type: types.REQUEST_UPDATE,
        payload: params
    }),

    requestDel: id => ({
        type: types.REQUEST_DEL,
        payload: id
    }),
}