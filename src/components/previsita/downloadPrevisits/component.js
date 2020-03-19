import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TAB_PREVISIT, TYPE_YEAR } from '../../managementView/constants';
import { getCsv } from '../../managementView/actions';
import { APP_URL, MESSAGE_DOWNLOAD_DATA } from '../../../constantsGlobal';
import { getCsvPreVisitsByClient } from '../actions';
import moment from 'moment';
import { changeStateSaveData } from '../../main/actions';
import SelectYearComponent from '../../selectsComponent/selectFilterYear/selectYearComponent';

class DownloadPrevisits extends Component {

	constructor(props) {
	  super(props);

	  this._checkCheckBox = this._checkCheckBox.bind(this);
	  this._downloadPreVisits = this._downloadPreVisits.bind(this);
	  this.state = {
	  	hasParticipatingContacts: false,
	  	hasParticipatingEmployees: false,
		  hasRelatedEmployees: false,
		  year: ''
	  };
	}

	_checkCheckBox(event) {
		if (event.target.name === 'participatingContacts') {
			this.setState({hasParticipatingContacts: !this.state.hasParticipatingContacts});
		}
		if (event.target.name === 'participatingEmployees') {
			this.setState({hasParticipatingEmployees: !this.state.hasParticipatingEmployees});
		}
		if (event.target.name === 'relatedEmployees') {
			this.setState({hasRelatedEmployees: !this.state.hasRelatedEmployees});
		}
	}

	_downloadPreVisits() {
		let year;
		let url;
		const {changeStateSaveData, getCsvPreVisitsByClient, isOpen, itemSelectedModal, getCsv } = this.props;
		changeStateSaveData(true, MESSAGE_DOWNLOAD_DATA);
		if (itemSelectedModal === TAB_PREVISIT) {
			year = this.state.year !== '' ? this.state.year : moment().year();
			url = '/getCsvPreVisits';
			getCsv(year, url, this.state.hasParticipatingContacts, this.state.hasParticipatingEmployees, this.state.hasRelatedEmployees).then(function(data) {
				changeStateSaveData(false, "");
				if (data.payload.data.status === 200) {
					window.open(APP_URL + '/getExcelReport?filename=' + data.payload.data.data.filename + '&id=' + data.payload.data.data.sessionToken, '_blank');
				}
			});
		} else {
			getCsvPreVisitsByClient(window.sessionStorage.getItem('idClientSelected'), this.state.hasParticipatingContacts, this.state.hasParticipatingEmployees, this.state.hasRelatedEmployees).then(function(data) {
				changeStateSaveData(false, "");
				if (data.payload.data.status === 200) {
					window.open(APP_URL + '/getExcelReport?filename=' + data.payload.data.data.filename + '&id=' + data.payload.data.data.sessionToken, '_blank');
					isOpen();
				}
			});
		}
	}

	render() {
		return (
			<div>
				<div style={{height: 'auto'}} className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll">
					<div style={{paddingLeft:'20px', paddingRight:'20px', paddingTop: '20px'}}>
						<span>{'En esta sección podrá descargar algunos campos de los informes de previsita del cliente.\n Seleccione los campos que desea descargar a excel:'}</span>
						<div style={{ width: '100%'}}>
							<SelectYearComponent 
								idTypeFilter={TYPE_YEAR} 
								config={{ onChange: (value) => this.setState({ year: value.id }) }} 
							/>
						</div>
						<ul className="ui list" style={{marginLeft:'0px'}}>
							<div className="item"><input name="participatingContacts" type="checkbox" onChange={this._checkCheckBox} /> {'Participantes en la reunión por parte del cliente'}</div>
							<div className="item"><input name="participatingEmployees" type="checkbox" onChange={this._checkCheckBox} /> {'Participantes en la reunión por parte del Grupo Bancolombia'}</div>
							<div className="item"><input name="relatedEmployees" type="checkbox" onChange={this._checkCheckBox} /> {'Otros participantes en la reunión'}</div>
						</ul>
					</div>
					<div style={{paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px'}}>
						<span>{'Adicional a los campos seleccionados, en el excel encontrará los siguiente campos:'}</span>
                        <Row style={{margin:'10px'}}>
                            <Col>
                                <ul className="ui list">
                                    <li>{'Tipo de documento'}</li>
                                    <li>{'Número de documento'}</li>
                                    <li>{'Razón social'}</li>
                                    <li>{'Grupo económico'}</li>
                                    <li>{'Gerente de cuenta'}</li>
                                    <li>{'Célula'}</li>
                                    <li>{'Región'}</li>
                                    <li>{'Zona'}</li>
                                    <li>{'Fecha de la reunión'}</li>
                                </ul>
                            </Col>
                            <Col style={{paddingLeft:'15px'}}>
                                <ul className="ui list">
									<li>{'Tipo de reunión'}</li>
									<li>{'Lugar'}</li>
                                    <li>{'Objetivo'}</li>
                                    <li>{'Creador por'}</li>
                                    <li>{'Posición de usuario que crea'}</li>
                                    <li>{'Fecha creación'}</li>
                                    <li>{'Modificado por'}</li>
                                    <li>{'Posición de usuario que modifica'}</li>
                                    <li>{'Fecha modificación'}</li>
                                </ul>
                            </Col>
                        </Row>
					</div>
					</div>
					<div className="modalBt4-footer modal-footer">
						<button type="submit" className="btn btn-primary modal-button-edit" onClick={this._downloadPreVisits}>{'Descargar '}<i className="file excel outline icon"></i></button>
					</div>
			</div>
		);
	}
}

function mapStateToProps({previsitReducer}, ownerProps) {
  return {
    previsitReducer
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCsvPreVisitsByClient,
				changeStateSaveData,
        getCsv
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPrevisits);
