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
    typeList = [],
    selectedRowKeys,
    form: {
    getFieldDecorator,
        getFieldsValue,
        setFieldsValue,
    },
}) => {

    const { name, type } = filter

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
        <Row gutter={24}>
            <Col {...ColProps}>
                {getFieldDecorator('dbName', { initialValue: name })(
                    <Input autoComplete="off" onPressEnter={handleSubmit} placeholder="数据源名称" />
                )}
            </Col>
            <Col {...ColProps}>
                {getFieldDecorator('typeId', {initialValue: type})(
                    <Select placeholder="数据源类型" style={{ width: '100%' }}>
                        <Option key="0" value="">所有类型</Option>
                        {
                            typeList.map((el) => {
                                return <Option key={el.id} value={el.id}>{el.type}</Option>
                            })
                        }
                    </Select>
                )}
            </Col>
            <Col style={{ ...ColProps.style, width: 'auto' }}>
                <Button type="primary" onClick={handleSubmit}>搜索</Button>
                <Button style={{marginLeft: '16px'}} onClick={handleReset}>重置搜索</Button>
            </Col>
            {(appops.source_list_add.is || appops.source_list_del.is) && <Col style={{ ...ColProps.style, width: '270px', float: 'right', textAlign: 'right' }}>
                { appops.source_list_del.is && <span>{`已选择 ${selectedRowKeys.length} 条 `}</span> }
                { appops.source_list_del.is && <Popconfirm title={'你确定要删除选择的数据源吗？'} placement="left" onConfirm={() => { onDelete() }}>
                    <Button type="ghost" disabled={selectedRowKeys.length ? false : true}>删除</Button>
                </Popconfirm> }
                { appops.source_list_add.is && <Button type="ghost" onClick={onAdd} style={{ marginLeft: 16 }}>新增</Button> }
            </Col> }
        </Row>
    )
}

Filter.propTypes = {
    appops: PropTypes.object,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    form: PropTypes.object,
    filter: PropTypes.object,
    typeList: PropTypes.array,
    selectedRowKeys: PropTypes.array,
    onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)