import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Row, Col, Select, Button, Radio, message} from 'antd'
import DataSelect from './DataSelect'
import HBaseSelect from './HBaseSelect'
import DiySql from "./DiySql";

const {TextArea} = Input
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

const formItemLayout = {
    style: {
        float: "left",
        width: "50%",
    },
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
}

const formLayout = {
    style: {
        position: "initial"
    },
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 21,
    },
}

let requeryKey = [], responseKey = [];

class Addeidt extends Component {

    constructor(props) {
        super(props);
        this.state = { // 设置状态
            requeryKey: [],
            activeKey: "", //数据表中
            activeColKey: "", //数据表中
            sortList: [], //排序数组
            isSrot: [],//排序数组
            isDiySql: false,//是否是自定义Sql
            expandedList: [],//参数数组
            descriptions: [],
            repuestRowKeys: [],
            responseRowKeys: [],
            sqlParamList: [], //自定义SQL参数列表
        }
    }

    render() {
        const {item = {}, updateState, onOk, isHBase, dataLoading, tableLoading, trLoading, form: {getFieldDecorator, validateFieldsAndScroll}, hBaseTable, hBaseCol, dbList, hbaseTrList, dbId, tableList, colList, querySourceTable, querySourceCol, checkSerUrl, ...modalProps} = this.props

        const handleOk = () => {
            validateFieldsAndScroll((err, values) => {

                if (responseKey.length < 1 && !isHBase && !this.state.isDiySql) {
                    message.error("请勾选返回字段")
                    return false;
                }
                if (!err && checkRequeryParam1()) {
                    delete values.id
                    const expandedList = this.state.expandedList;
                    const sortList = this.state.sortList;

                    values.tbName = this.state.activeKey;
                    values.queryParam = JSON.stringify([]);
                    values.dbFiled = JSON.stringify(responseKey);
                    values.sqlModel = this.state.isDiySql;

                    if (this.state.isDiySql) {
                        const paramList = this.state.sqlParamList;
                        const params = [];
                        let index = 0;
                        paramList.map((item) => {
                            if (item.name && item.name !== "") {
                                index++;
                                item.position = index;
                                params.push(item)
                            }
                        })
                        values.requestParam = JSON.stringify(params);
                    } else {
                        if (expandedList.length > 0 && requeryKey.length > 0) {
                            for (let i = 0; i < requeryKey.length; i++) {
                                const expand = expandedList[requeryKey[i].rowKey].value
                                requeryKey[i].params = [];
                                expand.map(item => {
                                    if (item.name && item.name !== "") {
                                        if (typeof item.value === "object") {
                                            const num = isNaN(item.value.num) ? 0 : item.value.num;
                                            item.value = "(" + item.value.time + item.value.operator + num + ")" + item.value.data;
                                        }
                                        const newItem = {
                                            "compare": item.compare,
                                            "name": item.name,
                                            "operator": item.operator,
                                            "type": item.type,
                                            "value": item.value
                                        }
                                        requeryKey[i].params.push(newItem);
                                    }
                                })
                            }
                        }
                        if (sortList.length > 0 && requeryKey.length > 0) {
                            for (let i = 0; i < requeryKey.length; i++) {
                                requeryKey[i].sorter = {
                                    sorted: false,
                                };
                                sortList.map(item => {
                                    if (item.index === requeryKey[i].rowKey) {
                                        requeryKey[i].sorter = {
                                            "sorted": true,
                                            "type": item.type,
                                            "position": item.position || 0,
                                        };
                                    }
                                })
                            }
                        }
                        if (isHBase) {
                            values.namespace = this.state.activeKey;
                            values.tbName = this.state.activeColKey;
                            for (let i = 0; i < this.state.descriptions.length; i++) {
                                requeryKey[i].description = this.state.descriptions[i];
                                delete requeryKey[i].params
                            }
                        }
                        values.requestParam = JSON.stringify(requeryKey);
                    }
                    onOk(values)
                }
            })
        }

        const addEidtState = (newState) => {
            this.setState(newState);
        }
        const onCancel = () => {
            updateState({addShow: false})
        }

        const initState = () => {

            this.setState({
                requeryKey: [],
                descriptions: [],
                expandedList: [],
                sortList: [],
                repuestRowKeys: [],
                responseRowKeys: [],
            });
            requeryKey = [];
            responseKey = [];
        }

        //验证服务地址名称是否已存在
        const checkServerUrl = (rule, value, callback) => {
            if (value) {
                checkSerUrl({serverPath: value, callback});
            } else {
                callback()
            }
        }
        //验证是否选择返回字段
        const checkResponse = (rule, value, callback) => {
            if (responseKey.length < 1) {
                callback("请勾选返回字段");
            } else {
                callback();
            }
        }
        //验证是否选择请求字段
        const checkRequery = (rule, value, callback) => {
            if (requeryKey.length < 1) {
                callback("请勾选请求参数");
            } else {
                callback();
            }
        }

        const checkRequeryParam = (rule, value, callback) => {
            const text = "【请求字段】中的参数名称和参数值不能为空";
            const expandedList = this.state.expandedList
            console.log(expandedList)
            if (expandedList.length > 0) {
                let check = true;
                for (let i = 0; i < requeryKey.length; i++) {
                    const expand = expandedList[requeryKey[i].rowKey].value
                    if (expand.length < 1) {
                        continue
                    }
                    requeryKey[i].params = []
                    for (let j = 0; j < expand.length; j++) {
                        const item = expand[j]
                        if (!item.name || item.name === "" || (item.type !== "REQUEST" && (!item.value || item.value === "" || item.length < 1))) {
                            callback(text)
                            check = false
                            break
                        }
                    }
                    if (!check) {
                        break
                    }
                }
                callback()
            }
            callback()
        }

        const checkRequeryParam1 = () => {
            const text = "【请求字段】中的参数名称和参数值不能为空";
            const expandedList = this.state.expandedList
            if (expandedList.length > 0) {
                let check = true;
                for (let i = 0; i < requeryKey.length; i++) {
                    const expand = expandedList[requeryKey[i].rowKey].value
                    requeryKey[i].params = []
                    for (let j = 0; j < expand.length; j++) {
                        const item = expand[j]
                        if (!item.name || item.name === "" || (item.type !== "REQUEST" && (!item.value || item.value === "" || item.length < 1))) {
                            message.error(text);
                            check = false
                            break
                        }
                    }
                    if (!check) {
                        break
                    }
                }
                return check
            }
            return true
        }

        const rowRequest = {
            onSelectAll: (selected, selectedRows, changeRows) => {
                selectedRows = selectedRows.map((item, i) => {
                    item.description = this.state.descriptions[i] || "";
                    item.params = [];
                    return item;
                })
                requeryKey = selectedRows;
                this.setState({requeryKey})
            },
            onSelect: (record, selected, selectedRows) => {
                selectedRows = selectedRows.map((item, i) => {
                    item.description = this.state.descriptions[i] || "";
                    item.params = [];
                    return item;
                })
                requeryKey = selectedRows;
                this.setState({requeryKey})
            },
            onChange: (selectedRowKeys) => {
                this.setState({repuestRowKeys: selectedRowKeys})
            },
            selectedRowKeys: this.state.repuestRowKeys
        };
        const rowResponse = {
            onSelectAll: (selected, selectedRows) => {
                selectedRows = selectedRows.map((item, i) => {
                    item.description = this.state.descriptions[i] || "";
                    return item;
                })
                responseKey = selectedRows;
            },
            onSelect: (record, selected, selectedRows) => {
                responseKey = selectedRows;
            },
            onChange: (selectedRowKeys) => {
                this.setState({responseRowKeys: selectedRowKeys})
            },
            selectedRowKeys: this.state.responseRowKeys
        };
        const dataSelect = {
            rowRequest,
            rowResponse,
            requeryKey: this.state.requeryKey,
            dataLoading,
            hBaseTable,
            hBaseCol,
            tableLoading,
            trLoading,
            dbList,
            tableList,
            colList,
            hbaseTrList,
            states: this.state,
            updateState: addEidtState,
            dbId,
            isParam: false,
            querySourceTable,
            querySourceCol,
            onChange(e) {
                console.log(e)
            }
        }
        const diyParams = {
            parentSetState: (param) => {
                this.setState(param)
            }
        }

        //选择数据表之后查询数据列表信息
        const selectDb = (id, option) => {
            initState();
            const type = option.props.dataType
            updateState({isHBase: type === "HBASE"})
            querySourceTable({dbId: id});
        }
        return (
            <div style={{overflowX: "auto"}}>
                <div style={{width: '1024px', overflow: 'hidden', margin: "0 auto"}}>
                    <h1 style={{textAlign: "center", margin: '20px 0'}}>新增数据接口</h1>
                    <Form layout="horizontal">
                        <FormItem label="接口名称" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: "",
                                rules: [{
                                    required: true, message: '接口名称不能为空',
                                }],
                            })(<Input maxLength="32"/>)}
                        </FormItem>
                        <FormItem label="调用地址" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('serverPath', {
                                initialValue: "",
                                rules: [
                                    {
                                        validator: checkServerUrl,
                                    }, {
                                        required: true,
                                        message: '调用地址不能为空'
                                    },
                                ],
                            })(<Input maxLength="120"/>)}
                        </FormItem>
                        <FormItem label="请求方式" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('requestMode', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择请求方式'
                                    },
                                ],
                            })(<Select style={{width: '100%'}}>
                                <Option value="GEI">GET</Option>
                                <Option value="POST">POST</Option>
                                <Option value="UPDATE">UPDATE</Option>
                                <Option value="DELETE">DELETE</Option>
                            </Select>)}
                        </FormItem>
                        <FormItem label="返回类型" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('responseType', {
                                initialValue: "JSON",
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择返回类型'
                                    },
                                ],
                            })(<Select style={{width: '100%'}}>
                                <Option value="JSON">JSON</Option>
                            </Select>)}
                        </FormItem>
                        <FormItem label="数据源" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('dbId', {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true,
                                        message: '数据源不能为空'
                                    },
                                ],
                            })(<Select style={{width: '100%'}} onSelect={(value, option) => selectDb(value, option)}>
                                {
                                    dbList.map((el) => {
                                        return <Option key={el.id} dataType={el.dbType.type}
                                                       value={el.id}>{el.dbName}</Option>
                                    })
                                }
                            </Select>)}
                        </FormItem>
                        <FormItem label="自定义SQL" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('isSql', {
                                initialValue: false,
                            })(<RadioGroup onChange={(e) => {
                                updateState({colList: []});
                                this.setState({isDiySql: e.target.value, activeKey: ''})
                            }}>
                                <Radio value={false}>否</Radio>
                                <Radio value={true}>是</Radio>
                            </RadioGroup>)}
                        </FormItem>
                        {
                            !this.state.isDiySql ?
                                <FormItem label={isHBase ? "数据结构" : "返回字段"} hasFeedback {...formLayout}>
                                    {getFieldDecorator('dbFiled', isHBase ? {} : {
                                        rules: [{
                                            validator: checkResponse,
                                        }],
                                    })(<div>
                                        {
                                            isHBase ? <HBaseSelect {...dataSelect}/> : <DataSelect {...dataSelect}/>
                                        }
                                    </div>)}
                                </FormItem> : <FormItem label="SQL语句" hasFeedback {...formLayout}>
                                    {getFieldDecorator('querySQL', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入请求SQL语句'
                                            }
                                        ]
                                    })(<TextArea autosize={{minRows: 4, maxRows: 6}} />)}
                                </FormItem>
                        }
                        {dataSelect.isParam = true}
                        {
                            !this.state.isDiySql ? <FormItem label="请求字段" hasFeedback {...formLayout}>
                                {getFieldDecorator('queryParam', isHBase ? {
                                    rules: [{
                                        required: true,
                                        message: '请勾选请求字段'
                                    }],
                                } : {})(<div>
                                    {
                                        isHBase ? <HBaseSelect {...dataSelect}/> : <DataSelect {...dataSelect}/>
                                    }
                                </div>)}
                            </FormItem> : <FormItem label="请求参数" hasFeedback {...formLayout}>
                                {getFieldDecorator('params', {
                                    initialValue: "",
                                })(<DiySql {...diyParams}/>)}
                            </FormItem>
                        }
                        <FormItem label="接口描述" hasFeedback {...formLayout}>
                            {getFieldDecorator('description', {
                                initialValue: "",
                            })(<div><TextArea autosize={{minRows: 5, maxRows: 7}} maxLength="255"/></div>)}
                        </FormItem>
                        <Row>
                            <Col span={24}>
                                <Button style={{float: 'right', marginLeft: "10px"}} htmlType="submit"
                                        onClick={handleOk}
                                        type="primary">保存</Button>
                                <Button style={{float: 'right'}} onClick={onCancel} type="ghost">返回</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

Addeidt.propTypes = {
    form: PropTypes.object.isRequired,
    type: PropTypes.string,
    item: PropTypes.object,
    onOk: PropTypes.func,
}

export default Form.create()(Addeidt)