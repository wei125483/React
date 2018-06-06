import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Modal, TreeSelect, Select} from 'antd'
import {reg} from 'config'
import {TreeSelects} from 'components'

const SHOW_ALL = TreeSelect.SHOW_ALL

const FormItem = Form.Item
const Option = Select.Option
const {TextArea} = Input

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
}

const Addeidt = ({
                     item = {},
                     treeData = [],
                     rolesData = [],
                     isAdd,
                     onOk,
                     isPassword = false,
                     updateState,
                     form: {
                         getFieldDecorator,
                         validateFieldsAndScroll,
                         getFieldsValue,
                         getFieldValue,
                     },
                     ...modalProps
                 }) => {

    const handleOk = () => {
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.officeId = values.officeId ? values.officeId : ''
                if (!Array.isArray(values.roleIds)) {
                    values.roleIds = []
                }
                values.roleIds = JSON.stringify(values.roleIds)
                if (isAdd) {
                    onOk(values)
                } else {
                    values.id = item.id
                    onOk(values)
                }
            }
        })
    }

    const modalOpts = {
        ...modalProps,
        onOk: handleOk,
    }

    const checkPassword = (rule, value, callback) => {
        if (value && value !== getFieldValue('password')) {
            callback('两个密码输入不一致！');
        } else {
            callback();
        }
    }
    const passwordChange = (e) => {
        if (e.target.value) {
            updateState({
                isPassword: true
            })
        } else {
            updateState({
                isPassword: false
            })
        }
    }
    return (
        <Modal {...modalOpts}>
            <Form layout="horizontal">
                <FormItem label="用户名" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('username', {
                        initialValue: item.username,
                        rules: [
                            {
                                required: true,
                                message: '请输入用户名！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="64"/>)}
                </FormItem>
                <FormItem label="所属机构" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('officeId', {
                        initialValue: item.officeId || '',
                        rules: [
                            {
                                required: false,
                            },
                        ],
                    })(<TreeSelects treeData={treeData}/>)}
                </FormItem>
                {
                    !isAdd && <FormItem label="原密码" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('oldPassword', {
                            initialValue: '',
                            rules: [
                                {
                                    required: isPassword,
                                    message: '请输入你的原始密码'
                                },
                            ],
                        })(<Input autoComplete="off" type="password" maxLength="16"/>)}
                    </FormItem>
                }
                <FormItem label="密码" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('password', {
                        initialValue: '',
                        rules: [
                            {
                                required: isAdd,
                                pattern: /^.{6,}$/,
                                message: '请至少输入 6 个字符，请不要使用容易被猜到的密码！'
                            },
                        ],
                    })(<Input autoComplete="off" onChange={(e) => passwordChange(e)} type="password" maxLength="16"/>)}
                </FormItem>
                <FormItem label="确认密码" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('confirm', {
                        initialValue: '',
                        rules: [
                            {
                                required: isAdd || isPassword,
                                message: '请确认你的密码！',
                            },
                            {
                                validator: checkPassword,
                            }
                        ],
                    })(<Input autoComplete="off" type="password" maxLength="16"/>)}
                </FormItem>
                <FormItem label="用户角色" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('roleIds', {
                        initialValue: item.roleIds ? JSON.parse(item.roleIds) : undefined,
                        rules: [
                            {
                                required: true,
                                message: '请选择用户角色！',
                            },
                        ],
                    })(<TreeSelects treeData={rolesData} treeCheckable={true} showCheckedStrategy={SHOW_ALL}/>)}
                </FormItem>
                <FormItem label="姓名" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('name', {
                        initialValue: item.name || '',
                        rules: [
                            {
                                required: false,
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="64"/>)}
                </FormItem>
                <FormItem label="电话" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('phone', {
                        initialValue: item.phone || '',
                        rules: [
                            {
                                pattern: reg.phone,
                                required: false,
                                message: '请输入有效的电话号码！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="32"/>)}
                </FormItem>
                <FormItem label="手机" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('mobile', {
                        initialValue: item.mobile || '',
                        rules: [
                            {
                                pattern: reg.mobile,
                                message: '请输入有效的手机号码！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="32"/>)}
                </FormItem>
                <FormItem label="邮箱" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('email', {
                        initialValue: item.email || '',
                        rules: [
                            {
                                type: 'email',
                                required: false,
                                message: '请输入有效邮箱！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="256"/>)}
                </FormItem>
                <FormItem label="备注" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('remarks', {
                        initialValue: item.remarks || '',
                        rules: [
                            {
                                required: false,
                            },
                        ],
                    })(<TextArea autoComplete="off" autosize={{minRows: 2, maxRows: 6}}/>)}
                </FormItem>
            </Form>
        </Modal>
    )
}

Addeidt.propTypes = {
    form: PropTypes.object.isRequired,
    isAdd: PropTypes.bool,
    item: PropTypes.object,
    treeData: PropTypes.array,
    rolesData: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
    maskClosable: PropTypes.bool,
    title: PropTypes.string,
    wrapClassName: PropTypes.string,
}

export default Form.create()(Addeidt)