import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { getDetailAEC } from './actions';
import { redirectUrl } from '../../globalComponents/actions';

class ModalDetailAEC extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const { idAEC, getDetailAEC } = this.props;
        console.log('componentWillMount', idAEC);
        getDetailAEC('5054458').then((data) => {
            console.log('data', data);
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            }
        });
    }

    render() {
        const { AECClient } = this.props;
        const detailAEC = AECClient.get('detailAEC');
        return (
            <div style={{ marginLeft: '7px' }}>
                <h4 style={{ borderBottom: "solid 1px", marginTop: "10px" }}>Último seguimiento</h4>
                <Row>
                    <Col xs={12} md={6} lg={4} >
                        <dt style={{ paddingTop: '5px' }}>Fecha de seguimiento</dt>
                        <dd style={{ minHeight: '26px' }}></dd>
                    </Col>
                    <Col xs={12} md={6} lg={4} >
                        <dt style={{ paddingTop: '5px' }}>Covenant vigente</dt>
                        <dd style={{ minHeight: '26px' }}></dd>
                    </Col>
                    <Col xs={12} md={6} lg={4} >
                        <dt style={{ paddingTop: '5px' }}>Cumplimineto del covenant</dt>
                        <dd style={{ minHeight: '26px' }}></dd>
                    </Col>
                    <Col xs={12} md={6} lg={4} >
                        <dt style={{ paddingTop: '5px' }}>Fecha de estados financieros</dt>
                        <dd style={{ minHeight: '26px' }}></dd>
                    </Col>
                    <Col xs={12} md={12} lg={8} >
                        <dt style={{ paddingTop: '5px' }}>Valor observado</dt>
                        <dd style={{ minHeight: '26px' }}></dd>
                    </Col>
                    <Col xs={12} md={12} lg={12} >
                        <dt style={{ paddingTop: '5px' }}>Observaciones</dt>
                        <dd style={{ textAlign: 'justify' }}></dd>
                    </Col>
                </Row>
            </div>
        );
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDetailAEC
    }, dispatch);
}

function mapStateToProps({ AECClient }) {
    return {
        AECClient
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDetailAEC);