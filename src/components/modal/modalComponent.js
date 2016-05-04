import React, {Component,PropTypes} from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import {toggleModal} from './action';
import {bindActionCreators} from 'redux';
import * as views from './constants';
import ContactDetailsModalComponent from '../contact/contactDetail/contactDetailsModalComponent';

class ModalComponentDialog extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.state = {
          modalIsOpen: false  
        };
          this._contectViewModal = this._contectViewModal.bind(this);
        }
  
    openModal(){
    this.setState({modalIsOpen: true});
    }

    closeModal(){
    this.setState({modalIsOpen: false});
    } 

    _contectViewModal(actions, idx){
      var cell;
      switch (actions.component) {
        case views.VIEW_CONTACT:
          {/* Listas */}

          {/* /Listas */}
          const {closeModal} = this.props;
          cell = <ContactDetailsModalComponent contactId={actions.id} isOpen={this.closeModal} />
          break;
      }

      return (cell);
    }


    render() {
        const modalTitle = this.props.modalTitle;
        const actions = this.props.actions;
        return (
        <td style={{padding: '10px', textAlign: 'center'}}><button className="btn btn-primary btn-sm" onClick={this.openModal}>
          <i className="zoom icon" style={{margin:'0em', fontSize : '1.2em'}} />
        </button>
          <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              className="modalBt4-fade modal fade contact-detail-modal in">

            <div className="modalBt4-dialog modalBt4-lg">
              <div className="modalBt4-content modal-content">
                <div className="modalBt4-header modal-header">
                  <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                    <span className="sr-only">Close</span>
                  </button>
                  <h4 className="modal-title" id="myModalLabel">{modalTitle}</h4>
                </div>
                {this._contectViewModal(actions)}
              </div>
            </div>
          </Modal>
        </td>
      );
    }
}

function mapStateToProps({modal},{idModal}) {
    return {
        modalStatus: modal.get('modalState')
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleModal
    }, dispatch);
}

ModalComponentDialog.propTypes = {
   modalTitle: PropTypes.string,
   actions:PropTypes.object
};


export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentDialog);
