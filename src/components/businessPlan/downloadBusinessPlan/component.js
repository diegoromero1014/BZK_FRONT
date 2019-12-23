import React, {Component} from 'react';
import {Row, Col} from 'react-flexbox-grid';

import {getCsvBusinessPlanByClient} from '../actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {APP_URL, MESSAGE_DOWNLOAD_DATA} from '../../../constantsGlobal';
import {TAB_BUSINESS} from '../../viewManagement/constants';
import {getCsvBusinessPlan} from '../actions';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {changeStateSaveData} from '../../dashboard/actions';

class DownloadBusinessPlan extends Component {

	constructor(props) {
	  super(props);
  		momentLocalizer(moment);
	  this._checkCheckBox = this._checkCheckBox.bind(this);
	  this._downloadBusinessPlans = this._downloadBusinessPlans.bind(this);
	  this.state = {
	  	haveNeeds: false
	  };
	}

	_checkCheckBox(event) {
		if (event.target.name === 'haveNeeds') {
			this.setState({haveNeeds: !this.state.haveNeeds});
		}
	}

	_downloadBusinessPlans() {
		let year;
		let url;
		const {changeStateSaveData, getCsvBusinessPlanByClient, isOpen, itemSeletedModal, yearModal, getCsvBusinessPlan} = this.props;
		changeStateSaveData(true, MESSAGE_DOWNLOAD_DATA);
		if(TAB_BUSINESS === itemSeletedModal) {
			year = yearModal !== undefined && yearModal !== '' ? yearModal : moment().year();
		  	url = '/getCsvBusinessPlan';
			getCsvBusinessPlan(year, this.state.haveNeeds).then(function(data) {
				 if (data.payload.data.status === 200) {
				 	window.open(APP_URL + '/getExcelReport?filename=' + data.payload.data.data.filename + '&id=' + data.payload.data.data.sessionToken, '_blank');
				 }
				 changeStateSaveData(false, "");
			});
		} else {
			getCsvBusinessPlanByClient(window.sessionStorage.getItem('idClientSelected'), this.state.haveNeeds).then(function(data) {
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
					<div style={{paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px'}}>
						<span>{'En esta sección podrá descargar algunos campos  de los "informes de plan de negocio" del cliente.\n Seleccione los campos que desea descargar a excel:'}</span>
						<ul className="ui list" style={{marginLeft:'0px'}}>
							<div className="item"><input name="haveNeeds" type="checkbox" onChange={this._checkCheckBox} /> {'Necesidades'}</div>
						</ul>
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
                                    <li>{'Fecha'}</li>
                                </ul>
                            </Col>
                            <Col style={{paddingLeft:'15px'}}>
                                <ul className="ui list">
									<li>{'Objetivo del plan'}</li>
                                    <li>{'Oportunidades y amenazas externas de la compañía'}</li>
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
					<button type="submit" className="btn btn-primary modal-button-edit" onClick={this._downloadBusinessPlans}>{'Descargar '}<i className="file excel outline icon"></i></button>
				</div>
			</div>
		);
	}
}

function mapStateToProps({businessPlanReducer}, ownerProps) {
  return {
    businessPlanReducer
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCsvBusinessPlanByClient,
				getCsvBusinessPlan,
				changeStateSaveData
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadBusinessPlan);
