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
        // this.state = { // 设置状态
        //     activeKey: "", //数据表中
        //     sortList: [], //排序数组
        //     isSrot: [],//排序数组
        //     expandedList: []//参数数组
        // }
    }

    render() {
        const {tableList, colList, dataLoading, states, tableLoading, dbId, updateState, querySourceCol, isParam, rowRequest, rowResponse, requeryKey, ...props} = this.props
        desc.length = colList.length;

        const {activeKey, sortList, isSrot, expandedList} = states

        //判断是否需要排序
        const showSrot = (v, index) => {
            if (v === "1") {
                sortList.push({sorted: true, type: "ASC", position: "", index: index});
                isSrot.push(index);
            } else {
                sortList.remove(index)
                isSrot.remove(index)
            }
            updateState({sortList, isSrot})
        }

        const onSelectTable = (e, name) => {
            updateState({activeKey: name, sortList: [], isSrot: [], repuestRowKeys: [], responseRowKeys: []});
            querySourceCol({dbId: dbId, tbName: name});
        }

        //获取排序信息
        const changeSortInfo = (v, type, index) => {
            const newList = sortList.map(item => {
                if (item.index === index) {
                    item.sorted = true;
                    if (type === "type") {
                        item.type = v;
                    } else {
                        item.position = v;
                    }
                }
                return item;
            })
            updateState({sortList: newList})
        }

        const dbcolumns = [{
            title: '数据表名称',
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
                title: '字段名',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: '100px'
            }];
        const params = [
            {
                title: '字段名',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
            }, {
                title: '排序',
                key: 'sort',
                render: (text, record, index) => {

                    return <InputGroup compact>
                        <Select defaultValue="0" ref="selecta" onChange={(e) => showSrot(e, index)}
                                className={styles.sortSelect}>
                            <Option key="1" value="1">是</Option>
                            <Option key="0" value="0">否</Option>
                        </Select>
                        {
                            isSrot.indexOf(index) !== -1 &&
                            <Input style={{width: '30px', padding: "0px!important"}} className={styles.sortInput}
                                   maxLength="2" onChange={(e) => changeSortInfo(e.target.value, "position", index)}/>
                        }
                        {
                            isSrot.indexOf(index) !== -1 &&
                            <Select defaultValue="ASC" className={styles.sortSelect}
                                    onChange={(e) => changeSortInfo(e, "type", index)}>
                                <Option key="ASC" value="ASC">升序</Option>
                                <Option key="DESC" value="DESC">降序</Option>
                            </Select>
                        }
                    </InputGroup>
                },
            }, {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: (text, record) => {
                    const rowKey = record.rowKey;
                    return <Input style={{width: '120px'}} onChange={(e) => {
                        inputChange(e, rowKey)
                    }} defaultValue={text}/>;
                },
            }];

        //根据不同的【参数类型】，显示不同的【参数值】的html结构
        const getParamValueHtml = (text, rowKey, index, type) => {

            const onSelectEvent = (e, type) => {
                //只能输入正整数或者0
                if (type === "num") {
                    const reg = /^-?(0|[1-9][0-9]*)$/;
                    if ((isNaN(e) || !reg.test(e)) && e !== '') {
                        return false;
                    }
                }
                text[type] = e;
                changeExpandes(text, rowKey, index, "value")
            }

            let htmlText = expandedList[rowKey].value[index]["paramValueHtml"];
            if (type === "VARIABLE") {
                htmlText = (text) => {
                    return <InputGroup compact>
                        <Select defaultValue="${now_time}" value={text.time} className={styles.sortInput}
                                onChange={(e) => onSelectEvent(e, "time")}>
                            <Option key="${now_time}" value="${now_time}">{"${now_time}"}</Option>
                        </Select>
                        <Select defaultValue="+" value={text.operator}
                                className={styles.sortInput}
                                onChange={(e) => onSelectEvent(e, "operator")}>
                            <Option key="+" value="+">+</Option>
                            <Option key="-" value="-">-</Option>
                        </Select>
                        <Input className={styles.sortInput + " " + styles.width_40}
                               maxLength="2" defaultValue="0" value={text.num}
                               onChange={(e) => onSelectEvent(e.target.value, "num")}/>
                        <Select defaultValue="day" value={text.data} className={styles.sortInput}
                                onChange={(e) => onSelectEvent(e, "data")}>
                            <Option key="day" value="day">day</Option>
                            <Option key="hour" value="hour">hour</Option>
                            <Option key="minute" value="minute">minute</Option>
                            <Option key="second" value="second">second</Option>
                        </Select>
                    </InputGroup>
                }
            } else if (type === "REQUEST") {
                htmlText = () => {
                    return "\\"
                }
            } else if (type === "CONSTANT") {
                htmlText = (text) => {
                    return <Input className={styles.sortInput} defaultValue="" value={text}
                                  onChange={(e) => changeExpandes(e.target.value, rowKey, index, "value")}/>
                }
            }
            expandedList[rowKey].value[index]["paramValueHtml"] = htmlText
            updateState({expandedList})
        }

        //新增一行参数
        const addParamByRow = (record) => {
            expandedList[record.rowKey].value.push({
                name: "",
                type: "CONSTANT",
                operator: "AND",
                compare: "EQUAL",
                value: "",
                paramValueHtml: (text, rowKey, index) => {
                    return <Input className={styles.sortInput} defaultValue="" value={text}
                                  onChange={(e) => changeExpandes(e.target.value, rowKey, index, "value")}/>
                }
            });
            updateState({expandedList})
        }
        //删除指定行参数
        const removeParamByRow = (record, delkey) => {
            if (delkey > -1) {
                expandedList[record.rowKey].value.splice(delkey, 1);
            }
            updateState({expandedList})
        }

        //改变参数数值时触发
        const changeExpandes = (v, rowKey, index, type) => {
            expandedList[rowKey].value[index][type] = v;
            switch (type) {
                case "type":  //根据参数类型显示对应的参数值
                    if (v === "CONSTANT") {
                        expandedList[rowKey].value[index]["value"] = "";
                    } else if (v === "VARIABLE") {
                        expandedList[rowKey].value[index]["value"] = {
                            time: "${now_date}",
                            operator: "+",
                            num: '',
                            data: "day",
                        };
                    } else if (v === "REQUEST") {
                        expandedList[rowKey].value[index]["value"] = "";
                    }
                    break;
                case "name":
                    const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]*[_]?[a-zA-Z0-9\u4e00-\u9fa5]*$/
                    if (!reg.test(v)) {
                        v = v.substring(0, v.length - 1);
                        expandedList[rowKey].value[index][type] = v;
                    }
                    break
            }
            getParamValueHtml(expandedList[rowKey].value[index]["value"], rowKey, index, v)
        }

        //渲染参数列表信息
        const expandedRowRender = (record) => {
            const requeryString = JSON.stringify(requeryKey) + "";
            const recordString = JSON.stringify(record) + "";
            if (requeryKey.length > 0 && requeryString.indexOf(recordString) !== -1) {
                if (expandedList.length < 1) {
                    const newList = colList.map(item => {
                        return {
                            key: item.name, value: []
                        }
                    })
                    updateState({expandedList: newList});
                }
                const columns = [
                    {
                        title: <a className={styles.add} title="添加一行" onClick={() => addParamByRow(record)}>【+】</a>,
                        key: 'add',
                        width: '10px',
                        render: (text, rec, index) => {
                            return <a className={styles.del} title="删除一行"
                                      onClick={() => removeParamByRow(record, index)}>【-】</a>
                        },
                    },
                    {
                        title: '参数名',
                        dataIndex: 'name',
                        key: 'name',
                        width: '120px',
                        render: (text, rec, index) => {
                            return <Input defaultValue={rec.name} value={text}
                                          onChange={(e) => changeExpandes(e.target.value, record.rowKey, index, "name")}
                                          className={styles.sortInput}/>;
                        },
                    }, {
                        title: '参数类型',
                        dataIndex: 'type',
                        key: 'type',
                        width: '80px',
                        render: (text, rec, index) => {
                            return <Select defaultValue="CONSTANT" value={text} className={styles.sortInput}
                                           onChange={(e) => changeExpandes(e, record.rowKey, index, "type")}>
                                <Option key="CONSTANT" value="CONSTANT">常量</Option>
                                <Option key="VARIABLE" value="VARIABLE">变量</Option>
                                <Option key="REQUEST" value="REQUEST">请求传入</Option>
                            </Select>;
                        },
                    }, {
                        title: '合并方式',
                        dataIndex: 'operator',
                        key: 'operator',
                        width: '80px',
                        render: (text, rec, index) => {
                            return <Select value={text} className={styles.sortInput}
                                           onChange={(e) => changeExpandes(e, record.rowKey, index, "operator")}>
                                <Option key="AND" value="AND">AND</Option>
                                <Option key="OR" value="OR">OR</Option>
                            </Select>;
                        },
                    }, {
                        title: '比较方式',
                        dataIndex: 'compare',
                        key: 'compare',
                        width: '100px',
                        render: (text, rec, index) => {
                            const constrastList = [
                                {key: 'LESS', value: 'LESS', text: '小于',},
                                {key: 'LESS_OR_EQUAL', value: 'LESS_OR_EQUAL', text: '小于等于',},
                                {key: 'EQUAL', value: 'EQUAL', text: '等于',},
                                {key: 'NOT_EQUAL', value: 'NOT_EQUAL', text: "不等于",},
                                {key: 'GREATER_OR_EQUAL', value: 'GREATER_OR_EQUAL', text: '大于等于',},
                                {key: 'GREATER', value: 'GREATER', text: '大于',},
                            ];
                            return <Select value={text} className={styles.sortInput}
                                           onChange={(e) => changeExpandes(e, record.rowKey, index, "compare")}>
                                {
                                    constrastList.map(item => <Option key={item.key} value={item.value}>{item.text}</Option>)
                                }
                            </Select>;
                        },
                    }, {
                        title: '参数值',
                        dataIndex: 'value',
                        key: 'value',
                        width: '160px',
                        render: (text, rec, index) => {
                            return rec.paramValueHtml(text, record.rowKey, index)
                        },
                    }
                ];
                for (let i = 0; i < expandedList.length; i++) {
                    if (record.name === expandedList[i].key) {
                        return <Table size="small" columns={columns} dataSource={expandedList[i].value}
                                      pagination={false}/>
                    }
                }
            } else {
                return <p style={{margin: 0, padding: "10px 0", color: "#ccc", border: "1px dashed #ccc"}}>
                    请先勾选【请求字段】</p>
            }

        }

        const inputChange = (e, rowKey) => {
            desc[rowKey] = e.target.value;
            updateState({descriptions: desc})
        }

        return <div>
            {
                isParam ? <Row gutter={24}><Col {...ColProps} xl={{span: 24}} md={{span: 24}} sm={{span: 24}}>
                    <div className={styles.groupStyle}>
                        <Table rowSelection={rowRequest} scroll={{x: true}} size="small" columns={params}
                               expandedRowRender={record => expandedRowRender(record)}
                               pagination={false}
                               loading={tableLoading}
                               dataSource={colList}/>
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
                            <Table rowSelection={rowResponse} scroll={{x: true}} size="small" columns={tables}
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
