import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reg } from 'config'
import { Form, Input, Select, Button, Modal, Row, Col } from 'antd'

const { Option } = Select
const FormItem = Form.Item

const formItemLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 14,
    },
}

const DRIVER_NAME = 'org.apache.phoenix.jdbc.PhoenixDriver'

class Addeidt extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isPhoenix: false,
            isHBASE: false
        }
    }

    componentWillMount() {
        try {
            if (this.props.item.dbType.driverName === DRIVER_NAME) {
                this.setState({
                    isPhoenix: true
                })
            } else if (this.props.item.dbType.driverName === "HBASE") {
                this.setState({
                    isHBASE: true
                })
            }
        } catch (error) {

        }
    }

    render() {
        const {
            item = {},
            typeList = [],
            manageList = [],
            onOk,
            isAdd,
            onTest,
            form: {
                getFieldDecorator,
                validateFieldsAndScroll,
            },
            ...modalProps
        } = this.props

        let isPhoenix = this.state.isPhoenix
        const isHBASE = this.state.isHBASE

        const handleOk = () => {
            validateFieldsAndScroll((err, values) => {
                if (!err) {
                    values.port = values.port || 0
                    if (isAdd) {
                        onOk(values)
                    } else {
                        values.id = item.id
                        onOk(values)
                    }
                }

            })
        }

        const handleTest = () => {
            validateFieldsAndScroll((err, values) => {
                if (!err) {
                    values.port = values.port || 0
                    if (isAdd) {
                        onTest(values)
                    } else {
                        values.id = item.id
                        onTest(values)
                    }
                }

            })
        }

        const onSelect = (value) => {
            const curItem = typeList.find(function (el) {
                return el.id == value
            })
            if (curItem && curItem.driverName === DRIVER_NAME) {
                this.setState({
                    isHBASE: false,
                    isPhoenix: true
                })
            } else if (curItem && curItem.driverName === "HBASE") {
                this.setState({
                    isPhoenix: false,
                    isHBASE: true
                })
            } else {
                this.setState({
                    isPhoenix: false,
                    isHBASE: false
                })
            }
        }

        const modalOpts = {
            ...modalProps,
            onOk: handleOk,
        }

        return (
            <Modal {...modalOpts}>
                <Form layout="horizontal">
                    <FormItem label="名称" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('dbName', {
                            initialValue: item.dbName || '',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入名称！',
                                },
                            ],
                        })(<Input autoComplete="off" maxLength="128" />)}
                    </FormItem>
                    <FormItem label="类型" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('typeId', {
                            initialValue: item.dbType ? item.dbType.id : '',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择类型！'
                                },
                            ],
                        })(<Select onSelect={onSelect} style={{ width: '100%' }}>
                            {
                                typeList.map((el) => {
                                    return <Option key={el.id} value={el.id}>{el.type}</Option>
                                })
                            }
                        </Select>)}
                    </FormItem>
                    <FormItem label="接口组" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('serviceSystemId', {
                            initialValue: item.serviceSystemId || '',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择接口组！'
                                },
                            ],
                        })(<Select style={{ width: '100%' }}>
                            {
                                manageList.map((el) => {
                                    return <Option key={el.id} value={el.id}>{el.name}</Option>
                                })
                            }
                        </Select>)}
                    </FormItem>
                    {
                        isPhoenix || isHBASE ? <FormItem label="连接串" hasFeedback {...formItemLayout}>
                            {getFieldDecorator(isHBASE ? 'zookeeperUrl' : "host", {
                                initialValue: isHBASE ? (item.zookeeperUrl || '') : (item.host || ''),
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入连接串！'
                                    },
                                ],
                            })(<Input autoComplete="off" maxLength="64" />)}
                        </FormItem> : <FormItem label="IP" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('host', {
                                    initialValue: item.host || '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入IP地址！'
                                        },
                                        {
                                            pattern: reg.host,
                                            message: '请输入有效的IP地址！'
                                        },
                                    ],
                                })(<Input autoComplete="off" maxLength="64" />)}
                            </FormItem>
                    }
                    {
                        (isPhoenix || isHBASE) ? null : <FormItem label="端口" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('port', {
                                initialValue: item.port || '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入端口！'
                                    },
                                    {
                                        pattern: reg.port,
                                        message: '请输入有效的端口！'
                                    },
                                ],
                            })(<Input autoComplete="off" maxLength="32" />)}
                        </FormItem>
                    }
                    {
                        isHBASE ? <FormItem label="文件路径" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('rootDir', {
                                initialValue: item.rootDir || '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入文件路径！'
                                    },
                                ],
                            })(<Input autoComplete="off" maxLength="128" />)}
                        </FormItem> :
                            <span>
                                <FormItem label="数据库名" hasFeedback {...formItemLayout}>
                                    {getFieldDecorator('instance', {
                                        initialValue: item.instance || '',
                                        rules: [
                                            {
                                                required: isPhoenix ? false : true,
                                                message: '请输入数据库名！'
                                            },
                                        ],
                                    })(<Input autoComplete="off" maxLength="128" />)}
                                </FormItem>
                                <FormItem label="数据库用户名" hasFeedback {...formItemLayout}>
                                    {getFieldDecorator('username', {
                                        initialValue: item.username || '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入数据库用户名！'
                                            },
                                        ],
                                    })(<Input autoComplete="off" maxLength="128" />)}
                                </FormItem>
                                <FormItem label="数据库密码" hasFeedback {...formItemLayout}>
                                    {getFieldDecorator('password', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: !isAdd ? false : isPhoenix ? false : true,
                                                message: '请输入数据库密码！'
                                            },
                                        ],
                                    })(<Input type="password" autoComplete="new-password" maxLength="32" />)}
                                </FormItem>
                            </span>
                    }
                    {isPhoenix && <FormItem label="是否开启分库" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('isNamespaceMappingEnabled', {
                            initialValue: item.isNamespaceMappingEnabled || 'false',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择分库！'
                                },
                            ],
                        })(<Select style={{ width: '100%' }}>
                            <Option key={0} value={'true'}>{'是'}</Option>
                            <Option key={1} value={'false'}>{'否'}</Option>
                        </Select>)}
                    </FormItem>
                    }
                    <Row>
                        <Col span={10} />
                        <Col span={14} style={{ textAlign: 'right' }}><Button onClick={handleTest}>测 试</Button></Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}

Addeidt.propTypes = {
    form: PropTypes.object.isRequired,
    isAdd: PropTypes.bool,
    manageList: PropTypes.array,
    typeList: PropTypes.array,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onTest: PropTypes.func,
}

export default Form.create()(Addeidt)