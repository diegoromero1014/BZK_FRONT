import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';
import { validateResponse, stringValidate } from '../../../actionsGlobal';
import Textarea from "../../../ui/textarea/textareaComponent";
import { changeStateSaveData } from '../../dashboard/actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import {
    MESSAGE_ERROR, MESSAGE_ERROR_SWEET_ALERT, TITLE_ERROR_SWEET_ALERT, MESSAGE_SAVE_DATA,
    MESSAGE_SUCCESS
} from '../../../constantsGlobal';
import ItemObservationRiskGroup from "./itemObservationRiskGroup";
import { saveObservationsRiskGroup, getListObservationsRiskGroupById } from '../actions';
import { RISK_GROUP, MEMBER_RISK_GROUP } from '../constants';

class modalObservationRiskGroup extends Component {
    constructor(props) {
        super(props);
        this._mapItemObservation = this._mapItemObservation.bind(this);
        this._saveObservation = this._saveObservation.bind(this);
        this.state = {
            observation: ''
        }
    }

    _mapItemObservation(item, idx) {
        return <ItemObservationRiskGroup key={idx} item={item} />
    }

    _saveObservation() {
        const { saveObservationsRiskGroup, riskGroupReducer, infoRiskGroup, changeStateSaveData,
            swtShowMessage, isOpen } = this.props;
        const observations = riskGroupReducer.get("observtionsRiskGroup");
        var arr_ob = Object.assign([], observations);
        var ob = Object.assign({}, arr_ob.pop());
        if (stringValidate(this.state.observation)) {
            changeStateSaveData(true, MESSAGE_SAVE_DATA);
            saveObservationsRiskGroup(ob.codeEntity,infoRiskGroup.entity, this.state.observation).then((data) => {
                changeStateSaveData(false, "");
                if (validateResponse(data)) {
                    isOpen();
                    swtShowMessage(MESSAGE_SUCCESS, 'Observaciones', 'Señor usuario, las observaciones se han guardado exitosamente');
                } else {
                    swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                }
            }, (reason) => {
                changeStateSaveData(false, "");
                swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            });
        } else {
            swtShowMessage(MESSAGE_ERROR, 'Información faltante', 'Señor usuario, debe ingresar la observación');
        }

    }



    componentWillMount() {
        const { idRiskGroup, getListObservationsRiskGroupById, changeStateSaveData,
            swtShowMessage } = this.props;
        changeStateSaveData(true, MESSAGE_SAVE_DATA);
        getListObservationsRiskGroupById(idRiskGroup).then((data) => {
            changeStateSaveData(false, "");
        }, (reason) => {
            changeStateSaveData(false, "");
            swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }
    render() {
        const { riskGroupReducer, infoRiskGroup, isOpen } = this.props;
        const listObservations = riskGroupReducer.get('observtionsRiskGroup');
        return (
            <div>
                <div style={{ overflow: 'hidden' }} className="modalBt4-body modal-body business-content editable-form-content clearfix"
                    id="modalCreateBoardMembers">
                    <Row style={{ margin: '15px 0px 0px 10px' }}>
                        <Col xs={6} md={3} lg={3}>
                            <span style={{ fontWeight: "bold" }}>Identificación</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span style={{ fontWeight: "bold" }}>Nombre</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span style={{ fontWeight: "bold" }}>Novedad</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span style={{ fontWeight: "bold", marginLeft: '-7px' }}>Estado de la novedad</span>
                        </Col>
                    </Row>
                    <Row style={{ margin: "5px 10px 15px 15px" }}>
                        <Col xs={6} md={3} lg={3}>
                            <span>{infoRiskGroup.code}</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span>{infoRiskGroup.nameData}</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span>{infoRiskGroup.novelty}</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span>{infoRiskGroup.stateNovelty}</span>
                        </Col>
                    </Row>
                    <div style={{
                        border: '1px solid #E3E3E3', height: '215px', borderRadius: '4px',
                        overflow: 'auto', margin: '0px 15px 0px 15px'
                    }}>
                        {listObservations.map(this._mapItemObservation)}
                    </div>
                    <Row style={{ padding: "0px 0px 0px 20px" }}>
                        <Col xs={12} md={12} lg={12}>
                            <dt>
                                <span>Observación (
                                    <span style={{ color: "red" }}>*</span>
                                    )</span>
                            </dt>
                        </Col>
                    </Row>
                    <Row style={{ padding: "0px 0px 0px 20px", marginRight: '10px' }}>
                        <Col xs={12} md={12} lg={12}>
                            <Textarea
                                name="txtArea"
                                value={this.state.observation}
                                touched={true}
                                onChange={(val) => this.setState({ observation: val })}
                                title="Ingrese las observaciones"
                                style={{ width: '100%', height: '108px' }}
                                max={500}
                            />
                        </Col>
                    </Row>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="submit" className="btn btn-primary modal-button-edit"
                        onClick={this._saveObservation}>
                        <span>Guardar</span>
                    </button>
                    <button className="modal-button-edit btn btn-default btnDefaultAyax"
                        onClick={() => {
                            isOpen()
                        }}>
                        <span>Cancelar</span>
                    </button>
                </div>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        swtShowMessage,
        changeStateSaveData,
        saveObservationsRiskGroup,
        getListObservationsRiskGroupById
    }, dispatch);
}

function mapStateToProps({ riskGroupReducer }, ownerProps) {
    return {
        riskGroupReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(modalObservationRiskGroup);