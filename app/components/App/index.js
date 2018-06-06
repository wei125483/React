import React from 'react'
import PropTypes from 'prop-types'
import NProgress from 'nprogress'
import pathToRegexp from 'path-to-regexp'
import {Switch, Icon} from 'antd'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from 'reducers/app'
import { classnames } from 'utils'
import {noLoginPages, prefix} from 'config'
import Error from 'routers/error'
import Loader from 'components/Loader'
import {Header, Bread, Footer, Sider, styles} from 'components/Layout'
import 'themes/index.less'
import './index.less'

let lastHref

const App = ({
    state,
    actions,
    location,
    children
}) => {
    const {user, loading, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys, menu, permissions} = state
    let {pathname} = location
    pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
    const current = menu.filter(item => pathToRegexp(item.route || '').exec(pathname))
    const hasPermission = current.length ? permissions.visit.includes(current[0].id) : false
    const href = window.location.href
    const isHome = pathname === '/' || pathname === "/home";
    const isNoBread = pathname === '/' || pathname === "/home";
    if (lastHref !== href) {
        NProgress.start()
        if (true) {
            NProgress.done()
            lastHref = href
        }
    }

    const headerProps = {
        menu,
        user: user || {},
        location,
        siderFold,
        isNavbar,
        menuPopoverVisible,
        navOpenKeys,
        switchMenuPopover() {
            actions.switchMenuPopver()
        },
        logout() {
            actions.logout()
        },
        update() {
            actions.update()
        },
        switchSider() {
            actions.switchSider(!siderFold)
        },
        changeOpenKeys(openKeys) {
            actions.handleNavOpenKeys(openKeys)
        },
    }

    const siderProps = {
        menu,
        location,
        siderFold,
        darkTheme,
        navOpenKeys,
        changeTheme() {
            actions.switchTheme(!darkTheme)
        },
        changeOpenKeys(openKeys) {
            window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
            actions.handleNavOpenKeys(openKeys)
        },
    }

    const breadProps = {
        menu,
        location,
    }
    if (noLoginPages && noLoginPages.includes(pathname)) {
        return (<div>
            <Loader fullScreen spinning={loading}/>
            {children}
        </div>)
    }

    return (
        <div>
            <Loader fullScreen spinning={loading}/>
            <div
                className={classnames(styles.layout, {[styles.fold]: isNavbar ? false : siderFold}, {[styles.withnavbar]: isNavbar})}>
                {!isNavbar ? <aside className={classnames(styles.sider, {[styles.light]: !darkTheme})}>
                    {siderProps.menu.length === 0 ? null : <Sider {...siderProps} />}
                </aside> : ''}
                <div className={styles.main}>
                    <Header {...headerProps} />
                    {isNoBread ? "" : <Bread {...breadProps} />}
                    <div className={classnames(styles.container, { [styles.container_home]: isHome })}>
                        <div className={isHome ? '' : styles.content}>
                            {hasPermission ? children : <Error/>}
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
        </div>
    )
}

App.propTypes = {
    children: PropTypes.any.isRequired,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    state: PropTypes.object,
    loading: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

export default connect(({app}) => ({state: app}), mapDispatchToProps)(App)