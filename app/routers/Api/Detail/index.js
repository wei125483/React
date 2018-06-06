import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactJson from 'react-json-view'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from 'reducers/api/apiDetail'
import {List} from 'components'
import {history} from 'utils'


import {Button} from 'antd'


import styles from '../MyApi/index.less'

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
        width: '10%',
        dataIndex: 'must',
        key: 'must',
        render: (text) => {
            return text ? "是" : "否";
        },
    }, {
        title: '描述',
        dataIndex: 'description',
        key: 'description'
    }
]

const listProps = {
    list: [],
    columns,
    size: "small",
    scroll: {x: 600},
    bordered: true,
}

const apiDetail = ({state, app}) => {
    const {item} = state;
    listProps.list = item.serverQueryParam;
    const dbInfo = item.dbInfo || {};
    const serviceSystemId = dbInfo.serviceSystemId || {}
    const affiliationOfficeId = serviceSystemId.affiliationOfficeId || {}

    const onOk = () => {
        if (app.prevLocationPathname != '' && app.prevLocationPathname != '/login') {
            history.goBack()
        } else {
            history.push({
                pathname: '/'
            })
        }
    }

    return (
        <div className={styles.box} style={{maxWidth: '800px', overflow: 'hidden'}}>
            <Button onClick={onOk} type="primary">返回</Button>
            <p>&nbsp;</p>
            <h2>{item.name}</h2>
            <div className={styles.item}>
                <h3>描述：</h3>
                <code>{item.description || ""}</code>
            </div>
            <div className={styles.item}>
                <h3>调用地址：</h3>
                <code>{item.requestPath}</code>
            </div>
            <div className={styles.item}>
                <h3>所属机构：</h3>
                <code>{affiliationOfficeId.name || <i>无</i>}</code>
            </div>
            <div className={styles.item}>
                <h3>所属系统：</h3>
                <code>{serviceSystemId.name || ""}</code>
            </div>
            <div className={styles.item}>
                <h3>所属数据源：</h3>
                <code>{dbInfo.dbName || ""}</code>
            </div>
            <div className={styles.item}>
                <h3>请求方式：</h3>
                <code>{item.requestMode}</code>
            </div>
            <div className={styles.item}>
                <h3>返回类型：</h3>
                <code>{item.responseType}</code>
            </div>
            <div className={styles.item}>
                <h3>请求参数：</h3>
                <List {...listProps} />
            </div>
            <div className={styles.item}>
                <h3>请求示例：</h3>
                <pre>
                    {item.requestDemo}
                </pre>
            </div>
            <div className={styles.item}>
                <h3>返回成功示例：</h3>
                <pre>
                   <ReactJson src={JSON.parse(item.successDemo || "{}")} name={null} displayDataTypes={false}
                              displayObjectSize={false}/>
                </pre>
            </div>
            <div className={styles.item}>
                <h3>返回失败示例：</h3>
                <pre>
                  <ReactJson src={JSON.parse(item.errorDemo || "{}")} name={null} displayDataTypes={false}
                             displayObjectSize={false}/>
                </pre>
            </div>
            <Button style={{float: 'right'}} onClick={onOk} type="primary">返回</Button>
        </div>
    )
}

apiDetail.propTypes = {
    item: PropTypes.object,
    onOk: PropTypes.func,
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})
export default connect(({apiDetail, app}) => ({state: apiDetail, app}), mapDispatchToProps)(apiDetail)
