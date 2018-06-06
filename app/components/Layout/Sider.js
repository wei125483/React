import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch } from 'antd'
import { Link } from 'react-router-dom'
import { config } from 'utils'
import styles from './Layout.less'
import Menus from './Menu'
const logoImgD = require('assets/images/sider-logo.png')
const logoImgL = require('assets/images/sider-logo-l.png')

const Sider = ({ siderFold, darkTheme, location, changeTheme, navOpenKeys, changeOpenKeys, menu }) => {
	const menusProps = {
		menu,
		siderFold,
		darkTheme,
		location,
		navOpenKeys,
		changeOpenKeys,
	}
	return (
		<div>
			<div className={styles.logo}>
				<Link to={''}><img alt={'logo'} src={darkTheme ? logoImgD : logoImgL} /></Link>
			</div>
			<Menus {...menusProps} />
			{!siderFold ? <div className={styles.switchtheme}>
				<span><Icon type="bulb" />切换主题</span>
				<Switch onChange={changeTheme} defaultChecked={darkTheme} checkedChildren="D" unCheckedChildren="L" />
			</div> : ''}
		</div>
	)
}

Sider.propTypes = {
	menu: PropTypes.array,
	siderFold: PropTypes.bool,
	darkTheme: PropTypes.bool,
	location: PropTypes.object,
	changeTheme: PropTypes.func,
	navOpenKeys: PropTypes.array,
	changeOpenKeys: PropTypes.func,
}

export default Sider
