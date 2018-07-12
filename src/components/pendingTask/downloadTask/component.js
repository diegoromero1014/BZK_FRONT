import React, {Component} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {getCsvBusinessPlanByClient} from '../actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {MESSAGE_ERROR, MESSAGE_DOWNLOAD_DATA, DATE_FORMAT} from '../../../constantsGlobal';
import {TAB_BUSINESS} from '../../viewManagement/constants';
import {getCsvBusinessPlan} from '../actions';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {changeStateSaveData} from '../../dashboard/actions';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import { reduxForm } from 'redux-form';
import { swtShowMessage } from '../../sweetAlertMessages/actions';

const fields = ["initialValidityDate", "finalValidityDate"];

const validate = values => {
    var errors = {};
    return errors;
};

class DownloadTask extends Component {

	constructor(props) {
	  super(props);
  		momentLocalizer(moment);
	  	this._onSelectFieldDate = this._onSelectFieldDate.bind(this);
	  	this.state = {
			initialDateError: null,
            finalDateError: null
	  };
	}
	
	_onSelectFieldDate(valueInitialDate, valueFinalDate) {
        const { swtShowMessage } = this.props;
        const initialDate = _.isNil(valueInitialDate) || _.isEmpty(valueInitialDate) ? null : valueInitialDate;
        const finalDate = _.isNil(valueFinalDate) || _.isEmpty(valueFinalDate) ? null : valueFinalDate;
        if (!_.isNull(initialDate) && !_.isNull(finalDate)) {
            this.setState({
                initialDateError: false,
                finalDateError: false,
            });
            if (moment(initialDate, DATE_FORMAT).isAfter(moment(finalDate, DATE_FORMAT))) {
                swtShowMessage(MESSAGE_ERROR, 'Vigencia de fechas', 'Señor usuario, la fecha inicial tiene que ser menor o igual a la final.');				                
            } else {
				console.log('Fechas correctas');	
			}
        } else {
            if (!_.isNull(initialDate)) {
                this.setState({
                    initialDateError: false
                });
            } else {
                this.setState({
                    finalDateError: false
                });
            }
        }
    }

	
	render() {
		const { fields: {initialValidityDate, finalValidityDate} } = this.props;
		return (
			<div>
				<div style={{height: 'auto'}} className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll">
					<div style={{paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px'}}>
						<span>{'En esta sección podrá descargar algunos campos de las Tareas del usuario.\n Seleccione almenos un estado para las tareas que desea descargar a excel:'}</span>
							<Col xs={12} md={5} lg={5} style={{ paddingRight: "20px" }}>
								<dt>
									<span>Seleccione rango de fechas - DD/MM/YYYY (</span><span style={{ color: "red" }}>*</span>)
								</dt>
                        		<div style={{ display: "flex" }}>
									<DateTimePickerUi
										culture='es'
										format={DATE_FORMAT}
										style={{ width: '200px' }}
										placeholder="Fecha inicial"
										time={false}
										touched={true}
										{...initialValidityDate}
										onSelect={(val) => this._onSelectFieldDate(moment(val).format(DATE_FORMAT), finalValidityDate.value, finalValidityDate, false)}
                                		error={this.state.initialDateError}                                                                
								/>
								<div style={{ marginLeft: '20px' }}>
									<DateTimePickerUi
										culture='es'
										style={{ width: '200px' }}
										format={DATE_FORMAT}
										placeholder="Fecha final"
										time={false}
										touched={true}
										{...finalValidityDate}
										onSelect={(val) => this._onSelectFieldDate(initialValidityDate.value, moment(val).format(DATE_FORMAT), initialValidityDate, false)}
                                    	error={this.state.finalDateError}
									/>
								</div>
                        		</div>
                   			</Col>
						<ul className="ui list" style={{marginLeft:'0px'}}>
							<div className="item"><input name="pending" type="checkbox" onChange={this._checkCheckBox} /> {'Pendiente'}</div>
							<div className="item"><input name="closed" type="checkbox" onChange={this._checkCheckBox} /> {'Cerrada'}</div>
							<div className="item"><input name="cancelled" type="checkbox" onChange={this._checkCheckBox} /> {'Cancelada'}</div>
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
                                    <li>{'Fecha de creación'}</li>
                                </ul>
                            </Col>
                            <Col style={{paddingLeft:'15px'}}>
                                <ul className="ui list">
									<li>{'Fecha de cierre'}</li>
									<li>{'Estado'}</li>
                                    <li>{'Asignado por'}</li>
                                    <li>{'Responsable'}</li>
                                    <li>{'Tarea'}</li>
                                    <li>{'Observaciones'}</li>
                                    <li>{'Posición de usuario que crea'}</li>
                                    <li>{'Posición de usuario responsable'}</li>
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
				changeStateSaveData,
				swtShowMessage
    }, dispatch);
}

export default reduxForm({
    form: 'formBusinessPlanCreate',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(DownloadTask);
