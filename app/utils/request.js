import axios from 'axios'
import history from './history'
import queryString from 'query-string'
import { message, Modal } from 'antd'
import { prefix, noLoginPages, api } from './config'

//const CONTENTTYPE = 'multipart/form-data'
const CONTENTTYPE = 'application/x-www-form-urlencoded'
const TIMEOUT = 50000
const MSG_TIME = 1.5

let timeoutModal, errorModal

/**Token Login */
let tokenTiemout
window.tokenInfo = JSON.parse(window.localStorage.getItem(`${prefix}token_info`) || 'null')
axios.defaults.headers.Authorization = 'Basic bXktdHJ1c3RlZC1jbGllbnQ6c2VjcmV0'

axios.defaults.timeout = TIMEOUT
axios.defaults.headers.common['Content-Type'] = CONTENTTYPE
axios.defaults.transformRequest = [(data) => {
    let result = ''
    for (let key in data) {
        result += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
    }
    return result
}]

export default function request(options) {
    let Axios = axios.create();
    let { method, data, url, msg, contentType } = options
    data = data || {}
    /**Token Login */
    data.access_token = window.tokenInfo ? window.tokenInfo.access_token : ''
    data.r = Math.random()
    let config = {
        method,
        url
    }

    let load = null
    if (method.toLowerCase() == 'get') {
        config.params = data
    } else {
        load = message.loading('请求中...', 0)
        config.data = data
    }

    if (contentType && contentType !== CONTENTTYPE) {
        Axios.defaults.headers.post['Content-Type'] = contentType
        Axios.defaults.transformRequest = [(data) => {
            return data
        }]
    }
    return Axios(config).then((response) => {
        load && load()
        let { data } = response
        /**Token Login */
        if (url === api.appGetToken) {
            tokenTiemout = data.expires_in
            data.expires_in = new Date().getTime() + tokenTiemout
            window.tokenInfo = data
            window.localStorage.setItem(`${prefix}token_info`, JSON.stringify(data))
            return Promise.resolve({
                success: true,
                data: data
            })
        } else if (window.tokenInfo && tokenTiemout) {
            // 更新过期时间
            let token_info = JSON.parse(window.localStorage.getItem(`${prefix}token_info`) || 'null')
            if (token_info) {
                token_info.expires_in = new Date().getTime() + tokenTiemout
                window.localStorage.setItem(`${prefix}token_info`, JSON.stringify(token_info))
            }
        }
        let success = (data.code == 200) ? true : false
        if (success) {
            msg && message.success(msg, MSG_TIME)
        } else if (data.code == 407) { // 未登录
            let { pathname } = history.location
            if (timeoutModal) {
                timeoutModal.destroy()
                timeoutModal = null
            }
            if (noLoginPages.indexOf(pathname) === -1) {
                timeoutModal = Modal.warning({
                    title: '系统提示',
                    content: '你还没有登录，请先登录！',
                    okText: '知道了',
                    onOk() {
                        /**Token Login */
                        const locationPathname = window.localStorage.getItem(`${prefix}locationPathname`)
                        history.push({
                            pathname: '/login',
                            search: queryString.stringify({
                                from: locationPathname,
                            })
                        })
                    }
                })
            }
        } else {
            Modal.warning({
                title: '系统提示',
                content: data.message || '请求失败！',
                okText: '知道了'
            })
        }
        return Promise.resolve({
            success,
            message: data.message,
            data: data.data
        })
    })
    .catch((error) => {
        load && load()
        let message = '处理失败！'
        if (errorModal) {
            errorModal.destroy()
            errorModal = null
        }
        /**Token Login */
        if (url === api.appGetToken) {
            window.tokenInfo = null
            window.appops = null
            window.localStorage.removeItem(`${prefix}token_info`)
            window.localStorage.removeItem(`${prefix}appops`)
            message = '获取Token失败！'
            if (config.data && config.data.grant_type == 'password') {
                if (error && error.response && error.response.status == 400) {
                    message = '用户名或密码错误！'
                }
            }
        }
        errorModal = Modal.error({
            title: '系统提示',
            content: message,
            okText: '知道了'
        })
        return Promise.resolve({ success: false, data: null, message })
    })
}