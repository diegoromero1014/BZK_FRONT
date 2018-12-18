import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { VISOR_CONSOLIDATE_REPORT_URL, VISOR_CONSOLIDATE_TITLE } from './constants';
import { redirectUrl } from '../globalComponents/actions';
import { updateTitleNavBar } from '../navBar/actions';
import { setUrlParameter } from './actions';
import { consultParameterServer } from '../../actionsGlobal';
import Modal from "react-modal";

class VisorConsolidate extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionTokenFront') === "" || window.localStorage.getItem('sessionTokenFront') === undefined) {
            redirectUrl("/login");
        } else {
            const { consultParameterServer, updateTitleNavBar, setUrlParameter } = this.props;
            consultParameterServer(VISOR_CONSOLIDATE_REPORT_URL).then((data) => {
                if (data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
                    data.payload.data.parameter !== undefined) {
                    setUrlParameter(VISOR_CONSOLIDATE_REPORT_URL, JSON.parse(data.payload.data.parameter).value);
                }
            });
        }
    }

    render() {
        const { transactional, closeModal } = this.props;
        return (
            <Modal isOpen={true} onRequestClose={closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
                <div className="modalBt4-dialog modalBt4-lg" style={{ margin: "0", width: "100vw", height: "100vh" }}>
                    <div className="modalBt4-content modal-content" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                        <div className="modalBt4-header modal-header" style={{ flexShrink: "0" }}>
                            <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">{VISOR_CONSOLIDATE_TITLE}</h4>
                            <button type="button" onClick={closeModal} className="close" data-dismiss="modal" role="close">
                                <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                        <iframe style={{ width: "100%", border: "0", flexGrow: "1" }} src={transactional.get(VISOR_CONSOLIDATE_REPORT_URL)}></iframe>
                    </div>
                </div>
            </Modal>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setUrlParameter,        
        consultParameterServer
    }, dispatch);
}

function mapStateToProps({ transactional }) {
    return { transactional };
}

export default connect(mapStateToProps, mapDispatchToProps)(VisorConsolidate);
