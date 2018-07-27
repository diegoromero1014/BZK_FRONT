import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import ModalComponentTeam from './modalComponentTeam';
import {ORANGE_COLOR} from '../../constantsGlobal';

class buttonTeamComponent extends Component {

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
    const {toggleModalShareholder, disabled} = this.props;
    return (
        <div>
          <button className="btn btn-primary" type="button" title="Ver célula" style={{backgroundColor: ORANGE_COLOR, borderRadius: "0px", height:"50%", float:"right", cursor: 'pointer'}} onClick={this.openModal}>
            <i className="users icon" style={{color: "white",margin:'0em', fontSize : '1.5em'}}/>
          </button>

          <Modal isOpen={this.state.modalIsOpen} contentLabel="Célula" onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
            <div className="modalBt4-dialog modalBt4-lg">
              <div className="modalBt4-content modal-content">
                <div className="modalBt4-header modal-header">
                  <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Célula</h4>
                  <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                    <span className="sr-only">Close</span>
                  </button>
                </div>
                <ModalComponentTeam isOpen={this.closeModal} />
              </div>
            </div>
          </Modal>
        </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps({createShareholder}, ownerProps){
    return {
        createShareholder
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(buttonTeamComponent);
