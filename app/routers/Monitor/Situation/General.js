import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col, Icon} from 'antd'
import styles from './index.less'

const RowProps = {
    style: {
        marginBottom: 16,
    },
}

const ColProps = {
    xl: 6,
    lg: 12,
    sm: 24,
    style: {
        padding: '0px 12px'
    },
}
const General = ({
                     info = {}
                 }) => {
    const {accessTimes, accessUsers, dataSize = 0, interfaceAmount} = info
    const isMb = (dataSize / 1048576) < 1000 ? false : true;

    return (
        <div className={styles.general}>
            <Row {...RowProps}>
                <Col {...ColProps}>
                    <Row className={styles.items}>
                        <Col className={styles.iconBox}>
                            <Icon className={styles.fs36} style={{fontSize: '60px'}} type="fork"/>
                        </Col>
                        <Col className={styles.txtBox}>
                            <div className={styles.title}>已访问接口</div>
                            <div className={styles.num}>{interfaceAmount}&nbsp;<span>个</span></div>
                        </Col>
                    </Row>
                </Col>
                <Col {...ColProps}>
                    <Row className={styles.items}>
                        <Col className={styles.iconBox}>
                            <Icon className={styles.fs36} type="eye-o" style={{color: "#00c8c6"}}/>
                        </Col>
                        <Col className={styles.txtBox}>
                            <div className={styles.title}>累计访问次数</div>
                            <div className={styles.num}>{accessTimes}&nbsp;<span>次</span></div>
                        </Col>
                    </Row>
                </Col>
                <Col {...ColProps}>
                    <Row className={styles.items}>
                        <Col className={styles.iconBox}>
                            <Icon className={styles.fs36} type="usergroup-add" style={{color: "#2fc25a"}}/>
                        </Col>
                        <Col className={styles.txtBox}>
                            <div className={styles.title}>访问用户量</div>
                            <div className={styles.num}>{accessUsers}&nbsp;<span>个</span></div>
                        </Col>
                    </Row>
                </Col>
                <Col {...ColProps}>
                    <Row className={styles.items}>
                        <Col className={styles.iconBox}>
                            <Icon className={styles.fs36} type="swap"
                                  style={{color: "#ffa210", transform: " rotate(90deg)"}}/>
                        </Col>
                        <Col className={styles.txtBox}>
                            <div className={styles.title}>服务访问流量</div>
                            <div
                                className={styles.num}>{isMb ? (dataSize / 1048576).toFixed(2) : (dataSize / 1024).toFixed(2)}&nbsp;
                                <span>{isMb ? "MB" : "KB"}</span></div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}
General.propTypes = {
    info: PropTypes.object,
}

export default General