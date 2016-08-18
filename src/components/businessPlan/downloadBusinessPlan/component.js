import React, {Component} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import {getCsvBusinessPlanByClient} from '../actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {APP_URL} from '../../../constantsGlobal';
import {TAB_BUSINESS} from '../../viewManagement/constants';
import {getCsvBusinessPlan} from '../actions';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';

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
		const {getCsvBusinessPlanByClient, isOpen, itemSeletedModal, yearModal, getCsvBusinessPlan} = this.props;
		console.log('_downloadBusinessPlans');
		if(TAB_BUSINESS === itemSeletedModal) {
			year = yearModal !== '' ? yearModal : moment().year();
		  	url = '/getCsvBusinessPlan';
			getCsvBusinessPlan(year, this.state.haveNeeds).then(function(data) {
					 if (data.payload.data.status === 200) {
					 	window.open(APP_URL + '/getCsvReport?filename=' + data.payload.data.data, '_blank');
					 }
				});
		} else {
			getCsvBusinessPlanByClient(window.localStorage.getItem('idClientSelected'), this.state.haveNeeds).then(function(data) {
				if (data.payload.data.status === 200) {
					window.open(APP_URL + '/getCsvReport?filename=' + data.payload.data.data, '_blank');
					isOpen();
				}
			});
		}
	}

	render() {
		return (
			<div>
				<div style={{height: 'auto'}}className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll">
					<div style={{paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px'}}>
						<span>{'En esta sección podrá descargar algunos campos  de los "informes de plan de negocio" del cliente.\n Seleccione los campos que desea descargar a excel:'}</span>

						<ul className="ui list">
							<li>{'Tipo de documento'}</li>
							<li>{'Número de documento'}</li>
							<li>{'Razón social'}</li>
							<li>{'Grupo económico'}</li>
							<li>{'Gerente de cuenta'}</li>
							<li>{'Célula'}</li>
							<li>{'Fecha'}</li>
							<li>{'Objetivo del plan'}</li>
							<li>{'Oportunidades y Amenazas externas de la Compañía'}</li>
						</ul>
					</div>
					<div style={{paddingLeft:'20px', paddingRight:'20px', paddingTop: '20px'}}>
						<span>{'Adicional a los campos seleccionados, en el excel encontrará los siguiente campos:'}</span>
						<ul className="ui list" style={{marginLeft:'0px'}}>
							<div className="item"><input name="haveNeeds" type="checkbox" onChange={this._checkCheckBox} /> {'Necesidades'}</div>
						</ul>
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
        getCsvBusinessPlanByClient, getCsvBusinessPlan
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadBusinessPlan);
