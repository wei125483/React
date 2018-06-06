import React from 'react'
import PropTypes from 'prop-types'
import {Table} from 'antd'

const defaultPagination = {
    size: 'middle',
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0,
    current: 1,
    pageSize: 10,
    onShowSizeChange() {},
    onChange() {},
}

const defaultRowSelection = {
    selectedRowKeys: [],
    onChange () {}
}

const List = ({
    loading, 
    list, 
    columns, 
    size = "middle",
    scroll= { x: 600 },
    bordered = false,
    rowKey = record => record.id,
    rowSelection = null, 
    pagination = false,
}) => {

    if (pagination instanceof Object) {
        if (!pagination.total || pagination.total <= 10) {
            pagination = false
        } else {
            pagination = { ...defaultPagination, ...pagination }
        }   
    }
    if (rowSelection instanceof Object) {
        if (!rowSelection.selectedRowKeys || !rowSelection.onChange) {
            rowSelection = false
        } else {
            rowSelection = { ...defaultRowSelection, ...rowSelection }
        }   
    }

    return (
        <Table columns={columns}
            size={size}
            scroll={scroll}
            rowKey={rowKey}
            bordered={bordered}
            loading={loading}
            dataSource={list}
            rowSelection={rowSelection}
            pagination={pagination}
        />
    )
}

List.propTypes = {
    size: PropTypes.string,
    bordered: PropTypes.bool,
    columns: PropTypes.array,
    list: PropTypes.array,
    loading: PropTypes.bool,
    rowKey: PropTypes.any,
    rowSelection: PropTypes.any,
    pagination: PropTypes.any,
}

export default List