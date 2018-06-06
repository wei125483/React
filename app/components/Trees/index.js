import React from 'react'
import PropTypes from 'prop-types'
import { Tree } from 'antd'
const TreeNode = Tree.TreeNode

const defaultTreeProps = {
    autoExpandParent: true,
    defaultExpandAll: true,
}

const Trees = ({
    treeData,
    ...props
}) => {
    const treesProps = {...defaultTreeProps, ...props}
    const renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.name} key={item.id} dataRef={item}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode title={item.name} key={item.id} dataRef={item} />;
        })
    }

    return (
        <Tree {...treesProps}>
            {renderTreeNodes(treeData)}
        </Tree>
    )
}

Trees.propTypes = {
    treeData: PropTypes.array,
}

export default Trees