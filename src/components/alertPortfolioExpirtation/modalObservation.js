/**
 * Created by Andres Hurtado on 25/04/2017.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import {Row, Col} from 'react-flexbox-grid';
import {clientsPortfolioExpirationFindServer,saveObservationPortfolioExp} from './actions';
import Textarea from '../../ui/textarea/textareaComponent';
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import _ from 'lodash';
import {showLoading} from '../loading/actions';
import {swtShowMessage} from '../sweetAlertMessages/actions';
import {fields, validations as validate} from "./fieldsAndRulesForReduxForm";
import { getMasterDataFields } from "../../components/selectsComponent/actions";

import { ALERT_PORTFOLIO_EXPECTATIONS } from '../selectsComponent/constants';
import ModalClientName from '../globalComponents/modalClientName/component';

let nameExpectations = _.uniqueId('expectations');

export class ModalObservation extends Component {    

    constructor(props) {
        super(props);
        this._handleSaveObservation = this._handleSaveObservation.bind(this);
    }

    _handleSaveObservation() {
        const {isOpen, fields:{observations, expectations}, alertPortfolioExpId, saveObservationPortfolioExp,
            showLoading, swtShowMessage, alertPortfolioExpiration, clientsPortfolioExpirationFindServer} = this.props;
        showLoading(true, 'Guardando...');
        
        if (!_.isEqual(observations.value.trim(), '') && !_.isNull(expectations.value)) {
                const request = {
                    observations: observations.value,
                    expectations: expectations.value
                };                
                saveObservationPortfolioExp(alertPortfolioExpId, request)
                .then((data) => {
                    showLoading(false, null);
                    if (_.isEqual(_.get(data, 'payload.status'), 200)) {
                        // refresh table
                        const keywordNameNit = alertPortfolioExpiration.get('keywordNameNit');
                        const idZone = alertPortfolioExpiration.get('idZone');
                        const order = alertPortfolioExpiration.get('order');
                        const idRegion = alertPortfolioExpiration.get('idRegion');
                        const pageNum = alertPortfolioExpiration.get('pageNum');
                        const columnOrder = alertPortfolioExpiration.get('columnOrder');
                        const idTeam = alertPortfolioExpiration.get('idTeam');
                        clientsPortfolioExpirationFindServer(keywordNameNit,idTeam,idRegion,idZone,pageNum,10,order,columnOrder);
                        isOpen();
                        swtShowMessage('success', 'Edición observaciones', 'Señor usuario, se guardaron correctamente las observaciones.');
                    } else {
                        swtShowMessage('error', 'Edición observaciones', 'Señor usuario, ocurrió un error guardando las observaciones.');
                    }
                }, (reason) => {                
                    showLoading(false, '');
                    swtShowMessage('error', 'Edición observaciones', 'Señor usuario, ocurrió un error guardando las observaciones.');
                });
        }
        else {
            showLoading(false, '');
            swtShowMessage('error', 'Observaciones', 'Señor usuario, las observaciones no pueden estar vacías');
        }
        
        
       
    }

    render() {
        const {fields:{observations, expectations}, handleSubmit, selectsReducer, client} = this.props;                       
        return (
            <div>
                <ModalClientName clientName={client.clientName} typeDocument={client.typeDocument} clientDocument={client.document}></ModalClientName>
                <form onSubmit={handleSubmit(this._handleSaveObservation)}>
                    <div>
                        <div className="modalBt4-body modal-body clearfix"
                            style={{ overflowX: 'hidden', maxHeight: '340px', height: '340px'}}>
                            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                                <Row style={{ paddingTop: '10px' }}>
                                    <Col xs={12} md={12} lg={12}>
                                        <h4>Observaciones (<span style={{ color: "red" }}>*</span>)</h4>
                                        <div>
                                            <Textarea
                                                name="actionArea"
                                                type="text"
                                                style={{ width: '100%', height: '100%', textAlign: 'justify' }}
                                                max="1000"
                                                rows={5}
                                                className="observationsField"
                                                {...observations}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{paddingTop: '10px'}}>
                                    <Col xs={12} md={12} lg={12}>
                                        <h4>Expectativas (<span style={{ color: "red" }}>*</span>)</h4>
                                        <div>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...expectations}
                                            name={nameExpectations}
                                            parentId="dashboardComponentScroll"
                                            className="expectationsField"
                                            data={selectsReducer.get(ALERT_PORTFOLIO_EXPECTATIONS) || []}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className="modalBt4-footer modal-footer">
                            <button type="submit"
                                className="btn btn-primary modal-button-edit">Guardar
                        </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        saveObservationPortfolioExp,
        showLoading,
        swtShowMessage,
        clientsPortfolioExpirationFindServer,
        getMasterDataFields
    }, dispatch);
}

function mapStateToProps({reducerGlobal, alertPortfolioExpiration, selectsReducer}, {alertPortfolioExpId}) {
    const listClientsAlertPortfolioExp = alertPortfolioExpiration.get('responseClients');
    const alertPortfolioExp = _.filter(listClientsAlertPortfolioExp, (item) => {
        return _.isEqual(item.id, alertPortfolioExpId);
    });    

     
    return {
        reducerGlobal,
        alertPortfolioExpiration,
        selectsReducer,
        initialValues: {
            observations: _.get(alertPortfolioExp, '0.observations', ''),
            expectations: _.get(alertPortfolioExp, '0.expectations', '')          
        },
        client: {
            clientName: _.get(alertPortfolioExp, '0.clientName', ''),
            typeDocument: _.get(alertPortfolioExp, '0.typeDocument', ''),
            document: _.get(alertPortfolioExp, '0.idNumberClient', ''),
        }
    };
}

export default reduxForm({
    form: 'submitModalObservationAlertPortfolioExp',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(ModalObservation);