import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { getDetailAEC, clearDetailAEC, downloadPDF } from './actions';
import { formatLongDateToDateWithNameMonth, formatCurrency, validateResponse } from '../../../actionsGlobal';
import { MESSAGE_LOAD_DATA } from '../../../constantsGlobal';
import { changeStateSaveData } from '../../main/actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import ModalClientName from '../../globalComponents/modalClientName/component';

export class ModalDetailAEC extends Component {
    
    constructor(props) {
        super(props);
        this.downloadPDF = this.downloadPDF.bind(this);
    }

    downloadPDF(){
        const {idAEC, downloadPDF, changeStateSaveData} = this.props;
        downloadPDF(changeStateSaveData, idAEC);
    }

    componentWillMount() {
        const { idAEC, getDetailAEC, clearDetailAEC, swtShowMessage, changeStateSaveData } = this.props;
        clearDetailAEC();
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        getDetailAEC(idAEC).then((data) => {
            changeStateSaveData(false, "");
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            }
        }, (reason) => {
            changeStateSaveData(false, "");
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    render() {
        const { AECClient, clientInformacion } = this.props;
        const detailAEC = AECClient.get('detailAEC');                
        const infoClient = clientInformacion.get('responseClientInfo');        
        return (
            <div>
                <div className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{ overflowX: 'hidden', maxHeight: '490px !important' }}>
                    <br></br>
                    <ModalClientName clientName={infoClient.clientName} typeDocument={infoClient.clientNameType} clientDocument={infoClient.clientIdNumber}></ModalClientName>                    
                    <dt className="business-title"><span style={{ paddingLeft: '20px' }}>Información del AEC</span></dt>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <Row>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Fecha</dt>
                                <dd style={{ minHeight: '26px' }}>{formatLongDateToDateWithNameMonth(detailAEC.calendarDate)}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Fecha de cierre</dt>
                                <dd style={{ minHeight: '26px' }}>{formatLongDateToDateWithNameMonth(detailAEC.closeDate)}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Estado</dt>
                                <dd style={{ minHeight: '26px' }}>{detailAEC.aecStatus}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Responsable</dt>
                                <dd style={{ minHeight: '26px' }}>{detailAEC.aecResponsable}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Nivel de riesgo</dt>
                                <dd style={{ minHeight: '26px' }}>{detailAEC.aecLevel}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Días de mora</dt>
                                <dd style={{ minHeight: '26px' }}>{formatCurrency(detailAEC.daysLives)}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Porcentaje provisión esperada</dt>
                                <dd style={{ minHeight: '26px' }}>{formatCurrency(detailAEC.provisionPercentage) + '%'}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Saldo capital</dt>
                                <dd style={{ minHeight: '26px' }}>{formatCurrency(detailAEC.capitalBalance)}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Provisión capital</dt>
                                <dd style={{ minHeight: '26px' }}>{formatCurrency(detailAEC.provisionOfCapital)}</dd>
                            </Col>
                            <Col xs={12} md={12} lg={12} >
                                <dt style={{ paddingTop: '5px' }}>Observaciones</dt>
                                <dd style={{ textAlign: 'justify', wordWrap: 'break-word', paddingBottom: '10px' }}>{detailAEC.description}</dd>
                            </Col>
                            <Col xs={12} md={12} lg={12} >
                                <dt style={{ paddingTop: '5px' }}>Plan de acción</dt>
                                <dd style={{ textAlign: 'justify', wordWrap: 'break-word', paddingBottom: '10px' }}>{detailAEC.actionPlan}</dd>
                            </Col>
                            <Col xs={12} md={12} lg={12} >
                                <dt style={{ paddingTop: '5px' }}>Hechos relevantes para provisiones individuales</dt>
                                <dd style={{ textAlign: 'justify', wordWrap: 'break-word', paddingBottom: '10px' }}>{detailAEC.individualProvisions}</dd>
                            </Col>
                            <Col xs={12} md={12} lg={12} >
                                <dt style={{ paddingTop: '5px' }}>Razón cambio nivel de riesgo</dt>
                                <dd style={{ textAlign: 'justify', wordWrap: 'break-word', paddingBottom: '10px' }}>{detailAEC.reasonChangeLevelRisk}</dd>
                            </Col>
                            <Col xs={12} md={12} lg={12} >
                                <dt style={{ paddingTop: '5px' }}>Razón ingreso AEC</dt>
                                <dd style={{ textAlign: 'justify', wordWrap: 'break-word' }}>{detailAEC.reasonIncomeAec}</dd>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="button" onClick={this.downloadPDF} className="btn btn-primary modal-button-edit">
                        <span>Descargar PDF</span>
                    </button>
                </div>
            </div>
        );
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeStateSaveData,
        getDetailAEC,
        clearDetailAEC,
        validateResponse,
        swtShowMessage,
        downloadPDF
    }, dispatch);
}

function mapStateToProps({ AECClient, clientInformacion }) {
    return {
        AECClient,
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDetailAEC);