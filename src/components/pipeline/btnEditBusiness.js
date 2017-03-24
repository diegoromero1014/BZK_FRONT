import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleModalContact} from './actions';
import {Row, Grid, Col} from 'react-flexbox-grid';
import Modal from 'react-modal';
import {ORIGIN_PIPELIN_BUSINESS} from './constants';
import createFormPipeline from './editPipeline/formEditPipeline';

class BotonCreateContactComponent extends Component {

  constructor(props){
      super(props);
      this.closeModal = this.closeModal.bind(this);
      this.openModal = this.openModal.bind(this);
      this.state = {
        modalIsOpen: false
      };
  }

  openModal(){
    this.setState({modalIsOpen: true});
  }

  closeModal(){
    this.setState({modalIsOpen: false});
  }

  render() {
    const {typeButton, pipelineBusiness} = this.props;
    const PipelineComponent = createFormPipeline(null, ORIGIN_PIPELIN_BUSINESS, pipelineBusiness, this.closeModal);
    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} style={{textAlign: "right"}}>
          <i className="zoom icon" title="Ver detalle" onClick={this.openModal}
            style={{cursor: "pointer"}} />
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            className="modalBt4-fade modal fade contact-detail-modal in">
            <div className="modalBt4-dialog modalBt4-lg">
              <div className="modalBt4-content modal-content">
                <div className="modalBt4-header modal-header">
                  <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="modalBusiness">Negocio</h4>
                  <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                    <span className="sr-only">Close</span>
                  </button>
                </div>
                <PipelineComponent />
              </div>
            </div>
          </Modal>
        </Col>
      </Row>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    toggleModalContact
  }, dispatch);
}

function mapStateToProps({}, ownerProps){
    return {};
}


export default connect(mapStateToProps, mapDispatchToProps)(BotonCreateContactComponent);
