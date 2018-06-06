import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Table, Popconfirm, Modal, Row, Col, DatePicker, Button, Select, Input } from 'antd'
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

    const { username, interfaceName } = filter

    const handleSubmit = () => {
        let fields = getFieldsValue()
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

    return (
        <Row gutter={24} style={{padding: '24px 24px 0 24px'}}>
            <Col {...ColProps}>
                {getFieldDecorator('interfaceName', { initialValue: interfaceName })(
                    <Input autoComplete="off" onPressEnter={handleSubmit} placeholder="接口名称" />
                )}
            </Col>
            <Col {...ColProps}>
                {getFieldDecorator('username', { initialValue: username })(
                    <Input  autoComplete="off" onPressEnter={handleSubmit} placeholder="用户名称" />
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