import React from 'react'
import PropTypes from 'prop-types'
import { reg } from 'config'
import { Form, Input, Modal, TreeSelect } from 'antd'
import { TreeSelects } from 'components'
const { TextArea } = Input
const FormItem = Form.Item

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
    allpermission = [],
    isAdd,
    onOk,
    form: {
        getFieldDecorator,
        validateFieldsAndScroll,
    },
    ...modalProps
}) => {

    const handleOk = () => {
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.parentId = values.parentId ? values.parentId : ''
                if (!Array.isArray(values.permissionIds)) {
                    values.permissionIds = []
                }
                values.permissionIds = JSON.stringify(values.permissionIds)
                if (isAdd) {
                    onOk(values)
                } else {
                    values.id = item.id
                    if (values.parentId == values.id) {
                        Modal.warning({
                            title: '系统提示',
                            content: '上级机构不能为所属机构',
                        })
                        return
                    }
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
                <FormItem label="上级机构" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('parentId', {
                        initialValue: item.parentId || '',
                        rules: [
                            {
                                required: false,
                                message: '请选择上级机构！',
                            },
                        ],
                    })(<TreeSelects treeData={treeData}/>)}
                </FormItem>
                <FormItem label="机构权限" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('permissionIds', {
                        initialValue: item.permissionIds ? JSON.parse(item.permissionIds) : undefined,
                        rules: [
                            {
                                required: true,
                                message: '请选择机构权限！',
                            },
                        ],
                    })(<TreeSelects treeData={allpermission} multiple />)}
                </FormItem>
                <FormItem label="机构名称" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('name', {
                        initialValue: item.name || '',
                        rules: [
                            {
                                required: true,
                                message: '请输入机构名称！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="32" />)}
                </FormItem>
                <FormItem label="机构编码" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('code', {
                        initialValue: item.code || '',
                        rules: [
                            {
                                required: true,
                                message: '请输入机构编码！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="32" />)}
                </FormItem>
                <FormItem label="联系地址" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('address', {
                        initialValue: item.address || '',
                        rules: [
                            {
                                required: false,
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="256" />)}
                </FormItem>
                <FormItem label="联系人" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('master', {
                        initialValue: item.master || '',
                        rules: [
                            {
                                required: false,
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="50" />)}
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
                    })(<Input autoComplete="off" maxLength="256" />)}
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
                    })(<Input autoComplete="off" maxLength="256" />)}
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
                    })(<Input autoComplete="off" maxLength="256" />)}
                </FormItem>
                <FormItem label="备注" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('remarks', {
                        initialValue: item.remarks || '',
                        rules: [
                            {
                                required: false,
                            },
                        ],
                    })(<TextArea autoComplete="off" autosize={{ minRows: 2, maxRows: 6 }} />)}
                </FormItem>
            </Form>
        </Modal>
    )
}

Addeidt.propTypes = {
    form: PropTypes.object.isRequired,
    isAdd: PropTypes.bool,
    treeData: PropTypes.array,
    allpermission: PropTypes.array,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
    maskClosable: PropTypes.bool,
    title: PropTypes.string,
    wrapClassName: PropTypes.string,
}

export default Form.create()(Addeidt)