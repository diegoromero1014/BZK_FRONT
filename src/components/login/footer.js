import React, {Component} from 'react';
import ImageLogoApp from '../globalComponents/logoApplication';
import {ACTIVE_LOGS} from '../../constantsGlobal';
import Modal from 'react-modal';
import ModalComponentAgent from '../agent/modalComponent';

const style = {
  width: "50px"
};
class Footer extends Component{

  constructor(props){
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this._clickButtonActiveLogs = this._clickButtonActiveLogs.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  openModal(){
    this.setState({modalIsOpen: true});
  }

  closeModal(){
    this.setState({modalIsOpen: false});
  }

  _clickButtonActiveLogs(){
    var response = prompt("Está es una opción solo para el personal administrativo, por favor ingrese la clave requerida");
    if( response === ACTIVE_LOGS ){
      this.setState({
        modalIsOpen: true
      });
    }
  }
  render(){
    return(
      <footer className="welcome-footer">
					<div className="footer-left">
						<ImageLogoApp style={style}/>
						<div className="copywrite" style={{display: '-webkit-inline-box'}}>Copyright © 2016 Grupo Bancolombia <br /> Todos los derechos reservados
              <div style={{height: '15px', width: '15px'}} onClick={this._clickButtonActiveLogs}></div>
            </div>
					</div>
          <Modal isOpen={this.state.modalIsOpen} contentLabel=" " onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
            <div className="modalBt4-dialog modalBt4-lg">
              <div className="modalBt4-content modal-content" style={{width: '400px'}}>
                <div className="modalBt4-header modal-header">
                  <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Agentes</h4>
                  <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                    <span className="modal-title" aria-hidden="true" role="close">
                      <i className="remove icon modal-icon-close" role="close"/>
                    </span>
                    <span className="sr-only">Close</span>
                  </button>
                </div>
                <ModalComponentAgent isOpen={this.closeModal} />
              </div>
            </div>
          </Modal>
			</footer>
    );
  }
}

export default Footer;
