import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Menu, Icon, Popover } from 'antd'
import classnames from 'classnames'
import styles from './Header.less'
import Menus from './Menu'

const SubMenu = Menu.SubMenu

const Header = ({
  	user,
	logout,
	update,
	switchSider,
	siderFold,
	isNavbar,
	menuPopoverVisible,
	location,
	switchMenuPopover,
	navOpenKeys,
	changeOpenKeys,
	menu
}) => {
	let handleClickMenu = (e) => {
		if (e.key === 'logout') {
			logout()
		} else if (e.key === 'update') {
			update()
		}
	}
	const menusProps = {
		menu,
		siderFold: false,
		darkTheme: false,
		isNavbar,
		handleClickNavMenu: switchMenuPopover,
		location,
		navOpenKeys,
		changeOpenKeys,
	}
	return (
		<div className={styles.header}>
			{isNavbar
				? <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...menusProps} />}>
					<div className={styles.button}>
						<Icon type="bars" />
					</div>
				</Popover>
				: <div
					className={styles.button}
					onClick={switchSider}
				>
					<Icon type={classnames({ 'menu-unfold': siderFold, 'menu-fold': !siderFold })} />
				</div>}
			<div className={styles.rightWarpper}>
				<Menu mode="horizontal" onClick={handleClickMenu} selectedKeys={null}>
					<SubMenu
						title={<span>
							<Icon type="user" />
							{user.username}
						</span>}
					>
						<Menu.Item key="info"><Link to={'/my'}>个人中心</Link></Menu.Item>
						<Menu.Item key="logout"><a href="javascript:;">退出</a></Menu.Item>
					</SubMenu>
					<SubMenu
						title={<span>
							<Icon type="setting" />
						</span>}
					>
						<Menu.Item key="update"><a href="javascript:;">同步机构</a></Menu.Item>
					</SubMenu>
				</Menu>
			</div>
		</div>
	)
}

Header.propTypes = {
	menu: PropTypes.array,
	user: PropTypes.object,
	logout: PropTypes.func,
	switchSider: PropTypes.func,
	siderFold: PropTypes.bool,
	isNavbar: PropTypes.bool,
	menuPopoverVisible: PropTypes.bool,
	location: PropTypes.object,
	switchMenuPopover: PropTypes.func,
	navOpenKeys: PropTypes.array,
	changeOpenKeys: PropTypes.func,
}

export default Header