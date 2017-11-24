import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { changeStatusCreate } from '../actions';
import InfoLastTracking from './infoLastTracking';
import FormCreateTracking from './formCreateTracking';
import ListTracking from './listTracking';
import {TRACKING_ENVIRONMENTAL } from '../../../../constantsGlobal';
import _ from 'lodash';
import {CLASSIFICATION_ENVIRONMENTAL} from '../constants.js';


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
        const {covenant, isOpen,reducerGlobal} = this.props;
        const infoCovenant = covenant.get('covenantInfo');
        const permissionsCovenants = reducerGlobal.get('permissionsCovenants');
        let allowTracking = false;
        /**
         * @ahurtado - 19/10/2017
         * Si el covenant es de clasificación "Ambiental" se valida con el permiso "Seguimiento ambiental",
         * si no se válida con el gerente responsable o asistentes del gerente.
         * Nota: El gerente responsable de un covenant de clasificación "Ambiental" siempre y cuando no tenga el permiso
         * no podra realizar seguimientos, sólo visualizar.
        **/
        if(_.isEqual(infoCovenant.strClassification, CLASSIFICATION_ENVIRONMENTAL)){
            allowTracking = _.get(permissionsCovenants, _.indexOf(permissionsCovenants, TRACKING_ENVIRONMENTAL), false);
        }else{
            allowTracking =  infoCovenant.showButtonAddTrackingCovenant;
        }
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
                        {allowTracking &&
                            <Col xs={12} md={12} lg={12} style={{ paddingRight: "8px", textAlign: "right" }}>
                                <button className="btn btn-primary" onClick={this._addTracking} style={{ float: 'right', cursor: 'pointer' }} title="Agregar seguimiento">
                                    <i className="white plus icon"></i>Agregar seguimiento
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