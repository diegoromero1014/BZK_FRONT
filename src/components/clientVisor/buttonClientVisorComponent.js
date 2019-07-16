import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Modal from "react-modal";
import { consultParameterServer } from '../../actionsGlobal';
import { GREEN_COLOR, MESSAGE_LOAD_DATA } from "../../constantsGlobal";
import { URL_VISOR_PARAMETER, URL_VISOR_DOCUMENT_PARAMETER, URL_VISOR_DOCUMENT_TYPE_PARAMETER } from "./constants";
import { nombreflujoAnalytics, BIZTRACK_MY_CLIENTS, _CLIENT_VISOR } from "../../constantsAnalytics";

class buttonClientVisorComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            visor_url: ""
        };
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    openModal() {
        this.setState({
            modalIsOpen: true
        });
        window.dataLayer.push({
            'nombreflujo': nombreflujoAnalytics,
            'event': BIZTRACK_MY_CLIENTS + _CLIENT_VISOR,
            'pagina':_CLIENT_VISOR

        });
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        })
    }

    componentWillMount() {
        const { consultParameterServer } = this.props;

        consultParameterServer(URL_VISOR_PARAMETER).then((data) => {
            if (data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
                data.payload.data.parameter !== undefined) {

                let parameter = JSON.parse(data.payload.data.parameter).value;

                this.setState({
                    visor_url: parameter
                })
            }
        })

    }


    render() {
        const { clientdIdNumber, clientNameType } = this.props;

        return (
            <div>
                <button className="btn btn-primary" type="button" title="Visor cliente" style={{ marginTop: "0px", backgroundColor: GREEN_COLOR, borderRadius: "0px", height: "50%", float: "right", cursor: 'pointer' }} onClick={this.openModal}>
                    <i className="chart line icon" style={{ color: "white", margin: '0em', fontSize: '1.5em' }}></i>
                </button>
                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
                    <div className="modalBt4-dialog modalBt4-lg" style={{ margin: "0", width: "100vw", height: "100vh" }}>
                        <div className="modalBt4-content modal-content" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <div className="modalBt4-header modal-header" style={{ flexShrink: "0" }}>
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Visor Cliente</h4>
                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            {this.state.modalIsOpen &&
                                <iframe style={{ width: "100%", border: "0", flexGrow: "1" }} src={
                                    this.state.visor_url.replace(URL_VISOR_DOCUMENT_PARAMETER, clientdIdNumber).replace(URL_VISOR_DOCUMENT_TYPE_PARAMETER, clientNameType)
                                }></iframe>
                            }
                        </div>
                    </div>
                </Modal>
            </div >
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultParameterServer
    }, dispatch);
}

function mapStateToProps({ clientInformacion }, ownerProps) {
    return {
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(buttonClientVisorComponent);
