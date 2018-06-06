import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Row, Col, Table, Select, Input} from 'antd'
import styles from './index.less'

const Option = Select.Option;
const InputGroup = Input.Group
const ColProps = {
    xs: 24,
    sm: 12,
    style: {
        marginBottom: 16,
    },
}

//所有请求【描述】字段数组
let desc = [];

class DataSelect extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {tableList, colList, hbaseTrList, dataLoading, states, tableLoading, trLoading, hBaseTable, hBaseCol, dbId, updateState, rowRequest, isParam, rowResponse, ...props} = this.props
        desc.length = hbaseTrList.length;

        const {activeKey, activeColKey} = states

        const onSelectTable = (e, name) => {
            updateState({activeKey: name});
            hBaseTable({dbId: dbId, namespace: name});
        }

        const onSelectCol = (e, name) => {
            updateState({activeColKey: name});
            hBaseCol({dbId: dbId, namespace: activeKey, tbName: name});
        }

        const dbcolumns = [{
            title: '命名空间名称',
            dataIndex: 'tbName',
            key: 'tbName',
            render: (text) => {
                return <a href="javascript:void(0)"
                          className={styles.dbName + " " + (activeKey === text ? styles.active : '')}
                          onClick={e => onSelectTable(e, text)}>{text}</a>;
            },
        }];
        const tables = [
            {
                title: '数据表名称',
                key: 'name',
                render: (text) => {
                    return <a href="javascript:void(0)"
                              className={styles.dbName + " " + (activeColKey === text.name ? styles.active : '')}
                              onClick={e => onSelectCol(e, text.name)}>{text.name}</a>;
                },
            }];
        const params = [
            {
                title: '字段名',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: (text, record, index) => {
                    return <Input style={{width: '120px'}} onChange={(e) => {
                        inputChange(e, index)
                    }} defaultValue={text}/>;
                },
            }];

        const inputChange = (e, rowKey) => {
            desc[rowKey] = e.target.value;
            updateState({descriptions: desc})
        }

        return <div>
            {
                isParam ? <Row gutter={24}><Col {...ColProps} xl={{span: 24}} md={{span: 24}} sm={{span: 24}}>
                    <div className={styles.groupStyle}>
                        <Table rowSelection={rowRequest} scroll={{x: true}} size="small" columns={params}
                               pagination={false}
                               loading={trLoading}
                               dataSource={hbaseTrList}/>
                    </div>
                </Col></Row> : <Row gutter={24}>
                    <Col {...ColProps} xl={{span: 12}} md={{span: 12}} sm={{span: 24}}>
                        <div className={styles.groupStyle}>
                            <Table columns={dbcolumns}
                                   size="small"
                                   loading={dataLoading} dataSource={tableList}
                                   pagination={false}/>
                        </div>
                    </Col>
                    <Col {...ColProps} xl={{span: 12}} md={{span: 12}} sm={{span: 24}}>
                        <div className={styles.groupStyle}>
                            <Table scroll={{x: true}} size="small" columns={tables}
                                   pagination={false}
                                   loading={tableLoading}
                                   dataSource={colList}/>
                        </div>
                    </Col>
                </Row>
            }

        </div>
    }
}

DataSelect.propTypes = {
    tableList: PropTypes.array,
    colList: PropTypes.array,
}

export default DataSelect
