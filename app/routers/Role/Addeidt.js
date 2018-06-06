import React from 'react'
import PropTypes from 'prop-types'
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
                if (!Array.isArray(values.permissionIds)) {
                    values.permissionIds = []
                }
                values.permissionIds = JSON.stringify(values.permissionIds)
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
                <FormItem label="角色名称" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('name', {
                        initialValue: item.name || '',
                        rules: [
                            {
                                required: true,
                                message: '请输入角色名称！',
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="32" />)}
                </FormItem>
                <FormItem label="角色权限" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('permissionIds', {
                        initialValue: item.permissionIds ? JSON.parse(item.permissionIds) : undefined,
                        rules: [
                            {
                                required: true,
                                message: '请选择角色权限！',
                            },
                        ],
                    })(<TreeSelects treeData={treeData} multiple/>)}
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
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
    maskClosable: PropTypes.bool,
    title: PropTypes.string,
    wrapClassName: PropTypes.string,
}

export default Form.create()(Addeidt)