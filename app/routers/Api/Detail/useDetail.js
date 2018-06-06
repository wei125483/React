import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Modal} from 'antd'

import styles from '../MyApi/index.less'

const apiUseDetail = ({item, ...modalProps}) => {
    return (
        <Modal {...modalProps} width={680}>
            <div className={styles.item}>
                <div><label className={styles.label}>接口名：</label><a
                    href={"#/api/detail/" + item.id}>{item.serverInfo.name || ""}</a></div>
            </div>
            <div className={styles.item}>
                <div><label className={styles.label}>申请人：</label>{item.applyUsername || ""}</div>
            </div>
            <div className={styles.item}>
                <div><label className={styles.label}>使用时间：</label>{item.startUseDate + "  -  " + item.endUseDate}</div>
            </div>
            <div className={styles.item}>
                <div><label className={styles.label}>备注：</label>
                    <p>{item.applyReason|| ""}</p></div>
            </div>
        </Modal>
    )
}

apiUseDetail.propTypes = {
    item: PropTypes.object,
}

export default apiUseDetail