import React, {
  Component
} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleModalContact} from './actions';
import {Row, Grid, Col} from 'react-flexbox-grid';
import ModalComponentContact from './modalComponentContact';
import Modal from 'react-modal';

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
    const {typeButton} = this.props;
    return (
          <Col xs={2} sm={2} md={typeButton === 1 ? 2 : 1} lg={typeButton === 1 ? 2 : 1}>
          { typeButton === 1 ?
            <button className="btn btn-primary" type="button" title="Crear contacto" style={{float: "right"}} onClick={this.openModal}>
              Crear contacto
            </button>
            :
            <button className="btn btn-primary" type="button" title="Crear contacto" style={{float: "right"}} onClick={this.openModal}>
              <i className="add user icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
            </button>
          }
            <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                className="modalBt4-fade modal fade contact-detail-modal in">
                <div className="modalBt4-dialog modalBt4-lg">
                    <div className="modalBt4-content modal-content">
                        <div className="modalBt4-header modal-header">
                          <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Contacto</h4>
                        <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                          <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                          <span className="sr-only">Close</span>
                        </button>
                        </div>
                          <ModalComponentContact isOpen={this.closeModal}/>
                          </div>
                      </div>
                  </Modal>
          </Col>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    toggleModalContact
  }, dispatch);
}

function mapStateToProps({createContactReducer}, ownerProps){
    return {
        createContactReducer
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(BotonCreateContactComponent);
