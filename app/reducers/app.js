import queryString from 'query-string'
import { prefix } from 'config'
import { reToken } from 'services/app'
import { call } from 'redux-saga/effects'

export const types = {
    LOGIN_STATE: 'app/login_state',
    REQUEST_USER_INFO: 'app/userinfo',
    REQUEST_SAVE_USER: 'app/save_user',
    REQUEST_PERMISSION: 'app/allpermission',
    GET_PERMISSION: 'app/get_permission',
    GET_USER_INFO: 'app/get_userinfo',
    REQUEST_LOGOUT: 'app/logout',
    REQUEST_UPDATE: 'app/update',
    NAV_OPEN_KEYS: 'app/nav_open_keys',
    NAV_BAR: 'app/nav_bar',
    SWITCH_MENU_POPVER: 'app/switch_menu_popver',
    SWITCH_THEME: 'app/switch_theme',
    SWITCH_SIDER: 'app/switch_sider',
}

const init = {
    user: null,
    permissions: {
        visit: [],
    },
    appops: {},
    allpermission: [],
    loading: true,
    menu: [],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    prevLocationPathname: '',
    locationPathname: '',
    locationQuery: {},
}

export default (state = init, { type, payload }) => {
    switch (type) {
        case types.GET_USER_INFO:
            return { ...state, ...payload }
        case types.GET_PERMISSION:
            return { ...state, allpermission: payload || [] }
        case types.NAV_OPEN_KEYS:
            return { ...state, navOpenKeys: payload }
        case types.NAV_BAR:
            return { ...state, isNavbar: payload }
        case types.SWITCH_THEME:
            return { ...state, darkTheme: payload }
        case types.SWITCH_SIDER:
            return { ...state, siderFold: payload }
        case types.SWITCH_MENU_POPVER:
            return { ...state, menuPopoverVisible: !state.menuPopoverVisible }
        default:
            return state
    }
}

export const subscriptions = {
    setup({ dispatch, history }, { getUserInfo, handleNavbar, switchSider }) {
        const resize = () => {
            const isNavbar = document.body.clientWidth < 769
            const siderFold = document.body.clientWidth < 992
            dispatch(handleNavbar(isNavbar))
            if (isNavbar) {
                dispatch(handleNavbar(isNavbar))
            } else {
                dispatch(switchSider(siderFold))
            }
        }
        document.body.clientWidth < 769 && resize()
        let tid
        window.onresize = () => {
            clearTimeout(tid)
            tid = setTimeout(resize(), 300)
        }

        const { pathname } = location

        //dispatch(getUserInfo())
        /**Token Login */
        if (pathname !== '/login') {
            if (!window.tokenInfo || (new Date().getTime() > window.tokenInfo.expires_in)) {
                window.tokenInfo = null
                window.appops = null
                window.localStorage.removeItem(`${prefix}token_info`)
                window.localStorage.removeItem(`${prefix}appops`)

                history.push({
                    pathname: '/login',
                    search: queryString.stringify({
                        from: pathname,
                    })
                })
            } else {
                dispatch(getUserInfo())
            }
        }
    },

    setupHistory({ dispatch, history }, { getUserInfo }) {
        history.listen(function (locationState) {
            const location = locationState || history.location
            const { pathname, search } = location
            const prevLocationPathname = window.localStorage.getItem(`${prefix}locationPathname`) || ''
            window.localStorage.setItem(`${prefix}locationPathname`, pathname)
            dispatch({
                type: types.GET_USER_INFO,
                payload: {
                    prevLocationPathname,
                    locationPathname: pathname,
                    locationQuery: queryString.parse(search),
                }
            })
            if (locationState && pathname !== '/login') {
                //dispatch({ type: types.LOGIN_STATE })
            }
        })
    }
}

export const actions = {
    getUserInfo: () => ({
        type: types.REQUEST_USER_INFO
    }),
    requestSaveUser: (payload) => ({
        type: types.REQUEST_SAVE_USER,
        payload
    }),
    update: () => ({
        type: types.REQUEST_UPDATE
    }),
    logout: () => ({
        type: types.REQUEST_LOGOUT
    }),
    switchTheme: (payload) => {
        window.localStorage.setItem(`${prefix}darkTheme`, payload)
        return {
            type: types.SWITCH_THEME,
            payload
        }
    },
    switchSider: (payload) => {
        window.localStorage.setItem(`${prefix}siderFold`, payload)
        return {
            type: types.SWITCH_SIDER,
            payload
        }
    },
    switchMenuPopver: () => ({
        type: types.SWITCH_MENU_POPVER
    }),
    handleNavOpenKeys: (payload) => ({
        type: types.NAV_OPEN_KEYS,
        payload
    }),
    handleNavbar: (payload) => ({
        type: types.NAV_BAR,
        payload
    }),
}