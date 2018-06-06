import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from 'reducers/login'

import { Row, Form, Icon, Input, Button, Checkbox } from 'antd';
import styles from './index.less'
import config from 'config'

const FormItem = Form.Item

const logoImg = require('assets/images/sider-logo-l.png')

const Login = ({
    state,
    actions,
    form: {
        getFieldDecorator,
        validateFieldsAndScroll,
    }
}) => {

    const { loading } = state
    
    function handleSubmit () {
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                actions.login(values)
            }
        })
    }

    return (
        <div className={styles.form}>
            <div className={styles.logo}>
                <img alt={'logo'} src={logoImg} />
            </div>
            <form>
                <Form.Item hasFeedback>
                    {getFieldDecorator('username', {
                        rules: [
                            {
                                required: true,
                                message: '用户名不能为空！',
                            },
                        ],
                    })(<Input onPressEnter={handleSubmit} placeholder="用户名" />)}
                </Form.Item>
                <Form.Item hasFeedback style={{ marginBottom: '14px' }}>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: '密码不能为空！',
                            },
                        ],
                    })(<Input type="password" onPressEnter={handleSubmit} placeholder="密码" />)}
                </Form.Item>
                <FormItem style={{ marginBottom: '4px' }}>
                    {/* {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                    })(
                    <Checkbox style={{ verticalAlign: 'middle' }}> 记住我</Checkbox>
                    )}
                    <a style={{ float: 'right' }}>忘记密码</a> */}
                    <Button type="primary" onClick={handleSubmit} loading={loading}>登录</Button>
                </FormItem>
                {/*<a style={{ float: 'right' }}>注册帐户</a>*/}
            </form>
        </div>
    )
}

Login.propTypes = {
    form: PropTypes.object,
    login: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

export default connect(({ login }) => ({ state: login }), mapDispatchToProps)(Form.create()(Login))