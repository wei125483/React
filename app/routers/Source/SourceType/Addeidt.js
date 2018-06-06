import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Select, Modal} from 'antd'

const FormItem = Form.Item

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
}

const Addeidt = ({item = {}, onOk, isAdd, form: {getFieldDecorator, validateFieldsAndScroll,}, ...modalProps}) => {
    const handleOk = () => {
        validateFieldsAndScroll((err, values) => {
            if (!err) {
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
                <FormItem label="类型名称" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('type', {
                        initialValue: item.type || '',
                        rules: [
                            {
                                required: true,
                                message: '请输入类型名称！'
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="128"/>)}
                </FormItem>
                <FormItem label="驱动类" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('driverName', {
                        initialValue: item.driverName || '',
                        rules: [
                            {
                                required: true,
                                message: '请输入驱动类！'
                            },
                        ],
                    })(<Input autoComplete="off" maxLength="256"/>)}
                </FormItem>
            </Form>
        </Modal>
    )
}

Addeidt.propTypes = {
    form: PropTypes.object.isRequired,
    isAdd: PropTypes.bool,
    item: PropTypes.object,
    onOk: PropTypes.func,
}

export default Form.create()(Addeidt)