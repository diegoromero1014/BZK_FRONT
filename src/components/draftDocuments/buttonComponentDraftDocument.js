import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../globalComponents/actions';
import ModalDraftDocuments from './modalDraftDocuments';
import {updateStatusModal} from './actions';
import Modal from 'react-modal';
import {COLOR_ITEMS_MENU} from '../menu/constants';
import {Col, Row} from 'react-flexbox-grid';
import {toggleMenu} from '../navBar/actions';

class ButtonComponentDraftDocument extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    openModal() {
        const {updateStatusModal, toggleMenu, menuReducer} = this.props;
        if (menuReducer.get('showCloseMenu')) {
            toggleMenu();
        }
        updateStatusModal(true);
    }

    closeModal() {
        const {updateStatusModal} = this.props;
        updateStatusModal(false);
    }

    componentWillReceiveProps(nextProps) {
        const {draftDocumentsReducer} = nextProps;
        this.setState({
            modalIsOpen: draftDocumentsReducer.get('modalIsOpen')
        });
    }

    render() {
        const {draftDocumentsReducer} = this.props;
        return (
            <Col xs={12} md={6} lg={2} style={{padding: '15px 15px 10px 15px'}}>
                <div style={{
                    color: 'white',
                    backgroundColor: COLOR_ITEMS_MENU,
                    borderColor: COLOR_ITEMS_MENU,
                    borderRadius: '4px 4px 4px 4px',
                    cursor: 'pointer'
                }}
                     onClick={this.openModal}>
                    <div style={{height: '120px'}}>
                        <Row>
                            <Col xs={12} md={12} lg={12} style={{textAlign: 'center'}}>
                                <i className="big file archive outline icon" style={{
                                    fontSize: "50px",
                                    marginTop: '20px',
                                    marginBottom: '5px',
                                    marginLeft: "10px"
                                }}/>
                            </Col>
                            <Col xs={12} md={12} lg={12} style={{textAlign: 'center'}}>
                                <span style={{fontSize: '18px', lineHeight: '1.1em'}}>Documentos en borrador</span>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Modal isOpen={draftDocumentsReducer.get('modalIsOpen')} onRequestClose={this.closeModal}
                       className="modalBt4-fade modal fade contact-detail-modal in">
                    <div className="modalBt4-dialog modalBt4-lg" style={{width: '85%'}}>
                        <div className="modalBt4-content modal-content">
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}}
                                    id="myModalLabel">Mis documentos en borrador</h4>
                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal"
                                        role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i
                                        className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            <ModalDraftDocuments />
                        </div>
                    </div>
                </Modal>
            </Col>
        );
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        redirectUrl,
        updateStatusModal,
        toggleMenu
    }, dispatch);
}

function mapStateToProps({draftDocumentsReducer, menuReducer}, ownerProps) {
    return {
        draftDocumentsReducer,
        menuReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonComponentDraftDocument);
