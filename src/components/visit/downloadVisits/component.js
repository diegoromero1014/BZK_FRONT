import React, {Component} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import {getCsvVisitsByClient} from '../actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {APP_URL} from '../../../constantsGlobal';

class DownloadVisits extends Component {

	constructor(props) {
	  super(props);

	  this._checkCheckBox = this._checkCheckBox.bind(this);
	  this._downloadVisits = this._downloadVisits.bind(this);
	  this.state = {
	  	hasParticipatingContacts: false,
	  	hasParticipatingEmployees: false,
	  	hasRelatedEmployees: false
	  };
	}

	_checkCheckBox(event) {
		if (event.target.name === 'participatingContacts') {
			this.setState({hasParticipatingContacts: !this.state.hasParticipatingContacts});
		}
		if (event.target.name === 'participatingEmployees') {
			this.setState({hasParticipatingEmployees: !this.state.hasParticipatingEmployees});
		}
		if (event.target.name == 'relatedEmployees') {
			this.setState({hasRelatedEmployees: !this.state.hasRelatedEmployees});
		}
	}

	_downloadVisits() {
		const {getCsvVisitsByClient, isOpen} = this.props;
		getCsvVisitsByClient(window.localStorage.getItem('idClientSelected'), this.state.hasParticipatingContacts, this.state.hasParticipatingEmployees, this.state.hasRelatedEmployees).then(function(data) {
			if (data.payload.data.status == 200) {
				window.open(APP_URL + '/getCsvReport?filename=' + data.payload.data.data, '_blank');
				isOpen();
			}
		});
	}

	render() {
		return (
			<div>
				<div style={{height: 'auto'}}className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll">
					<div style={{paddingLeft:'20px', paddingRight:'20px', paddingTop: '20px'}}>
					<span>{'En esta sección podrá descargar algunos campos  de los "informes de visita/reunión" del cliente.\n Seleccione los campos que desea descargar a excel:'}</span>
						<ul className="ui list" style={{marginLeft:'0px'}}>
							<div className="item"><input name="participatingContacts" type="checkbox" onChange={this._checkCheckBox} /> {'Participantes en la reunión por parte del cliente'}</div>
							<div className="item"><input name="participatingEmployees" type="checkbox" onChange={this._checkCheckBox} /> {'Participantes en la reunión por parte del Grupo Bancolombia'}</div>
							<div className="item"><input name="relatedEmployees" type="checkbox" onChange={this._checkCheckBox} /> {'Otros participantes en la reunión'}</div>
						</ul>
					</div>
					<div style={{paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px'}}>
						<span>{'Adicional a los campos seleccionados, en el excel encontrará los siguiente campos:'}</span>
						<ul className="ui list">
							<li>{'Tipo de documento'}</li>
							<li>{'Número de documento'}</li>
							<li>{'Razón social'}</li>
							<li>{'Gerente de cuenta'}</li>
							<li>{'Célula'}</li>
							<li>{'Fecha de la reunión'}</li>
							<li>{'Tipo de reunión'}</li>
						</ul>
					</div>
				</div>
				<div className="modalBt4-footer modal-footer">
					<button type="submit" className="btn btn-primary modal-button-edit" onClick={this._downloadVisits}>{'Descagar '}<i className="file excel outline icon"></i></button>
				</div>
			</div>
		);
	}
}

function mapStateToProps({visitReducer}, ownerProps) {
  return {
    visitReducer
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCsvVisitsByClient
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadVisits);
//export default DownloadVisits;
