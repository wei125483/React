import React from 'react'
import PropTypes from 'prop-types'
import {Form, Popconfirm, Row, Col, Button, Select, Input} from 'antd'

import styles from "./index.less"

const {Option} = Select

const ColProps = {
    style: {
        marginBottom: 16,
        display: 'inline-block',
        width: 200,
    }
}
const Filter = ({onAdd, onDelete, onFilterChange, filter, appops, selectedRowKeys, form: {getFieldDecorator, getFieldsValue, setFieldsValue},}) => {
    const {name, type} = filter

    //搜索查询
    const handleSubmit = (type, status) => {
        let fields = getFieldsValue()
        onFilterChange(fields, type, status)
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
        onFilterChange(getFieldsValue())
    }

    /*同意*/
    const handleReset1 = () => {
        handleSubmit(1, "0");
    }

    /*驳回*/
    const handleReset2 = () => {
        handleSubmit(1, "1");
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
                {
                    selectedRowKeys.length > 0 ? <div style={{display: "inline-block"}}>
                        {
                            appops.push_api_approval.is &&
                            <span>
                                <Button style={{marginLeft: '16px'}} className={styles.successBtn}
                                        onClick={handleReset1}>同意</Button>
                                <Button style={{marginLeft: '16px'}} className={styles.warningBtn}
                                        onClick={handleReset2}>驳回</Button>
                            </span>
                        }
                    </div> : ""
                }

            </Col>
            {/*<Col style={{...ColProps.style, width: '270px', float: 'right', textAlign: 'right'}}>*/}
            {/*{`已选择 ${selectedRowKeys.length} 条 `}*/}
            {/*<Popconfirm title={'你确定要删除选择的接口发布审批吗？'} placement="left" onConfirm={() => {*/}
            {/*onDelete()*/}
            {/*}}>*/}
            {/*<Button type="ghost" disabled={selectedRowKeys.length ? false : true}>删除</Button>*/}
            {/*</Popconfirm>*/}
            {/*</Col>*/}
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