import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import GridComponent from '../../grid/component';
import { redirectUrl } from '../../globalComponents/actions';
import { get, indexOf, has } from 'lodash';
import { showLoading } from '../../loading/actions';
import { getAssetsAEC } from './actions';
import { shorterStringValue } from '../../../actionsGlobal';
import { getMasterDataFields } from '../../selectsComponent/actions';
import { AEC_STATUS } from '../../selectsComponent/constants';
import { ACTIVE_STATE } from './constants';
import { VIEW_AEC } from '../../modal/constants';

class ListAECComponent extends Component {

    constructor(props) {
        super(props);
        this._renderHeaders = this._renderHeaders.bind(this);
    }

    componentWillMount() {
        const { getAssetsAEC, getMasterDataFields, selectsReducer } = this.props;
        getMasterDataFields([AEC_STATUS]).then(() => {
            var statesAEC = selectsReducer.get(AEC_STATUS);
            console.log('statesAEC', statesAEC);
            var idActiveState = _.get(_.filter(statesAEC, ['key', ACTIVE_STATE]), '[0].id');
            console.log('idActiveState', idActiveState);
            var json = {
                idClient: window.localStorage.getItem('idClientSelected'),
                statusAEC: idActiveState
            }
            console.log('json', json);
            getAssetsAEC(json).then((data) => {
                console.log('data', data);
                if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                    redirectUrl("/login");
                }
            });
        });
    }

    _renderHeaders() {
        const headersTable = [
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

        return headersTable;
    }

    _renderCellView(data) {
        return data.map((AEC, idx) => ({
            actions: {
                actionView: true,
                id: AEC.id,
                urlServer: "./component",
                component: VIEW_AEC
            },
            dateMeeting: AEC.dateMeeting,
            observations: shorterStringValue(AEC.observations, 40),
            actionPlan: shorterStringValue(AEC.actionPlan, 40)
        }));
    }

    render() {
        const modalTitle = 'AEC detalle';
        const { AECClient } = this.props;
        const data = AECClient.get('responseAEC');
        return (
            <div className="horizontal-scroll-wrapper" style={{ overflow: 'hidden', background: '#fff' }}>
                {
                    data.length > 0 ?
                        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle} />
                        :
                        <div style={{ display: 'block', width: "100%" }}>
                            <Row center="xs">
                                <Col xs={12} sm={8} md={12} lg={12} style={{ marginTop: '15px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado resultados para la búsqueda</span>
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
        getMasterDataFields
    }, dispatch);
}

function mapStateToProps({ AECClient, reducerGlobal, selectsReducer }, ownerProps) {
    return {
        AECClient,
        reducerGlobal,
        selectsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListAECComponent);
