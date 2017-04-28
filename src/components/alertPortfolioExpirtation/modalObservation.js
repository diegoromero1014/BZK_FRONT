/**
 * Created by Andres Hurtado on 25/04/2017.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import {Row, Col} from 'react-flexbox-grid';
import {clientsPortfolioExpirationFindServer,saveObservationPortfolioExp} from './actions';
import Textarea from '../../ui/textarea/textareaComponent';
import _ from 'lodash';
import {showLoading} from '../loading/actions';
import {swtShowMessage} from '../sweetAlertMessages/actions';

const fields = ["observations"];

const validate = (values) => {
    return {};
};

class ModalObservation extends Component {

    constructor(props) {
        super(props);
        this._handleSaveObservation = this._handleSaveObservation.bind(this);
    }

    _handleSaveObservation() {
        const {isOpen, fields:{observations}, alertPortfolioExpId, saveObservationPortfolioExp,
            showLoading, swtShowMessage, alertPortfolioExpiration, clientsPortfolioExpirationFindServer} = this.props;
        showLoading(true, 'Guardando...');
        saveObservationPortfolioExp(alertPortfolioExpId, observations.value)
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
                console.log("reason error _handleSaveObservation ", reason);
                showLoading(false, '');
                swtShowMessage('error', 'Edición observaciones', 'Señor usuario, ocurrió un error guardando las observaciones.');
            });
    }

    render() {
        const {fields:{observations}} = this.props;
        return (
            <div>
                <div className="modalBt4-body modal-body clearfix"
                     style={{overflowX: 'hidden', maxHeight: '490px !important'}}>
                    <div style={{paddingLeft: '20px', paddingRight: '20px'}}>
                        <Row style={{paddingTop: '10px'}}>
                            <Col xs={12} md={12} lg={12}>
                                <h4>Observaciones</h4>
                                <div>
                                            <Textarea
                                                name="actionArea"
                                                type="text"
                                                style={{width: '100%', height: '100%', textAlign: 'justify'}}
                                                max="1000"
                                                rows={5}
                                                {...observations}
                                            />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="button" onClick={this._handleSaveObservation}
                            className="btn btn-primary modal-button-edit">Guardar
                    </button>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        saveObservationPortfolioExp,
        showLoading,
        swtShowMessage,
        clientsPortfolioExpirationFindServer
    }, dispatch);
}

function mapStateToProps({reducerGlobal, alertPortfolioExpiration}, {alertPortfolioExpId}) {
    const listClientsAlertPortfolioExp = alertPortfolioExpiration.get('responseClients');
    const alertPortfolioExp = _.filter(listClientsAlertPortfolioExp, (item) => {
        return _.isEqual(item.id, alertPortfolioExpId);
    });
    return {
        reducerGlobal,
        alertPortfolioExpiration,
        initialValues: {
            observations: _.get(alertPortfolioExp, '0.observation', '')
        }
    };
}

export default reduxForm({
    form: 'submitModalObservationAlertPortfolioExp',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(ModalObservation);