import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd';
import List from 'components/List'
import Trees from 'components/Trees'

const DataTree = ({
    listProps,
    treeProps,
}) => {
    return (
        <div className="tree-box">
            <div className="tree-content">
                <Spin spinning={listProps.loading} style={{minHeight: '100px'}}><Trees {...treeProps} /></Spin>
            </div>
            <div className="tree-table">
                <List size="small" bordered={false} {...listProps} />
            </div>
        </div>
    )
}

DataTree.propTypes = {
    listProps: PropTypes.object,
    TreeProps: PropTypes.object,
}

export default DataTree