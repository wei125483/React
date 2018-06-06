import React, {Component} from 'react'
import {Row, message, Col, Table, Button, Input} from 'antd'
import styles from './index.less'

const ColProps = {
    xs: 24,
    sm: 12,
    style: {
        marginBottom: 16,
    },
}

class DiySql extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [
                {name: "", description: ""}
            ]
        }
    }

    render() {

        const changeInput = (v, rowIndex, type) => {
            const list = this.state.list;
            switch (type) {
                case "name":
                    list[rowIndex].name = v;
                    break;
                case "description":
                    list[rowIndex].description = v;
                    break;
            }
            this.setState({list})
            this.props.parentSetState({sqlParamList: list})
        }

        const blurInput = (v, rowIndex) => {
            const list = this.state.list;
            let index = 0;
            list.map((item) => {
                if (v === item.name && v !== "") {
                    index++
                }
            })
            if (index > 1) {
                list[rowIndex].name = "";
                message.warning(`自动清除重复参数名【${v}】`);
            }
            this.setState({list})
            this.props.parentSetState({sqlParamList: list})
        }

        const dbcolumns = [
            {
                title: <a className={styles.add} title="添加一行" onClick={() => addAndDelRowFn("add")}>【+】</a>,
                key: 'add',
                width: '10px',
                render: (text, rec, index) => {
                    return <a className={styles.del} title="删除一行"
                              onClick={() => addAndDelRowFn("del", index)}>【-】</a>
                },
            }, {
                title: '排序号',
                key: 'id',
                width: '80px',
                render: (text, rows, index) => {
                    return index + 1;
                },
            }, {
                title: '参数名称',
                dataIndex: 'name',
                width: '200px',
                key: 'name',
                render: (text, rows, index) => {
                    return <Input maxLength="32" onChange={(e) => {
                        changeInput(e.target.value, index, "name")
                    }} onBlur={(e) => {
                        blurInput(e.target.value, index)
                    }} defaultValue={text} value={text}/>
                },
            }, {
                title: '描述',
                dataIndex: 'description',
                width: '200px',
                key: 'description',
                render: (text, rows, index) => {
                    return <Input maxLength="200" onChange={(e) => {
                        changeInput(e.target.value, index, "description")
                    }} defaultValue={text} value={text}/>
                },
            }];

        const addAndDelRowFn = (type, index) => {
            const newList = this.state.list;
            if (type === "add") {
                newList.push({name: "", description: ""});
            } else if (type === "del") {
                newList.splice(index, 1);
            }
            this.setState({list: newList});
            this.props.parentSetState({sqlParamList: newList})
        }

        return <div>
            <Row gutter={24}>
                <Col span="24">
                    <div className={styles.groupStyle}>
                        <Table columns={dbcolumns}
                               size="small" dataSource={this.state.list}
                               pagination={false}/>
                    </div>
                </Col>
            </Row>
        </div>
    }
}

export default DiySql
