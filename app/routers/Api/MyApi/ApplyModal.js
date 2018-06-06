import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Select, DatePicker, Modal} from 'antd'

const {TextArea} = Input
const FormItem = Form.Item

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
                values.applyId = item.id;
                values.startDate = item.startUseDate;
                values.endDate = new Date(values.endDate).format("yyyy-MM-dd 23:59:59");
                values.serverId = item.serverInfo.id;
                values.type = 2;
                onOk(values)
            }
        })
    }
    const disabledEndDate = (endValue) => {
        return endValue <= new Date(item.endUseDate)
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
                        initialValue: item.serverName,
                    })(<Input type="text" disabled value={item.serverName}/>)}
                </FormItem>
                <FormItem label="申请人" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('applyUsername', {
                        initialValue: item.applyUsername,
                        rules: [
                            {
                                required: true,
                                message: '请输入申请人！'
                            },
                        ],
                    })(<Input type="text" disabled value={item.applyUsername}/>)}
                </FormItem>
                <FormItem label="结束时间" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('endDate', {
                        rules: [
                            {
                                required: true,
                                message: '请选择申请结束时间！'
                            },
                        ],
                    })(<DatePicker disabledDate={disabledEndDate}/>)}
                </FormItem>
                <FormItem label="备注" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('applyReason', {
                        rules: [{
                            required: true,
                            message: '请输入备注！'
                        }]
                    })(<TextArea autosize={{minRows: 4, maxRows: 6}} maxLength={255}/>)}
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