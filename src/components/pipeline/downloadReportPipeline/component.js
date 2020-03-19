import React, { Component } from 'react';
import { Col, Row } from 'react-flexbox-grid';
import { getPipelineXls } from '../../managementView/actions';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import moment from 'moment';

import momentLocalizer from 'react-widgets/lib/localizers/moment';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import { swtShowMessage } from '../../sweetAlertMessages/actions';

import { changeStateSaveData } from '../../main/actions';
import { getMasterDataFields } from '../../selectsComponent/actions';

import { TAB_PIPELINE } from '../../managementView/constants';
import {
    MESSAGE_ERROR,
    DATE_FORMAT,
    DATETIME_FORMAT
} from '../../../constantsGlobal';

const fields = ["initialValidityDate", "finalValidityDate", "taskStatus"];
let thisForm;

export class DownloadPipeline extends Component {

    constructor(props) {
        super(props);
        momentLocalizer(moment);
        this.onSelectFieldDate = this.onSelectFieldDate.bind(this);
        this.downloadPipeline = this.downloadPipeline.bind(this);
        this.state = {
            initialDateError: null,
            finalDateError: null,
            statusError: null
        };
        thisForm = this;
    }

    downloadPipeline = () => {
        const {fields: {initialValidityDate, finalValidityDate}, dispatchChangeStateSaveData, dispatchSwtShowMessage, dispatchGetPipelineXls, itemSelectedModal} = this.props;
        let errorInForm = false;

        if (_.isNil(initialValidityDate.value) || _.isEmpty(initialValidityDate.value) || !moment(initialValidityDate.value, 'DD/MM/YYYY').isValid()) {
            errorInForm = true;
            this.setState({
                initialDateError: "Debe seleccionar una fecha"
            });
        } else if (_.isNil(finalValidityDate.value) || _.isEmpty(finalValidityDate.value) || !moment(finalValidityDate.value, 'DD/MM/YYYY').isValid()) {
            errorInForm = true;
            this.setState({
                finalDateError: "Debe seleccionar una fecha"
            });
        }

        if (!errorInForm) {
            if (TAB_PIPELINE === itemSelectedModal) {
                dispatchGetPipelineXls(initialValidityDate.value, finalValidityDate.value, dispatchChangeStateSaveData);
            }
        } else {
            dispatchSwtShowMessage(MESSAGE_ERROR, 'Campos obligatorios', 'Señor usuario, para descargar las tareas debe ingresar los campos obligatorios.');
        }
    }

    onSelectFieldDate = (valueInitialDate, valueFinalDate) => {
        const {dispatchSwtShowMessage, fields: {finalValidityDate}} = this.props;
        const initialDate = _.isNil(valueInitialDate) || _.isEmpty(valueInitialDate) ? null : valueInitialDate;
        const finalDate = _.isNil(valueFinalDate) || _.isEmpty(valueFinalDate) ? null : valueFinalDate;
        if (!_.isNull(initialDate) && !_.isNull(finalDate)) {
            this.setState({
                initialDateError: false,
                finalDateError: false,
            });
            if (moment(initialDate, DATE_FORMAT).isAfter(moment(finalDate, DATE_FORMAT))) {
                dispatchSwtShowMessage(MESSAGE_ERROR, 'Rango de fechas', 'Señor usuario, la fecha inicial tiene que ser menor o igual a la final.');
                setTimeout(() => {
                    finalValidityDate.onChange('')
                }, 1000);
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
        const {fields: {initialValidityDate, finalValidityDate}} = this.props;
        return (
            <div>
                <div style={{height: 'auto'}}
                     className="modalBt4-body modal-body business-content editable-form-content clearfix"
                     id="modalComponentScroll">
                    <div style={{paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px'}}>
                        <span><b>{'En esta sección podrá descargar los pipelines:'}</b></span>
                        <br/>
                        <Col>
                            <dt>
                                <span>Seleccione rango de fechas en el que desea el archivo - Día/Mes/Año (</span><span
                                style={{color: "red"}}>*</span>)
                            </dt>
                        </Col>
                        <br/>
                        <Col>
                            <div style={{display: "flex"}}>
                                <DateTimePickerUi
                                    {...initialValidityDate}
                                    culture='es'
                                    format={DATE_FORMAT}
                                    style={{width: '200px'}}
                                    placeholder="Fecha inicial"
                                    time={false}
                                    touched={true}
                                    onSelect={(val) => this.onSelectFieldDate(moment(val).format(DATETIME_FORMAT), finalValidityDate.value, finalValidityDate, false)}
                                    error={this.state.initialDateError}
                                />
                                <div style={{marginLeft: '20px', marginBottom: '20px'}}>
                                    <DateTimePickerUi
                                        {...finalValidityDate}
                                        culture='es'
                                        style={{width: '200px'}}
                                        format={DATE_FORMAT}
                                        placeholder="Fecha final"
                                        time={false}
                                        touched={true}
                                        onSelect={(val) => this.onSelectFieldDate(initialValidityDate.value, moment(val).format(DATETIME_FORMAT), initialValidityDate, false)}
                                        error={this.state.finalDateError}
                                    />
                                </div>
                            </div>
                        </Col>
                        <span><b>{'En el excel encontrará los siguientes campos:'}</b></span>
                        <div style={{paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px'}}>
                            <Row>
                                <Col>
                                    <ul className="ui list">
                                        <li>{'Identificador del Pipeline'}</li>
                                        <li>{'Identificador del Pipeline padre'}</li>
                                        <li>{'Tipo de Pipeline'}</li>
                                        <li>{'Oportunidades comerciales'}</li>
                                        <li>{'Tipo de documento'}</li>
                                        <li>{'Número de documento'}</li>
                                        <li>{'Razón social'}</li>
                                        <li>{'Grupo económico'}</li>
                                        <li>{'Gerente de cuenta'}</li>
                                        <li>{'Célula'}</li>
                                        <li>{'Región'}</li>
                                        <li>{'Zona'}</li>
                                        <li>{'Nombre de la oportunidad'}</li>
                                        <li>{'Familia de productos'}</li>
                                        <li>{'Necesidad'}</li>
                                        <li>{'Producto'}</li>
                                        <li>{'Estado'}</li>
                                        <li>{'Empleado responsable'}</li>
                                        <li>{'Tipo de poliza'}</li>
                                        <li>{'Indexación'}</li>
                                        <li>{'Interés/Spread'}</li>
                                        <li>{'Categoría del negocio'}</li>
                                        <li>{'Probabilidad'}</li>
                                    </ul>
                                </Col>
                                <Col style={{paddingLeft: '25px'}}>
                                    <ul className="ui list">
                                        <li>{'Periodo de maduración'}</li>
                                        <li>{'Activo'}</li>
                                        <li>{'Valor Activo proyecto'}</li>
                                        <li>{'Roe'}</li>
                                        <li>{'Margen'}</li>
                                        <li>{'SVA'}</li>
                                        <li>{'Nit Pivote'}</li>
                                        <li>{'Justificación'}</li>
                                        <li>{'Libros'}</li>
                                        <li>{'Observaciones'}</li>
                                        <li>{'Plazo'}</li>
                                        <li>{'Plazo valor'}</li>
                                        <li>{'Moneda'}</li>
                                        <li>{'Valor nominal'}</li>
                                        <li>{'Pendiente por desembolsar'}</li>
                                        <li>{'Creado por'}</li>
                                        <li>{'Posición usuario creador'}</li>
                                        <li>{'Fecha de creación'}</li>
                                        <li>{'Actualizado por'}</li>
                                        <li>{'Posición usuario modificador'}</li>
                                        <li>{'Fecha de actualización'}</li>
                                        <li>{'Valor de desembolso'}</li>
                                        <li>{'Fecha de desembolso'}</li>
                                        <li>{'Detalle Justificación'}</li>
                                    </ul>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="submit" className="btn btn-primary modal-button-edit"
                            onClick={this.downloadPipeline}>{'Descargar '}<i className="file excel outline icon"></i>
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({businessPlanReducer, selectsReducer}) => {
    return {
        businessPlanReducer,
        selectsReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        dispatchGetPipelineXls: getPipelineXls,
        dispatchChangeStateSaveData: changeStateSaveData,
        dispatchSwtShowMessage: swtShowMessage,
        dispatchGetMasterDataFields: getMasterDataFields
    }, dispatch);
}

export default reduxForm({
    form: 'formBusinessPlanCreate',
    fields,
    onSubmitFail: () => {
        document.getElementById('modalComponentScroll').scrollTop = 0;
        const { dispatchSwtShowMessage } = thisForm.props;
        dispatchSwtShowMessage(MESSAGE_ERROR, "Campos obligatorios", "Señor usuario, para descargar las tareas debe ingresar los campos obligatorios.");
    }
}, mapStateToProps, mapDispatchToProps)(DownloadPipeline);