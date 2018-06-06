import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Select, DatePicker, Modal} from 'antd'

const {TextArea} = Input
const FormItem = Form.Item
const {RangePicker} = DatePicker

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
}

const ApplyModal = ({item = {}, onOk, form: {getFieldDecorator, validateFieldsAndScroll,}, ...modalProps}) => {
    const handleOk = () => {
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                onOk(values)
            }
        })
    }
    const dataSelect = {
        onChange(e) {
            console.log(e)
        }
    }

    const modalOpts = {
        ...modalProps,
        onOk: handleOk,
    }
    return (
        <Modal {...modalOpts} width={680}>
            <Form layout="horizontal">
                <FormItem label="接口名" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('serverId', {
                        initialValue: item.id,
                    })(<span><Input type="hidden"/>{item.name}</span>)}
                </FormItem>
                <FormItem label="申请人" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('applyUsername', {
                        initialValue: item.userName,
                        rules: [
                            {
                                required: true,
                                message: '请输入申请人！'
                            },
                        ],
                    })(<Input maxLength={32}/>)}
                </FormItem>
                <FormItem label="使用时间" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('time', {
                        rules: [
                            {
                                required: true,
                                message: '请选择使用时间！'
                            },
                        ],
                    })(<RangePicker/>)}
                </FormItem>
                <FormItem label="备注" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('applyReason', {
                        rules: [
                            {
                                required: true,
                                message: '请输入备注！'
                            },
                        ],
                    })(<TextArea autosize={{minRows: 4, maxRows: 6}} maxLength={255} />)}
                </FormItem>
            </Form>
        </Modal>
    )
}

ApplyModal.propTypes = {
    form: PropTypes.object.isRequired,
    type: PropTypes.string,
    item: PropTypes.object,
    onOk: PropTypes.func,
}

export default Form.create()(ApplyModal)