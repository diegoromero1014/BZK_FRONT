import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../globalComponents/actions';
import Modal from 'react-modal';
import ModalComponentPending from './modalComponentPending';
import {COLOR_ITEMS_MENU} from '../menu/constants';
import {Col, Row} from 'react-flexbox-grid';
import {toggleMenu} from '../navBar/actions';

class ButtonComponentMyPending extends Component {
  constructor(props){
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  openModal(){
    const {toggleMenu} = this.props;
    this.setState({modalIsOpen: true});
    toggleMenu();
  }

  closeModal(){
    this.setState({modalIsOpen: false});
  }

  render(){
    return(
      <Col xs={12} md={6} lg={2} style={{padding: '15px 15px 10px 15px'}}>
        <div style={{color: 'white',  backgroundColor: COLOR_ITEMS_MENU,  borderColor: COLOR_ITEMS_MENU,  borderRadius: '4px 4px 4px 4px', cursor: 'pointer'}}
             onClick={this.openModal}>
          <div style={{height: '120px'}}>
            <Row>
              <Col xs={12} md={12} lg={12} style={{textAlign: 'center'}}>
                <i className="big tasks icon" style={{fontSize: "50px", marginTop: '20px', marginLeft: "10px"}}/>
              </Col>
              <Col xs={12} md={12} lg={12} style={{textAlign: 'center'}}>
                <span style={{ fontSize: '18px', lineHeight: '1.1em'}}>Mis pendientes</span>
              </Col>
            </Row>
          </div>
        </div>
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
          <div className="modalBt4-dialog modalBt4-lg"  style={{width: '88%'}}>
            <div className="modalBt4-content modal-content">
              <div className="modalBt4-header modal-header">
                <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Mis tareas pendientes</h4>
                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                  <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                  <span className="sr-only">Close</span>
                </button>
              </div>
              <ModalComponentPending />
            </div>
          </div>
        </Modal>
      </Col>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    redirectUrl,
    toggleMenu
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(ButtonComponentMyPending);
