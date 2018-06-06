import React from 'react'
import PropTypes from 'prop-types'
import {Button} from 'antd'
import {List} from 'components'

import styles from './index.less'

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        width: '20%',
        key: 'name'
    }, {
        title: '类型',
        dataIndex: 'type',
        width: '10%',
        key: 'type'
    }, {
        title: '是否必须',
        dataIndex: 'bool',
        width: '10%',
        key: 'bool'
    }, {
        title: '描述',
        dataIndex: 'desc',
        key: 'desc'
    }
]

const listProps = {
    list: [{
        name: 'Action',
        type: 'String',
        bool: '是',
        desc: '系统规定参数，取值：StartInstance'
    },{
        name: 'InstanceId',
        type: 'String',
        bool: '是',
        desc: '指定启动的实例 ID'
    },{
        name: 'InitLocalDisk',
        type: 'Boolean',
        bool: '否',
        desc: 'true：将实例恢复到最初的健康状态。实例原有本地磁盘中的数据将会丢失。false：不做任何处理，维持现状。'
    }], 
    columns, 
    size: "small",
    scroll: { x: 600 },
    bordered: true,
}

const Detail = ({
    item = {}, 
    onOk, 
}) => {
    return (
        <div className={styles.box} style={{maxWidth: '800px', overflow: 'hidden'}}>
            <h2>get/user</h2>
            <div className={styles.item}>
                <h3>描述：</h3>
                <p>用于查询实例自定义数据，返回的自定义数据将以 Base64 的方式显示。<br/>如果实例不存在自定义数据，则返回空。</p>
            </div>
            <div className={styles.item}>
                <h3>调用地址：</h3>
                <code>https://api.frontsurf.com/get/user/?Action=StartInstance</code>
            </div>
            <div className={styles.item}>
                <h3>请求方式：</h3>
                <code>GET</code>
            </div>
            <div className={styles.item}>
                <h3>返回类型：</h3>
                <code>JSON</code>
            </div>
            <div className={styles.item}>
                <h3>请求参数：</h3>
                <List {...listProps } />
            </div>
            <div className={styles.item}>
                <h3>请求示例：</h3>
                <pre>
                https://api.frontsurf.com/get/user?Action=StartInstance&InstanceId=i-instance1&公共请求参数
                </pre>
            </div>
            <div className={styles.item}>
                <h3>返回成功示例：</h3>
                <pre>
{`{  
    data: { 
        id: 1,
        name: "admin"
    },
    code: 200,
    message: "请求成功"
}`}
                </pre>
            </div>
            <div className={styles.item}>
                <h3>返回失败示例：</h3>
                <pre>
{`{  
    data: null,
    code: 201,
    message: "请求失败"
}`}
                </pre>
            </div>
            <Button style={{float: 'right'}} onClick={onOk} type="ghost">返回</Button>
        </div>
    )
}

Detail.propTypes = {
    item: PropTypes.object,
    onOk: PropTypes.func,
}

export default Detail