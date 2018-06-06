/* global window */
import classnames from 'classnames'
import lodash from 'lodash'
import config from './config'
import request from './request'
import history from './history'
import permissions from './permissions'

//数组中删除某个元素
Array.prototype.indexOf = function(val) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    const index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
    return this.replace(/-(\w)/g, (...args) => {
        return args[1].toUpperCase()
    })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
    return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
    const o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'H+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds(),
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
        }
    }
    return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
    let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURI(r[2])
    return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
    if (!(array instanceof Array)) {
        return null
    }
    const item = array.filter(_ => _[keyAlias] === key)
    if (item.length) {
        return item[0]
    }
    return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
    let data = lodash.cloneDeep(array)
    let result = []
    let hash = {}
    data.forEach((item, index) => {
        hash[data[index][id]] = data[index]
    })

    data.forEach((item) => {
        let hashVP = hash[item[pid]]
        if (hashVP) {
            !hashVP[children] && (hashVP[children] = [])
            hashVP[children].push(item)
        } else {
            result.push(item)
        }
    })
    return result
}

// const getCurInfo = (list, id) => {
//     let arr = []
//     list.forEach((item) => {
//         if (item.id == id) {
//             arr.push(item)
//         } else if (item.children) {
//             arr.concat(getCurInfo(item.children, id))
//         }
//     })
//     return arr
// }

const getCurInfo = (list, id) => {
    for (let i = 0, l = list.length; i < l; i++) {
        let item = list[i]
        if (item.id == id) {
            return [item]
        } else if (item.children) {
            return getCurInfo(item.children, id)
        }
    }
    return []
}


/**
 * 删除列表时是否跳到上一页
 * @param   {Number}    page
 * @param   {Number}    pageSize
 * @param   {Number}    total
 * @param   {Number}    size
 * @return  {Boolean}
 */
const isBackPrevPage = (object) => {
    let { page, pageSize, total, size } = object
    if (page == 1 || !size) {
        return false
    }
    let res = total % pageSize
    let sumPage = res > 0 ? (parseInt(total / pageSize) + 1) : parseInt(total / pageSize)
    if (sumPage == page && (res == size || pageSize == size)) {
        return true
    }
    return false
}

module.exports = {
    config,
    request,
    history,
    classnames,
    queryURL,
    queryArray,
    arrayToTree,
    permissions,
    isBackPrevPage,
    getCurInfo,
}
