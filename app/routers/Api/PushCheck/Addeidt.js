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

const Addeidt = ({item = {}, onOk, form: {getFieldDecorator, validateFieldsAndScroll,}, ...modalProps}) => {
    const handleOk = () => {
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (!modalProps.type) {
                    values.id = item.id
                }
                onOk(values)
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
                <FormItem label="数据源类型" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('name', {
                        initialValue: item.name,
                        rules: [
                            {
                                required: true,
                                message: '数据源类型不能为空'
                            },
                        ],
                    })(<Input/>)}
                </FormItem>
                <FormItem label="驱动类" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('type', {
                        initialValue: item.type,
                        rules: [
                            {
                                required: true,
                                message: '驱动类不能为空'
                            },
                        ],
                    })(<Input/>)}
                </FormItem>
            </Form>
        </Modal>
    )
}

Addeidt.propTypes = {
    form: PropTypes.object.isRequired,
    type: PropTypes.string,
    item: PropTypes.object,
    onOk: PropTypes.func,
}

export default Form.create()(Addeidt)