
import React, { Component } from "react"
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'


export default function asyncComponent(importComponent) {
	class AsyncComponent extends Component {
		constructor(props) {
			super(props)

			this.state = {
				component: null
			}
		}

		async componentDidMount() {
			const { default: component } = await importComponent()

			this.setState({
				component: component
			})
		}

		render() {
			const C = this.state.component;

			return C ? <LocaleProvider locale={zhCN}><C {...this.props} /></LocaleProvider> : null
		}
	}

	return AsyncComponent
}