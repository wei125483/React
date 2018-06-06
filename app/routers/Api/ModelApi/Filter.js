import React from 'react'
import PropTypes from 'prop-types'
import {Form, Popconfirm, Row, Col, Button, Select, Input} from 'antd'

const {Option} = Select

const ColProps = {
    style: {
        marginBottom: 16,
        display: 'inline-block',
        width: 200,
    }
}
const Filter = ({onAdd, onDelete, onFilterChange, filter, selectedRowKeys, form: {getFieldDecorator, getFieldsValue,},}) => {
    const {name, type} = filter

    //搜索查询
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
                {getFieldDecorator('name', {initialValue: name})(
                    <Input placeholder="模型接口名称"/>
                )}
            </Col>
            <Col style={{...ColProps.style, width: 'auto'}}>
                <Button type="primary" onClick={handleSubmit}>搜索</Button>
                <Button style={{marginLeft: '16px'}} onClick={handleReset}>重置搜索</Button>
            </Col>
            <Col style={{...ColProps.style, width: '270px', float: 'right', textAlign: 'right'}}>
                {`已选择 ${selectedRowKeys.length} 条 `}
                <Popconfirm title={'你确定要删除选择的模型接口吗？'} placement="left" onConfirm={() => {
                    onDelete()
                }}>
                    <Button type="ghost" disabled={selectedRowKeys.length ? false : true}>删除</Button>
                </Popconfirm>
                <Button type="ghost" onClick={onAdd} style={{marginLeft: 16}}>新增</Button>
            </Col>
        </Row>)

}
Filter.propTypes = {
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    form: PropTypes.object,
    filter: PropTypes.object,
    selectedRowKeys: PropTypes.array,
    onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)