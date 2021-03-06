import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Row } from 'react-flexbox-grid';
import GridComponent from '../../grid/component';
import _ from 'lodash';

import { redirectUrl } from '../../globalComponents/actions';
import { showLoading } from '../../loading/actions';
import { clearListAEC, getAssetsAEC } from './actions';
import { getMasterDataFields } from '../../selectsComponent/actions';
import { formatLongDateToDateWithNameMonth, shorterStringValue, validateResponse } from '../../../actionsGlobal';
import { swtShowMessage } from '../../sweetAlertMessages/actions';

import { MESSAGE_ERROR_SWEET_ALERT, MESSAGE_LOAD_DATA, TITLE_ERROR_SWEET_ALERT } from '../../../constantsGlobal';
import { AEC_LEVEL, AEC_STATUS } from '../../selectsComponent/constants';
import { ACTIVE_STATE } from './constants';
import { VIEW_AEC } from '../../modal/constants';
import { _AEC, BIZTRACK_MY_CLIENTS, nombreflujoAnalytics } from '../../../constantsAnalytics';

class ListAECComponent extends Component {

    constructor(props) {
        super(props);
        this._renderHeaders = this._renderHeaders.bind(this);
    }

    componentWillMount() {
        window.dataLayer.push({
            'nombreflujo': nombreflujoAnalytics,
            'event': BIZTRACK_MY_CLIENTS + _AEC,
            'pagina':_AEC

        });
        const {getAssetsAEC, getMasterDataFields, showLoading, clearListAEC, swtShowMessage} = this.props;
        clearListAEC();
        showLoading(true, MESSAGE_LOAD_DATA);
        getMasterDataFields([AEC_STATUS, AEC_LEVEL]).then((data) => {
            const statesAEC = data.payload.data.data.masterDataDetailEntries;
            const idActiveState = _.get(_.filter(statesAEC, ['key', ACTIVE_STATE]), '[0].id');
            const json = {
                idClient: window.sessionStorage.getItem('idClientSelected'),
                statusAEC: idActiveState
            };
            getAssetsAEC(json).then((data) => {
                showLoading(false, "");
                if (!validateResponse(data)) {
                    swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                }
            }, (reason) => {
                showLoading(false, "");
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            });
        }, (reason) => {
            showLoading(false, "");
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    _renderHeaders() {
        return [
            {
                title: "",
                key: "actions"
            },
            {
                title: "Fecha",
                key: "dateMeeting"
            },
            {
                title: "Observaciones",
                key: "observations"
            },
            {
                title: "Plan de acción",
                key: "actionPlan"
            }
        ];
    }

    _renderCellView(data) {
        return data.map((AEC, idx) => ({
            actions: {
                actionView: true,
                id: AEC.id,
                urlServer: "./component",
                component: VIEW_AEC
            },
            dateMeeting: formatLongDateToDateWithNameMonth(AEC.dateMeeting),
            observations: shorterStringValue(AEC.observations, 40),
            actionPlan: shorterStringValue(AEC.actionPlan, 40)
        }));
    }

    render() {
        const modalTitle = 'AEC detalle';
        const {AECClient} = this.props;
        const data = AECClient.get('responseAEC');
        return (
            <div className="horizontal-scroll-wrapper" style={{overflow: 'hidden', background: '#fff'}}>
                {
                    data.length > 0 ?
                        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)}
                                       modalTitle={modalTitle}/>
                        :
                        <div style={{display: 'block', width: "100%"}}>
                            <Row center="xs">
                                <Col xs={12} sm={8} md={12} lg={12} style={{marginTop: '15px'}}>
                                    <span style={{fontWeight: 'bold', color: '#4C5360'}}>No se han encontrado resultados para la búsqueda</span>
                                </Col>
                            </Row>
                        </div>
                }
            </div >
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAssetsAEC,
        redirectUrl,
        showLoading,
        getMasterDataFields,
        clearListAEC,
        validateResponse,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({AECClient, reducerGlobal, selectsReducer}, ownerProps) {
    return {
        AECClient,
        reducerGlobal,
        selectsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListAECComponent);
