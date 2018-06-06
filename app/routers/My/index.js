import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from 'reducers/app'
import {history} from 'utils'

import {DropOption, DataTree} from 'components'
import {Modal, Row, Col, Button} from 'antd'
import Edit from './Edit'
import styles from './index.less'

const rowStyle = {
    style: {
        marginBottom: '20px'
    }
}

const titleStyle = {
    style: {
        float: 'left',
        width: '100px',
        textAlign: 'right',
        fontSize: '16px'
    }
}

const contentStyle = {
    style: {
        marginLeft: '100px',
        color: '#001529',
        fontSize: '16px'
    }
}

class My extends Component {

    constructor(props) {
        super(props)
        this.state = {modalShow: false}
    }

    render() {
        const {requestSaveUser} = this.props.actions
        const {app} = this.props
        const {user} = app
        const {roleIds, roles} = user
        const self = this

        let roleArray = []
        let roleNames = []
        let roleName = ''
        if (roleIds) {
            try {
                roleArray = JSON.parse(roleIds)
            } catch (error) {
                roleArray = []
            }
        }

        if (roleArray.length && roles.length) {
            for (let i = 0, l = roles.length; i < l; i++) {
                let item = roles[i]
                for (let j = 0, k = roleArray.length; j < k; j++) {
                    if (roleArray[j] == item.id) {
                        roleNames.push(item.name)
                    }
                }
            }
        }
        if (roleNames.length) {
            roleName = roleNames.join('， ')
        }

        const onToEdit = () => {
            this.setState({
                modalShow: true
            })
        }

        const onOk = () => {
            if (app.prevLocationPathname != '' && app.prevLocationPathname != '/login') {
                history.goBack()
            } else {
                history.push({
                    pathname: '/'
                })
            }
        }
        const that = this;
        const addeidtProps = {
            item: user,
            visible: this.state.modalShow,
            maskClosable: false,
            title: '修改个人信息',
            wrapClassName: 'vertical-center-modal',
            isPassword: this.state.isPassword || false,
            onOk(params = {}) {
                params.id = user.id
                requestSaveUser(params)
            },
            updataState(options) {
                that.setState(options)
            },
            onCancel() {
                self.setState({
                    modalShow: false
                })
            },
        }

        return (
            <div className={styles.box}>
                <Row {...rowStyle}>
                    <Col {...titleStyle}>用户名：</Col>
                    <Col {...contentStyle}>{user.username}</Col>
                </Row>
                <Row {...rowStyle}>
                    <Col {...titleStyle}>所属机构：</Col>
                    <Col {...contentStyle}>{user.officeName}</Col>
                </Row>
                <Row {...rowStyle}>
                    <Col {...titleStyle}>用户角色：</Col>
                    <Col {...contentStyle}>{roleName}</Col>
                </Row>
                <Row {...rowStyle}>
                    <Col {...titleStyle}>姓名：</Col>
                    <Col {...contentStyle}>{user.name}</Col>
                </Row>
                <Row {...rowStyle}>
                    <Col {...titleStyle}>电话：</Col>
                    <Col {...contentStyle}>{user.phone}</Col>
                </Row>
                <Row {...rowStyle}>
                    <Col {...titleStyle}>手机：</Col>
                    <Col {...contentStyle}>{user.mobile}</Col>
                </Row>
                <Row {...rowStyle}>
                    <Col {...titleStyle}>邮箱：</Col>
                    <Col {...contentStyle}>{user.email}</Col>
                </Row>
                <Row {...rowStyle}>
                    <Col {...titleStyle}>备注：</Col>
                    <Col {...contentStyle}>{user.remarks}</Col>
                </Row>
                <Row className={styles.btn_box}>
                    <Button style={{float: 'right', marginLeft: '8px'}} onClick={onOk}>返回</Button>
                    <Button style={{float: 'right'}} onClick={onToEdit} type="primary">修改</Button>
                </Row>
                {this.state.modalShow && <Edit {...addeidtProps} />}
            </div>
        )
    }
}

My.propTypes = {
    app: PropTypes.object,
    actions: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

const mapStateToProps = state => ({
    app: state.app,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(My)