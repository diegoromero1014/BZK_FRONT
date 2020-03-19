import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { getXlsTask } from '../actions';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import moment from 'moment';

import momentLocalizer from 'react-widgets/lib/localizers/moment';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import MultipleSelect from '../../../ui/multipleSelect/multipleSelectComponent';

import { changeStateSaveData } from '../../dashboard/actions';
import { getMasterDataFields } from '../../selectsComponent/actions';

import { MESSAGE_ERROR, MESSAGE_DOWNLOAD_DATA, DATE_FORMAT, DATETIME_FORMAT, APP_URL } from '../../../constantsGlobal';
import { TAB_TASKS } from '../../viewManagement/constants';
import { TASK_STATUS } from '../../selectsComponent/constants';


const fields = ["initialValidityDate", "finalValidityDate", "taskStatus"];
var errors = {};
let thisForm;
const validate = (values) => {

	if (!values.initialValidityDate) {
		errors.OPTION_REQUIRED
	} else {
		errors.initialValidityDate = null;
	}

	if (!values.finalValidityDate) {
		errors.OPTION_REQUIRED
	} else {
		errors.finalValidityDate = null;
	}

	if (!values.taskStatus || values.taskStatus === undefined) {
		errors.OPTION_REQUIRED
	} else {
		errors.taskStatus = null;
	}
	
	return errors;
};

class DownloadTask extends Component {

	constructor(props) {
		super(props);
		momentLocalizer(moment);
		this._onSelectFieldDate = this._onSelectFieldDate.bind(this);
		this._downloadTask = this._downloadTask.bind(this);
		this.state = {
			pending: false,
			closed: false,
			cancelled: false,
			initialDateError: null,
			finalDateError: null,
			statusError: null
		};
		thisForm = this;
	}

	componentWillMount() {
		const { getMasterDataFields } = this.props;
		getMasterDataFields([TASK_STATUS]);
	}

	_downloadTask() {
		const { fields: { initialValidityDate, finalValidityDate, taskStatus }, changeStateSaveData, getXlsTask, swtShowMessage, itemSeletedModal } = this.props;
		let errorInForm = false;

		const states = JSON.parse('[' + ((taskStatus.value) ? taskStatus.value : "") + ']');
		if (_.isNil(initialValidityDate.value) || _.isEmpty(initialValidityDate.value) || !moment(initialValidityDate.value, 'DD/MM/YYYY').isValid()) {
			errorInForm = true;
			this.setState({
				initialDateError: "Debe seleccionar una fecha"
			});
		}

		if (_.isNil(finalValidityDate.value) || _.isEmpty(finalValidityDate.value) || !moment(finalValidityDate.value, 'DD/MM/YYYY').isValid()) {
			errorInForm = true;
			this.setState({
				finalDateError: "Debe seleccionar una fecha"
			});
		}

		if (!taskStatus.value) {
			errorInForm = true;
			this.setState({
				statusError: "Debe seleccionar al menos un estado"
			});
		}

		if (!errorInForm) {
			changeStateSaveData(true, MESSAGE_DOWNLOAD_DATA);
			if (TAB_TASKS === itemSeletedModal) {
				getXlsTask(initialValidityDate.value, finalValidityDate.value, states).then(function (data) {
					if (data.payload.data.status === 200) {
						window.open(APP_URL + '/getExcelReport?filename=' + data.payload.data.data.filename + '&id=' + data.payload.data.data.sessionToken, '_blank');
					}
					changeStateSaveData(false, "");
				});
			}
		} else {
			swtShowMessage(MESSAGE_ERROR, 'Campos obligatorios', 'Señor usuario, para descargar las tareas debe ingresar los campos obligatorios.');
		}
	}

	_onSelectFieldDate(valueInitialDate, valueFinalDate) {
		const { swtShowMessage, fields: { finalValidityDate } } = this.props;
		const initialDate = _.isNil(valueInitialDate) || _.isEmpty(valueInitialDate) ? null : valueInitialDate;
		const finalDate = _.isNil(valueFinalDate) || _.isEmpty(valueFinalDate) ? null : valueFinalDate;
		if (!_.isNull(initialDate) && !_.isNull(finalDate)) {
			this.setState({
				initialDateError: false,
				finalDateError: false,
			});
			if (moment(initialDate, DATE_FORMAT).isAfter(moment(finalDate, DATE_FORMAT))) {
				swtShowMessage(MESSAGE_ERROR, 'Rango de fechas', 'Señor usuario, la fecha inicial tiene que ser menor o igual a la final.');
				setTimeout(() => { finalValidityDate.onChange('') }, 1000);
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
		const { fields: { initialValidityDate, finalValidityDate, taskStatus }, selectsReducer } = this.props;
		return (
			<div>
				<div style={{ height: 'auto' }} className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll">
					<div style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px' }}>
						<span>{'En esta sección podrá descargar algunos campos de las Tareas del usuario.\n Seleccione al menos un estado para las tareas que desea descargar a excel:'}</span>
						<Col>
							<dt>
								<span>Seleccione rango de fechas en el que desea el archivo - DD/MM/YYYY (</span><span style={{ color: "red" }}>*</span>)
								</dt>
							<div style={{ display: "flex" }}>
								<DateTimePickerUi
									{...initialValidityDate}
									culture='es'
									format={DATE_FORMAT}
									style={{ width: '200px' }}
									placeholder="Fecha inicial"
									time={false}
									touched={true}
									onSelect={(val) => this._onSelectFieldDate(moment(val).format(DATETIME_FORMAT), finalValidityDate.value, finalValidityDate, false)}
									error={this.state.initialDateError}
								/>
								<div style={{ marginLeft: '20px' }}>
									<DateTimePickerUi
										{...finalValidityDate}
										culture='es'
										style={{ width: '200px' }}
										format={DATE_FORMAT}
										placeholder="Fecha final"
										time={false}
										touched={true}
										onSelect={(val) => this._onSelectFieldDate(initialValidityDate.value, moment(val).format(DATETIME_FORMAT), initialValidityDate, false)}
										error={this.state.finalDateError}
									/>
								</div>
							</div>
						</Col>
						<div>
							<Row>
								<Col xs>
									<dl style={{ width: '100%' }}>
										<dt><span>Estados (</span><span style={{ color: "red" }}>*</span>)</dt>
										<dd><MultipleSelect name="taskStatus" labelInput="Seleccione"
											{...taskStatus}
											valueProp={'id'}
											textProp={'key'}
											data={selectsReducer.get('taskStatus') || []}
											touched={true}
											error={this.state.statusError}
											onChange={() => { this.setState({ statusError: null }) }}
										/></dd>
									</dl>
								</Col>
							</Row>
						</div>
						<span>{'Adicional a los campos seleccionados, en el excel encontrará los siguiente campos:'}</span>
						<Row style={{ margin: '10px' }}>
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
							<Col style={{ paddingLeft: '15px' }}>
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
					<button type="submit" className="btn btn-primary modal-button-edit" onClick={this._downloadTask}>{'Descargar '}<i className="file excel outline icon"></i></button>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ businessPlanReducer, selectsReducer }, ownerProps) {
	return {
		businessPlanReducer,
		selectsReducer
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getXlsTask,
		changeStateSaveData,
		swtShowMessage,
		getMasterDataFields
	}, dispatch);
}

export default reduxForm({
	form: 'formBusinessPlanCreate',
	fields,
	validate,
	onSubmitFail: () => {
		document.getElementById('modalComponentScroll').scrollTop = 0;
		const { swtShowMessage } = thisForm.props;
		swtShowMessage(MESSAGE_ERROR, "Campos obligatorios", "Señor usuario, para descargar las tareas debe ingresar los campos obligatorios.");
	}
}, mapStateToProps, mapDispatchToProps)(DownloadTask);