import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import SweetAlert from 'sweetalert-react';
import { Row, Col } from 'react-flexbox-grid';
import ComboBox from '../../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../../ui/input/inputComponent';
import { MESSAGE_LOAD_DATA } from '../../../../constantsGlobal';
import { redirectUrl } from '../../../globalComponents/actions';
import { changeStateSaveData } from '../../../dashboard/actions';
import { getInfoCovenant, clearCovenant } from '../actions';
import CreateTracking from './createTacking';
import _ from 'lodash';


class ModaltrackingCovenant extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {clearCovenant, getInfoCovenant, covenantId, changeStateSaveData} = this.props;
        clearCovenant();
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        getInfoCovenant(covenantId).then((data) => {
            changeStateSaveData(false, "");
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            }
        });
    }

    

    render() {
        const {covenant} = this.props;
        const infoCovenant = covenant.get('covenantInfo');
        return (
            <div className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{overflowX: 'hidden'}}>
                <dt className="business-title"><span style={{ paddingLeft: '20px' }}>Información del covenant</span></dt>
                <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                    <Row>
                        <Col xs={12} md={12} lg={12} >
                            <dt style={{ paddingTop: '5px' }}>Descripción de acta</dt>
                            <dd>{infoCovenant.descriptionRecord}</dd>
                        </Col>
                        <Col xs={12} md={6} lg={4} >
                            <dt style={{ paddingTop: '5px' }}>Id covenant</dt>
                            <dd style={{ minHeight: '26px' }}>{_.isUndefined(infoCovenant.idCovenant) ? "" : infoCovenant.idCovenant}</dd>
                        </Col>
                        <Col xs={12} md={6} lg={4} >
                            <dt style={{ paddingTop: '5px' }}>Condición de referencia</dt>
                            <dd style={{ minHeight: '26px' }}>{_.isUndefined(infoCovenant.referenceCondition) ? "" : infoCovenant.referenceCondition}</dd>
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
                            <dt style={{ paddingTop: '5px' }}>Negocio/Producto</dt>
                            <dd style={{ minHeight: '26px' }}>{_.isUndefined(infoCovenant.lineOfBusinessName) ? "" : infoCovenant.lineOfBusinessName}</dd>
                        </Col>
                        <Col xs={12} md={6} lg={4} >
                            <dt style={{ paddingTop: '5px' }}>Acta o contrato</dt>
                            <dd style={{ minHeight: '26px' }}>{_.isUndefined(infoCovenant.agreement) ? "" : infoCovenant.agreement}</dd>
                        </Col>
                        <Col xs={12} md={6} lg={4} >
                            <dt style={{ paddingTop: '5px' }}>Responsable</dt>
                            <dd style={{ minHeight: '26px' }}>{_.isUndefined(infoCovenant.managerUsername) ? "" : infoCovenant.managerUsername}</dd>
                        </Col>
                        <Col xs={12} md={6} lg={4} >
                            <dt style={{ paddingTop: '5px' }}>Fecha de grabación</dt>
                            <dd style={{ minHeight: '26px' }}>{_.isNull(infoCovenant.creationTimestamp) || _.isUndefined(infoCovenant.creationTimestamp) ? "" : infoCovenant.creationTimestamp.split(" ")[0]}</dd>
                        </Col>
                        <Col xs={12} md={6} lg={4} >
                            <dt style={{ paddingTop: '5px' }}>Fecha proximo seguimiento</dt>
                            <dd style={{ minHeight: '26px' }}>{_.isNull(infoCovenant.expirationTimestamp) || _.isUndefined(infoCovenant.expirationTimestamp) ? "" : infoCovenant.expirationTimestamp.split(" ")[0]}</dd>
                        </Col>
                    </Row>
                </div>
                <div style={{marginTop: '30px'}} >
                    <CreateTracking />
                </div>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getInfoCovenant,
        changeStateSaveData,
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