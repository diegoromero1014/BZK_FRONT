import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../globalComponents/actions';
import Modal from 'react-modal';
import ModalComponentPending from './modalComponentPending';
import _ from 'lodash';

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
    this.setState({modalIsOpen: true});
  }

  closeModal(){
    this.setState({modalIsOpen: false});
  }

  render(){
    return(
        <li onClick={this.openModal} className="cursorMenuList">
            <a>
                <i className='big tasks icon'/>
                <div style={{width: "100px", height: "30px"}} >
                  <span className="title">Mis pendientes</span>
                </div>
            </a>
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
        </li>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    redirectUrl,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(ButtonComponentMyPending);
