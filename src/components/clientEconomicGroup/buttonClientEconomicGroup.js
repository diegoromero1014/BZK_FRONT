import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import Modal from 'react-modal';
import ModalComponentEconomicGroup from './modalComponentEconomicGroup';
import {BLUE_COLOR} from '../../constantsGlobal';
import { nombreflujoAnalytics, _ECONOMIC_GROUP, BIZTRACK_MY_CLIENTS } from '../../constantsAnalytics';

class buttonClientEconomicGroup extends Component {

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
    window.dataLayer.push({
      'nombreflujo': nombreflujoAnalytics,
      'event': BIZTRACK_MY_CLIENTS + _ECONOMIC_GROUP,
      'pagina':_ECONOMIC_GROUP

    });
  }

  closeModal(){
    this.setState({modalIsOpen: false});
  }

  render() {
    return (
        <div>
          <button className="btn btn-primary" type="button" title="Ver grupo económico" style={{marginTop: "0px", backgroundColor: BLUE_COLOR, borderRadius: "0px", height:"50%", float:"right", cursor: 'pointer'}} onClick={this.openModal}>
            <i className="sitemap icon" style={{color: "white",margin:'0em', fontSize : '1.5em'}}></i>
          </button>
          <Modal isOpen={this.state.modalIsOpen} contentLabel="Grupo económico" onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
            <div className="modalBt4-dialog modalBt4-lg">
              <div className="modalBt4-content modal-content">
                <div className="modalBt4-header modal-header">
                  <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Grupo económico</h4>
                  <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                    <span className="sr-only">Close</span>
                  </button>
                </div>
                <ModalComponentEconomicGroup isOpen={this.closeModal} />
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

function mapStateToProps({clientEconomicGroupReducer}, ownerProps){
    return {
        clientEconomicGroupReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(buttonClientEconomicGroup);
