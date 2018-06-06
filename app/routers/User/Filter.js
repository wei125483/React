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
    appops,
    onAdd,
    onDelete,
    onFilterChange,
    filter,
    selectedRowKeys,
    form: {
    getFieldDecorator,
        getFieldsValue,
        setFieldsValue,
    },
}) => {

    const { name, startTime, endTime } = filter

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
                {getFieldDecorator('name', { initialValue: name })(
                    <Input autoComplete="off" onPressEnter={handleSubmit} placeholder="用户名" />
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
            {(appops.user_add.is || appops.user_del.is) && <Col style={{ ...ColProps.style, width: '270px', float: 'right', textAlign: 'right' }}>
                { appops.user_del.is && <span>{`已选择 ${selectedRowKeys.length} 条 `}</span> }
                { appops.user_del.is && <Popconfirm title={'你确定要删除选择的用户吗？'} placement="left" onConfirm={() => { onDelete() }}>
                    <Button type="ghost" disabled={selectedRowKeys.length ? false : true}>删除</Button>
                </Popconfirm> }
                { appops.user_add.is && <Button type="ghost" onClick={onAdd} style={{ marginLeft: 16 }}>新增</Button> }
            </Col>}
        </Row>
    )
}

Filter.propTypes = {
    appops: PropTypes.object,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    form: PropTypes.object,
    filter: PropTypes.object,
    selectedRowKeys: PropTypes.array,
    onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)