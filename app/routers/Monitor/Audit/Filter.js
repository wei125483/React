import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form,  Row, Col, DatePicker, Button, Select, Input } from 'antd'
const { Option } = Select
const { RangePicker } = DatePicker

const ColProps = {
    style: {
        marginBottom: 16,
        display: 'inline-block',
        width: 200,
    }
}

const Filter = ({
    onFilterChange,
    filter,
    form: {
    getFieldDecorator,
        getFieldsValue,
        setFieldsValue,
    },
}) => {

    const { username, interfaceName, action, startTime, endTime } = filter

    const handleFields = (fields) => {
        const { createTime } = fields
        if (createTime.length) {
            fields.startTime = createTime[0].format('YYYY-MM-DD')
            fields.endTime = createTime[1].format('YYYY-MM-DD')
        } else {
            fields.startTime = ''
            fields.endTime = ''
        }
        delete fields.createTime
        return fields
    }

    const handleSubmit = () => {
        let fields = getFieldsValue()
        fields = handleFields(fields)
        onFilterChange(fields)
    }

    const handleReset = () => {
        const fields = getFieldsValue()
        for (let item in fields) {
            if ({}.hasOwnProperty.call(fields, item)) {
                if (fields[item] instanceof Array) {
                    fields[item] = []
                } else {
                    fields[item] = undefined
                }
            }
        }
        setFieldsValue(fields)
        handleSubmit()
    }

    let initialCreateTime = []
    if (startTime) {
        initialCreateTime[0] = moment(startTime)
    }
    if (endTime) {
        initialCreateTime[1] = moment(endTime)
    }

    return (
        <Row gutter={24}>
        <Col {...ColProps}>
                {getFieldDecorator('interfaceName', { initialValue: interfaceName })(
                    <Input  autoComplete="off" onPressEnter={handleSubmit} placeholder="接口名称" />
                )}
            </Col>
            <Col {...ColProps}>
                {getFieldDecorator('username', { initialValue: username })(
                    <Input  autoComplete="off" onPressEnter={handleSubmit} placeholder="用户名称" />
                )}
            </Col>
            <Col {...ColProps}>
                {getFieldDecorator('action', { initialValue: action })(
                    <Select placeholder="操作结果" style={{ width: '100%' }}>
                        <Option value="">所有操作结果</Option>
                        <Option value="0">成功</Option>
                        <Option value="1">失败</Option>
                    </Select>
                )}
            </Col>
            <Col style={{ ...ColProps.style, width: '300px' }}>
                {getFieldDecorator('createTime', { initialValue: initialCreateTime })(
                    <RangePicker/>
                )}
            </Col>
            <Col style={{ ...ColProps.style, width: 'auto' }}>
                <Button type="primary" onClick={handleSubmit}>搜索</Button>
                <Button style={{marginLeft: '16px'}} onClick={handleReset}>重置搜索</Button>
            </Col>

        </Row>
    )
}

Filter.propTypes = {
    form: PropTypes.object,
    filter: PropTypes.object,
    onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)