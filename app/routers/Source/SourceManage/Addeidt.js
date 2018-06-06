import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, TreeSelect, Select } from 'antd'
import { reg } from 'config'
import { TreeSelects } from 'components'
const SHOW_ALL = TreeSelect.SHOW_ALL

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

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
    isAdd,
    onOk,
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
                values.affiliationOfficeId = values.affiliationOfficeId ? values.affiliationOfficeId : ''
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

    return (
        <Modal {...modalOpts}>
            <Form layout="horizontal">
                <FormItem label="接口组名称" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('name', {
                        initialValue: item.name || '',
                        rules: [
                            {
                                required: true,
                                message: '请输入接口组名称！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="64" />)}
                </FormItem>
                <FormItem label="所属机构" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('affiliationOfficeId', {
                        initialValue: item.affiliationOfficeId || '',
                        rules: [
                            {
                                required: true,
                                message: '请选择所属机构！',
                            },
                        ],
                    })(<TreeSelects treeData={treeData} />)}
                </FormItem>
                <FormItem label="接口组编码" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('code', {
                        initialValue: item.code || '',
                        rules: [
                            {
                                required: true,
                                message: '请输入接口组编码！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="64" />)}
                </FormItem>
                <FormItem label="负责人" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('supervisor', {
                        initialValue: item.supervisor || '',
                        rules: [
                            {
                                required: true,
                                message: '请输入负责人姓名！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="64" />)}
                </FormItem>
                <FormItem label="负责人电话" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('phone', {
                        initialValue: item.phone || '',
                        rules: [
                            {
                                pattern: reg.phone,
                                required: false,
                                message: '请输入有效的电话号码！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="32" />)}
                </FormItem>
                <FormItem label="负责人手机" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('mobile', {
                        initialValue: item.mobile || '',
                        rules: [
                            {
                                pattern: reg.mobile,
                                message: '请输入有效的手机号码！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="32" />)}
                </FormItem>
                <FormItem label="负责人邮箱" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('email', {
                        initialValue: item.email || '',
                        rules: [
                            {
                                type: 'email',
                                required: false,
                                message: '请输入有效邮箱！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="64" />)}
                </FormItem>
                <FormItem label="负责人地址" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('addres', {
                        initialValue: item.addres || '',
                        rules: [
                            {
                                required: false,
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="64" />)}
                </FormItem>
                <FormItem label="接口组描述" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('description', {
                        initialValue: item.description || '',
                        rules: [
                            {
                                required: false,
                            },
                        ],
                    })(<TextArea autoComplete="off" autosize={{ minRows: 2, maxRows: 6 }} maxLength="256"  />)}
                </FormItem>
                <FormItem label="备注" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('remarks', {
                        initialValue: item.remarks || '',
                        rules: [
                            {
                                required: false,
                            },
                        ],
                    })(<TextArea autoComplete="off" autosize={{ minRows: 2, maxRows: 6 }} maxLength="256"  />)}
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
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
    maskClosable: PropTypes.bool,
    title: PropTypes.string,
    wrapClassName: PropTypes.string,
}

export default Form.create()(Addeidt)