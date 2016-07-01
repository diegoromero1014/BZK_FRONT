import React, {Component} from 'react';
import Modal from 'react-modal';
import ModalDownloadPrevisit from './component';

class ButtonCreateDownloadPrevisitModal extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	modalIsOpen: false
	  };
	  this.openModal = this.openModal.bind(this);
	  this.closeModal = this.closeModal.bind(this);
	}

	openModal() {
		this.setState({modalIsOpen: true});
	}

	closeModal() {
		this.setState({modalIsOpen: false});
	}

	render() {
		return (
			<div style={{marginLeft: '-20px', position: 'fixed', border: '1px solid rgb(194, 194, 194)', bottom: '0px', width: '100%', marginBottom: '0px', height: '50px', background: 'rgba(255, 255, 255, 0.74902)'}}>
				<div style={{width: '580px', height: '100%', position: 'fixed', right: '0px'}}>
					<button className="btn" style={{float: 'right', margin: '8px 0px 0px 400px', position: 'fixed'}} title={'Exportar en formato CSV'} onClick={this.openModal}>
						<span style={{color: '#FFFFFF', padding: '10px'}}>{'Descargar '}<i className="file excel outline icon"></i></span>
					</button>
				</div>
				<Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
					<div className="modalBt4-dialog">
						<div className="modalBt4-content modal-content">
							<div className="modalBt4-header modal-header">
								<h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">{'Opciones'}</h4>
								<button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
									<span className="modal-title" aria-hidden="true" role="close">
										<i className="remove icon modal-icon-close" role="close"></i>
									</span>
									<span className="sr-only">Close</span>
								</button>
							</div>
							<ModalDownloadPrevisit isOpen={this.closeModal} />
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

export default ButtonCreateDownloadPrevisitModal;