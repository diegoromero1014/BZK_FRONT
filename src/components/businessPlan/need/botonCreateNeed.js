import React, {Component} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import ModalNeed from './modalNeed';
import Modal from 'react-modal';

class BotonCreateNeed extends Component {

  constructor(props){
      super(props);
      this.closeModal = this.closeModal.bind(this);
      this.openModal = this.openModal.bind(this);
      this.state = {
        modalIsOpen: false
      };
  }

  openModal(e){
    e.preventDefault();
    this.setState({modalIsOpen: true});
  }

  closeModal(e){
    this.setState({modalIsOpen: false});
  }

  render() {
    const {disabled} = this.props;
    return (
      <Col xsOffset={1} mdOffset={9} lgOffset={9} xs={12} md={3} lg={3}>
        <div style={{marginLeft: "17px"}}>
          <button className="btn btn-primary" disabled={disabled} onClick={this.openModal} style={{float: 'right',cursor: 'pointer'}}>
            <i className="white plus icon"></i> Agregar necesidad
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            className="modalBt4-fade modal fade contact-detail-modal in">
            <div className="modalBt4-dialog modalBt4-lg">
              <div className="modalBt4-content modal-content">
                <div className="modalBt4-header modal-header">
                    <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Necesidad</h4>
                    <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                      <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                      <span className="sr-only">Close</span>
                    </button>
                </div>
                <ModalNeed isOpen={this.closeModal}/>
              </div>
            </div>
          </Modal>
        </div>
      </Col>
    );
  }
}

export default BotonCreateNeed;
