import React, {Component} from 'react';

class ButtonDownloadPipelineComponent extends Component {

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
			</div>
		);
	}
}

export default ButtonDownloadPipelineComponent;
