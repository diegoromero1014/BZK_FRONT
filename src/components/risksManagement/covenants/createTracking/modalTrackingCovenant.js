import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import ComboBox from '../../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../../ui/input/inputComponent';
import { MESSAGE_LOAD_DATA } from '../../../../constantsGlobal';
import { redirectUrl } from '../../../globalComponents/actions';
import { changeStateSaveData } from '../../../dashboard/actions';
import { getInfoCovenant, clearCovenant, changeStatusCreate } from '../actions';
import { mapDateValueFromTaskByFormat } from '../../../../actionsGlobal';
import CreateTracking from './createTacking';
import _ from 'lodash';

class ModaltrackingCovenant extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {clearCovenant, getInfoCovenant, covenantId, changeStateSaveData, changeStatusCreate} = this.props;
        clearCovenant();
        changeStatusCreate(false);
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        getInfoCovenant(covenantId).then((data) => {
            changeStateSaveData(false, "");
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            }
        });
    }

    render() {
        const {covenant, isOpen} = this.props;
        const infoCovenant = covenant.get('covenantInfo');
        console.log(infoCovenant.strCovenant);
        const dateCreate = _.isUndefined(infoCovenant.creationTimestamp) || _.isNull(infoCovenant.creationTimestamp) ? "" : mapDateValueFromTaskByFormat(infoCovenant.creationTimestamp.split(" ")[0], 'DD MMM YYYY');
        const dateExpiration = _.isUndefined(infoCovenant.expirationTimestamp) || _.isNull(infoCovenant.expirationTimestamp) ? "" : mapDateValueFromTaskByFormat(infoCovenant.expirationTimestamp.split(" ")[0], 'DD MMM YYYY');
        return (
            <div>
                <div className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{ overflowX: 'hidden', maxHeight: '490px !important' }}>
                    <dt className="business-title"><span style={{ paddingLeft: '20px' }}>Información del covenant</span></dt>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <Row>
                            <Col xs={12} md={12} lg={12} >
                                <dt style={{ paddingTop: '5px' }}>Covenant</dt>
                                <dd style={{ textAlign: 'justify' }}>{infoCovenant.strCovenant}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Id covenant</dt>
                                <dd style={{ minHeight: '26px' }}>{_.isUndefined(infoCovenant.idCovenant) ? "" : infoCovenant.idCovenant}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Valor de referencia</dt>
                                <dd style={{ minHeight: '26px' }}>{_.isUndefined(infoCovenant.referenceValue) ? "" : infoCovenant.referenceValue}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Frecuencia de revisión</dt>
                                <dd style={{ minHeight: '26px' }}>{_.isUndefined(infoCovenant.revisionFrequencyName) ? "" : infoCovenant.revisionFrequencyName}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Entidad/Línea de negocio</dt>
                                <dd style={{ minHeight: '26px' }}>{_.isUndefined(infoCovenant.lineOfBusinessName) ? "" : infoCovenant.lineOfBusinessName}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Acta o contrato</dt>
                                <dd style={{ minHeight: '26px' }}>{_.isUndefined(infoCovenant.agreement) ? "" : infoCovenant.agreement}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Gerente responsable</dt>
                                <dd style={{ minHeight: '26px' }}>{_.isUndefined(infoCovenant.managerUsername) ? "" : infoCovenant.managerUsername}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Fecha de creación</dt>
                                <dd style={{ minHeight: '26px' }}>{dateCreate}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Fecha próximo seguimiento</dt>
                                <dd style={{ minHeight: '26px' }}>{dateExpiration}</dd>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ marginTop: '15px' }} >
                        <dt className="business-title"><span style={{ paddingLeft: '20px', paddingBottom: '10px' }}>Información de seguimientos</span></dt>
                        <CreateTracking isOpen={isOpen} />
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeStateSaveData,
        changeStatusCreate,
        getInfoCovenant,
        clearCovenant
    }, dispatch);
}

function mapStateToProps({reducerGlobal, covenant}, ownerProps) {
    return {
        reducerGlobal,
        covenant
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModaltrackingCovenant);
