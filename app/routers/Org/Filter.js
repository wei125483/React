import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'antd'

const ColProps = {
    style: {
        marginBottom: 16,
        display: 'inline-block',
        width: 200,
    }
}

const Filter = ({
    appops,
    onAdd,
}) => {

    return (
        <Row gutter={24}>
            { appops.org_add.is && <Col style={{ ...ColProps.style, width: 'auto', float: 'right', textAlign: 'right' }}>
                <Button type="ghost" onClick={onAdd} style={{ marginLeft: 16 }}>新增</Button>
            </Col> }
        </Row>
    )
}

Filter.propTypes = {
    appops: PropTypes.object,
    onAdd: PropTypes.func,
}

export default Filter