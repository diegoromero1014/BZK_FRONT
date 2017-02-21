import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../../../globalComponents/actions';
import { changeStatusCreate } from '../actions';
import InfoLastTracking from './infoLastTracking';
import FormCreateTracking from './formCreateTracking';
import ListTracking from './listTracking';
import _ from 'lodash';


class CreateTracking extends Component {
    constructor(props) {
        super(props);
        this._addTracking = this._addTracking.bind(this);
    }
    
    _addTracking() {
        const {changeStatusCreate} = this.props;
        changeStatusCreate(true);
    }

    render() {
        const {covenant, isOpen} = this.props;
        const infoCovenant = covenant.get('covenantInfo');
        return (
            <div style={{ marginLeft: '15px', marginRight: '15px', marginTop: '15px' }}>
                <Row xs={12} md={12} lg={12}>
                    <Col xs={12} md={12} lg={12}>
                        <InfoLastTracking />
                    </Col>
                </Row>
                {covenant.get('showFormCreatetracking') &&
                    <FormCreateTracking isOpen={isOpen}/>
                }
                {!covenant.get('showFormCreatetracking') &&
                    <Row xs={12} md={12} lg={12} style={{ marginBottom: '10px', marginTop: '15px' }} >
                        {infoCovenant.showButtonAddTrackingCovenant &&
                            <Col xs={12} md={12} lg={12} style={{ paddingRight: "8px", textAlign: "right" }}>
                                <button className="btn btn-primary" onClick={this._addTracking} style={{ float: 'right', cursor: 'pointer' }} title="Agregar seguimiento">
                                    <i className="white plus icon"></i>Agrear seguimiento
                                </button>
                            </Col>
                        }
                    </Row>
                }
                <Row xs={12} md={12} lg={12}>
                    <Col xs={12} md={12} lg={12}>
                        <ListTracking />
                    </Col>
                </Row>
            </div>
        );
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeStatusCreate
    }, dispatch);
}

function mapStateToProps({reducerGlobal, covenant}, ownerProps) {
    return {
        reducerGlobal,
        covenant
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTracking);