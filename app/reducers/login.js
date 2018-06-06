import { types as appTypes } from './app'

export const types = {
    REQUEST_LOGIN:   'login/request',
    GET_LOGIN:        'login/get',
}

export const initialState = {
    loading: false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case types.REQUEST_LOGIN:
            return { ...state, loading: true }
        case types.GET_LOGIN:
            return { ...state, loading: false }
        default:
            return state
    }
}

export const subscriptions = {
    setup({ dispatch, history }) {
        return history.listen((location = history.location) => {
            const { pathname } = location
            if (pathname === '/login') {
                dispatch({
                    type: appTypes.GET_USER_INFO, 
                    payload: { loading: false }
                })
            }
        })
    }
}

export const actions = {
    login: (payload) => ({
        type: types.REQUEST_LOGIN,
        payload
    }),
}