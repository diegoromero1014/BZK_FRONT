import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { getDetailAEC, clearDetailAEC } from './actions';
import { redirectUrl } from '../../globalComponents/actions';
import { formatLongDateToDateWithNameMonth, formatCurrency, validateResponse } from '../../../actionsGlobal';
import { MESSAGE_LOAD_DATA } from '../../../constantsGlobal';
import { changeStateSaveData } from '../../dashboard/actions';
import { AEC_STATUS, AEC_LEVEL } from '../../selectsComponent/constants';
import { swtShowMessage } from '../../sweetAlertMessages/actions';

class ModalDetailAEC extends Component {
    constructor(props) {
        super(props);
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
        const { AECClient, selectsReducer } = this.props;
        const detailAEC = AECClient.get('detailAEC');
        const statesAEC = selectsReducer.get(AEC_STATUS);
        const levelsAEC = selectsReducer.get(AEC_LEVEL);
        const stateAEC = _.get(_.filter(statesAEC, ['id', parseInt(detailAEC.aecStatus)]), '[0].value');
        const levelAEC = _.get(_.filter(levelsAEC, ['id', parseInt(detailAEC.aecLevel)]), '[0].value');
        return (
            <div>
                <div className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{ overflowX: 'hidden', maxHeight: '490px !important' }}>
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
                                <dd style={{ minHeight: '26px' }}>{stateAEC}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Responsable</dt>
                                <dd style={{ minHeight: '26px' }}>{detailAEC.aecResponsable}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Nivel de riesgo</dt>
                                <dd style={{ minHeight: '26px' }}>{levelAEC}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Días de mora</dt>
                                <dd style={{ minHeight: '26px' }}>{formatCurrency(detailAEC.daysLives)}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>% Provisión esperada</dt>
                                <dd style={{ minHeight: '26px' }}>{formatCurrency(detailAEC.provisionPercentage)}</dd>
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
                                <dd style={{ textAlign: 'justify' }}>{detailAEC.description}</dd>
                            </Col>
                            <Col xs={12} md={12} lg={12} >
                                <dt style={{ paddingTop: '5px' }}>Plan de acción</dt>
                                <dd style={{ textAlign: 'justify' }}>{detailAEC.actionPlan}</dd>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
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
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({ AECClient, selectsReducer }) {
    return {
        AECClient,
        selectsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDetailAEC);