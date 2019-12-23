import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {showHideModalErros, sendErrorsUpdate} from '../clientDetailsInfo/actions';
import Modal from 'react-modal';

class ModalErrorsUpdateClient extends Component {
  constructor(props){
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal(){
    const {showHideModalErros} = this.props;
    sendErrorsUpdate([]);
    showHideModalErros(false);
  }

  _mapMessageErros(error, index){
    return  <div style={{marginTop: '5px'}}>
              <span key={index} style={{marginLeft: "20px", marginTop: "10px", color: "red", fontSize: "12pt"}}>
                {error}
              </span>
            </div>
  }

  render(){
    const {tabReducer} = this.props;
    const errors = tabReducer.get('errorsMessage');
    return (
      <div>
        <Modal isOpen={tabReducer.get('modalErrorsIsOpen')} onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
          <div className="modalBt4-dialog modalBt4-lg" style={{width: '50%'}}>
              <div className="modalBt4-content modal-content">
                  <div className="modalBt4-header modal-header">
                    <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Errores actualización</h4>
                    <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                      <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                      <span className="sr-only">Close</span>
                    </button>
                  </div>
                  <div style={{margin: '20px 10px 0 20px'}}>
                    {errors.map(this._mapMessageErros)}
                  </div>
              </div>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    showHideModalErros,
    sendErrorsUpdate
  }, dispatch);
}

function mapStateToProps({clientInformacion, tabReducer},ownerProps) {
  return {
    clientInformacion,
    tabReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalErrorsUpdateClient);
