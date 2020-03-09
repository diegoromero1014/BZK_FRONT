import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { validateResponse } from '../../../../actionsGlobal';
import {
    getListObservactionsByIdLink, clearListObservations, saveObservationLinkingRequest
} from '../actions';
import {
    MESSAGE_ERROR, MESSAGE_ERROR_SWEET_ALERT, TITLE_ERROR_SWEET_ALERT, MESSAGE_SAVE_DATA,
    MESSAGE_SUCCESS
} from '../../../../constantsGlobal';
import ItemObservation from './itemObservation';
import Textarea from "../../../../ui/textarea/textareaComponent";
import { changeStateSaveData } from '../../../main/actions';
import { swtShowMessage } from '../../../sweetAlertMessages/actions';
import {
    checkRequired,
    checkFirstCharacter,
    checkObservations,
    checkRegexHtmlInjection
} from '../../../../validationsFields/rulesField';

export class ModalObservation extends Component {

    constructor(props) {
        super(props);
        this._mapItemObservation = this._mapItemObservation.bind(this);
        this._saveObservation = this._saveObservation.bind(this);
        this._validatewhiteList = this._validatewhiteList.bind(this);
        this.state = {
            observation: '',
            errors: ''
        }
    }

    _mapItemObservation(item, idx) {
        return <ItemObservation key={idx} item={item} />
    }

    _validatewhiteList(e) {
        this.setState({ observation: e });
        let error = checkRequired(e) || checkFirstCharacter(e) || checkObservations(e) || checkRegexHtmlInjection(e);
        this.setState({ errors: error });
    }

    _saveObservation() {
        const { saveObservationLinkingRequest, idLinkingRequests, changeStateSaveData,
            swtShowMessage, isOpen } = this.props;
        if (!this.state.errors) {
            changeStateSaveData(true, MESSAGE_SAVE_DATA);
            saveObservationLinkingRequest(idLinkingRequests, this.state.observation).then((data) => {
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
        }
    }

    componentWillMount() {
        const { clearListObservations } = this.props;
        clearListObservations();
    }

    componentDidMount() {
        const { idLinkingRequests, getListObservactionsByIdLink, changeStateSaveData,
            swtShowMessage } = this.props;
        changeStateSaveData(true, MESSAGE_SAVE_DATA);
        getListObservactionsByIdLink(idLinkingRequests).then((data) => {
            changeStateSaveData(false, "");
        }, (reason) => {
            changeStateSaveData(false, "");
            swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    render() {
        const { linkRequestsReducer, client, isOpen } = this.props;
        const listObservations = linkRequestsReducer.get('observationsByLinkingRequests');
        return (
            <div>
                <div style={{ overflow: 'hidden', maxHeight: '500px' }} className="modalBt4-body modal-body business-content editable-form-content clearfix"
                    id="modalCreateBoardMembers">
                    <Row style={{ margin: '15px 0px 0px 10px' }}>
                        <Col xs={6} md={3} lg={3}>
                            <span style={{ fontWeight: "bold" }}>Tipo de documento</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span style={{ fontWeight: "bold" }}>Número de documento</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span style={{ fontWeight: "bold" }}>Nombre</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span style={{ fontWeight: "bold", marginLeft: '-7px' }}>Estado de la vinculación</span>
                        </Col>
                    </Row>
                    <Row style={{ margin: "5px 10px 15px 15px" }}>
                        <Col xs={6} md={3} lg={3}>
                            <span>{client.typeOfDocument}</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span>{client.documentClient}</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span>{client.nameClient}</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span>{client.statusLinkRequest}</span>
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
                                onChange={this._validatewhiteList}
                                title="Ingrese las observaciones"
                                style={{ width: '100%', height: '108px' }}
                                error={this.state.errors}
                                max={1000}
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
        getListObservactionsByIdLink,
        swtShowMessage,
        changeStateSaveData,
        clearListObservations,
        saveObservationLinkingRequest
    }, dispatch);
}

function mapStateToProps({ linkRequestsReducer }, ownerProps) {
    return {
        linkRequestsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalObservation);