import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Modal from "react-modal";

import ModalComponentRiskGroup from "./modalComponentRiskGroup";
import { _CLIENT_RISK_GROUP, BIZTRACK_MY_CLIENTS, nombreflujoAnalytics } from "../../constantsAnalytics";

import { hasClientRequest, showModalRiskGroup } from "./actions";
import { showLoading } from "../loading/actions";
import { swtShowMessage } from "../sweetAlertMessages/actions";
import { updateFieldInfoClient } from '../clientInformation/actions';

import { GRAY_COLOR, MESSAGE_LOAD_DATA } from "../../constantsGlobal";
import { validateResponse } from "../../actionsGlobal";

class buttonClientRiskGroup extends Component {

    constructor(props) {
        super(props);

        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.validateHasRiskGroup = this.validateHasRiskGroup.bind(this);
    }

    openModal() {
        this.props.showModalRiskGroup(true);
        window.dataLayer.push({
            'nombreflujo': nombreflujoAnalytics,
            'event': BIZTRACK_MY_CLIENTS + _CLIENT_RISK_GROUP,
            'pagina':_CLIENT_RISK_GROUP

        });
    }

    closeModal() {
        this.props.showModalRiskGroup(false);
    }

    validateHasRiskGroup(fn){
        const { clientInformacion, hasClientRequest, swtShowMessage, showLoading,updateFieldInfoClient,showModalRiskGroup } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        showLoading(true, MESSAGE_LOAD_DATA);

        hasClientRequest(infoClient.id).then((data) => {
            if (validateResponse(data)) {
                let hasRiskGroup = _.get(data, 'payload.data.data');
                if (!hasRiskGroup) {
                    updateFieldInfoClient('riskGroup', null);
                    updateFieldInfoClient('hasRiskGroup', false);
                    showModalRiskGroup(false);
                    swtShowMessage('warning', 'Grupo de riesgo', 'Señor usuario, este cliente no posee ningún grupo de riesgo asignado.');
                }else{
                    fn();
                }
            } else {
                swtShowMessage('error', 'Error consultando grupo de riesgo', 'Señor usuario, ocurrió un error tratando de consultar el grupo de riesgo.');
            }
            showLoading(false, "");
        })
    }

    componentWillMount() {
        this.validateHasRiskGroup(()=>{});
    }

    render() {
        const { riskGroupReducer } = this.props;
        const stateShowModal = riskGroupReducer.get('showModal');
        return (
            <div>
                <button className="btn btn-primary" type="button" title="Ver grupo de riesgo" style={{ marginTop: "0px", backgroundColor: GRAY_COLOR, borderRadius: "0px", height: "50%", float: "right", cursor: 'pointer' }} onClick={this.openModal}>
                    <i className="address book icon" style={{ color: "white", margin: '0em', fontSize: '1.5em' }}></i>
                </button>
                <Modal isOpen={stateShowModal} onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
                    <div className="modalBt4-dialog modalBt4-lg">
                        <div className="modalBt4-content modal-content">
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Grupo de riesgo</h4>
                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            {<ModalComponentRiskGroup validateHasRiskGroup={this.validateHasRiskGroup} isOpen={this.closeModal} />}
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        hasClientRequest,
        showLoading,
        swtShowMessage,
        showModalRiskGroup,
        updateFieldInfoClient
    }, dispatch);
}

function mapStateToProps({ riskGroupReducer, clientInformacion }, ownerProps) {
    return {
        riskGroupReducer,
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(buttonClientRiskGroup);
