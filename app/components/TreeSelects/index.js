import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TreeSelect } from 'antd'
const SHOW_ALL = TreeSelect.SHOW_ALL
const TreeNode = TreeSelect.TreeNode

const defaultProps = {
    autoExpandParent: true,
    defaultExpandAll: true,
    allowClear: false,
    dropdownStyle: { maxHeight: 400, overflow: 'auto' }
}

const defaultMultipleProps = {
    autoExpandParent: true,
    defaultExpandAll: true,
    treeCheckable: true,
    showCheckedStrategy: SHOW_ALL,
    dropdownStyle: { maxHeight: 400, overflow: 'auto' }
}
// const defaultMultipleProps = {
//     defaultExpandAll: true,
//     showSearch: true,
//     dropdownStyle: { maxHeight: 400, overflow: 'auto' },
//     allowClear: false,
//     multiple: true,
//     treeDefaultExpandAll: true
// }

class TreeSelects extends Component {
    render() {
        const { treeData, ...props } = this.props
        let treesProps = null
        if (props.multiple) {
            treesProps = {...defaultMultipleProps, ...props}
        } else {
            treesProps = {...defaultProps, ...props}
        }
        const renderTreeNodes = (data) => {
            return data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode value={item.id} title={item.name} key={item.id}>
                            {renderTreeNodes(item.children)}
                        </TreeNode>
                    )
                }
                return <TreeNode value={item.id} title={item.name} key={item.id}/>;
            })
        }
        
        return (
          <TreeSelect {...treesProps} >
            {renderTreeNodes(treeData)}
          </TreeSelect>
        )
    }
}

TreeSelects.propTypes = {
    treeData: PropTypes.array,
}

export default TreeSelects