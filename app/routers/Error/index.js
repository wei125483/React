import React from 'react'
import { Icon } from 'antd'
import styles from './index.less'
import { history, permissions } from 'utils'

const Error = () => {
    let text = '页面不存在'
    const { pathname } = history.location
    const menus = permissions.menu.filter((el) => {
        return el.route == pathname
    })
    if (menus.length > 0) {
        text = '没有权限'
    }
    return <div className="content-inner">
        <div className={styles.error}>
            <Icon type="frown-o" />
            <h1>{text}</h1>
        </div>
    </div>
}

export default Error