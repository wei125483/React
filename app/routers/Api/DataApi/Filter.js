import React from 'react'
import PropTypes from 'prop-types'
import {Form, Popconfirm, Row, Col, Button, Select, Input, Icon} from 'antd'

const ColProps = {
    style: {
        marginBottom: 16,
        display: 'inline-block',
        width: 200,
    }
}
const Filter = ({onAdd, onDelete, onFilterChange, filter, appops, selectedRowKeys, form: {getFieldDecorator, getFieldsValue,setFieldsValue},}) => {
    const {name} = filter

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
                    <Input placeholder="数据接口名称" onPressEnter={handleSubmit}/>
                )}
            </Col>
            <Col style={{...ColProps.style, width: 'auto'}}>
                <Button type="primary" onClick={handleSubmit}>搜索</Button>
                <Button style={{marginLeft: '16px'}} onClick={handleReset}>重置搜索</Button>
            </Col>
            <Col style={{...ColProps.style, width: '270px', float: 'right', textAlign: 'right'}}>
                {
                    appops.data_api_del.is && <span>
                        {`已选择 ${selectedRowKeys.length} 条 `}
                        <Popconfirm title={'接口删除后，会导致正在使用该接口的用户无法从接口获取相关数据，你确定要删除选择的接口吗？'} placement="left" onConfirm={() => {
                            onDelete()
                        }}>
                            <Button type="ghost" disabled={selectedRowKeys.length ? false : true}>删除</Button>
                        </Popconfirm>
                    </span>
                }
                {
                    appops.data_api_add.is && <Button type="ghost" onClick={onAdd} style={{marginLeft: 16}}>新增</Button>
                }
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