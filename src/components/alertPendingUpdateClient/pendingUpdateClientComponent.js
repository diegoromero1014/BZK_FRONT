import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import SearchBarClient from './searchClientAlertPendingUpdate';
import Pagination from './pagination';
import ListClientsPendingUpdate from './listClientPendingUpdate';
import _ from 'lodash';
import { changePage, changeRegion, changeTeam, changeZone, clearFilter, clientsPendingUpdateFindServer } from './actions';
import { showLoading } from '../loading/actions';
import { redirectUrl } from '../globalComponents/actions';
import { updateTitleNavBar } from '../navBar/actions';
import { onSessionExpire } from '../../actionsGlobal'
import {
    consultDataSelect, consultList, consultListWithParameterUbication, consultTeamsByRegionByEmployee, getMasterDataFields
} from '../selectsComponent/actions';
import { FORM_FILTER_ALERT_PUC, NUMBER_RECORDS } from './constants';
import * as constants from '../selectsComponent/constants';

const fields = ["team", "region", "zone"];
const titleModule = 'Alerta de clientes pendientes por actualizar';

export class ClientsPendingUpdate extends Component {
    constructor(props) {
        super(props);
        this.onChangeTeam = this.onChangeTeam.bind(this);
        this.onChangeRegionStatus = this.onChangeRegionStatus.bind(this);
        this.onChangeZoneStatus = this.onChangeZoneStatus.bind(this);
        this.handleClientsFind = this.handleClientsFind.bind(this);
        this.cleanSearch = this.cleanSearch.bind(this);
    }

    componentWillMount() {
        const { dispatchShowLoading } = this.props;
        if (window.localStorage.getItem('sessionTokenFront') === "" || window.localStorage.getItem('sessionTokenFront') === undefined) {
            redirectUrl("/login");
        } else {
            const {
                dispatchClearFilter,
                dispatchConsultList,
                dispatchGetMasterDataFields,
                dispatchConsultDataSelect,
                dispatchUpdateTitleNavBar
            } = this.props;

            dispatchShowLoading(true, 'Cargando..');
            dispatchGetMasterDataFields([constants.CERTIFICATION_STATUS]).then((data) => {
                if (_.get(data, 'payload.data.validateLogin') === false) {
                    onSessionExpire();
                }
            });
            dispatchConsultList(constants.TEAM_FOR_EMPLOYEE);
            dispatchConsultDataSelect(constants.LIST_REGIONS);
            dispatchClearFilter().then((data) => {
                if (_.has(data, 'payload.data.data')) {
                    dispatchShowLoading(false, null);
                }
            });
            dispatchUpdateTitleNavBar(titleModule);
        }
    }

    componentWillUnmount() {
        this.props.dispatchUpdateTitleNavBar('');
    }

    cleanSearch = () => {
        const { resetForm, dispatchShowLoading, dispatchClearFilter, dispatchConsultList } = this.props;
        dispatchShowLoading(true, 'Cargando..');
        resetForm();
        dispatchClearFilter();
        dispatchConsultList(constants.TEAM_FOR_EMPLOYEE).then((data) => {
            if (_.has(data, 'payload.data.teamValueObjects')) {
                dispatchShowLoading(false, null);
            }
        });
    }

    onChangeTeam = val => {
        const { fields: { team }, dispatchChangeTeam } = this.props;
        team.onChange(val);
        dispatchChangeTeam(val);
        if (val) {
            this.handleClientsFind();
        }
    }

    onChangeRegionStatus = val => {
        if (!_.isEqual(val, "")) {
            const {
                fields: { team, region, zone },
                dispatchConsultListWithParameterUbication,
                dispatchChangeRegion,
                dispatchConsultTeamsByRegionByEmployee
            } = this.props;

            region.onChange(val);
            zone.onChange(null);
            team.onChange(null);
            dispatchChangeRegion(val);
            dispatchConsultListWithParameterUbication(constants.LIST_ZONES, val);
            this.handleClientsFind();
            dispatchConsultTeamsByRegionByEmployee(val);
        }
    }

    onChangeZoneStatus = val => {
        const { fields: { zone }, dispatchChangeZone } = this.props;
        zone.onChange(val);
        dispatchChangeZone(val);
        if (val) {
            this.handleClientsFind();
        }
    }

    handleClientsFind = () => {
        const {
            fields: { team, region, zone },
            dispatchClientsPendingUpdateFindServer,
            alertPendingUpdateClient,
            dispatchChangePage,
            dispatchShowLoading
        } = this.props;

        const keyWordNameNit = alertPendingUpdateClient.get('keywordNameNit');
        const order = alertPendingUpdateClient.get('order');
        const columnOrder = alertPendingUpdateClient.get('columnOrder');
        dispatchShowLoading(true, 'Cargando..');
        dispatchClientsPendingUpdateFindServer(keyWordNameNit, team.value, region.value, zone.value, 1, NUMBER_RECORDS, order, columnOrder).then((data) => {
            if (_.has(data, 'payload.data.data')) {
                dispatchShowLoading(false, null);
                dispatchChangePage(1);
            }
        });
    }

    render() {
        var visibleTable = 'none';
        var visibleMessage = 'block';
        const { fields: { team, region, zone }, alertPendingUpdateClient, selectsReducer } = this.props;
        if (_.size(alertPendingUpdateClient.get('responseClients')) !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }
        const numberTotalClientFiltered = alertPendingUpdateClient.get('totalClientsByFiltered');
        return (
            <div>
                <form>
                    <Row style={{ borderBottom: "2px solid #D9DEDF", marginTop: "15px" }}>
                        <Col xs={12} sm={12} md={4} lg={4} style={{ width: '60%' }}>
                            <SearchBarClient valueTeam={team.value} valueRegion={region.value} valueZone={zone.value} />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={2} style={{ width: '60%' }}>
                            <ComboBox
                                name="celula"
                                labelInput="Célula"
                                {...team}
                                onChange={val => this.onChangeTeam(val)}
                                value={team.value}
                                onBlur={team.onBlur}
                                valueProp={'id'}
                                textProp={'description'}
                                searchClient={'client'}
                                data={selectsReducer.get('teamValueObjects')}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={2} style={{ width: '60%' }}>
                            <ComboBox
                                name="region"
                                labelInput="Región"
                                {...region}
                                onChange={val => this.onChangeRegionStatus(val)}
                                value={region.value}
                                onBlur={region.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient={'client'}
                                data={selectsReducer.get(constants.LIST_REGIONS) || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={2} style={{ width: '60%' }}>
                            <ComboBox
                                name="zona"
                                labelInput="Zona"
                                {...zone}
                                onChange={val => this.onChangeZoneStatus(val)}
                                value={zone.value}
                                onBlur={zone.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient={'client'}
                                data={selectsReducer.get(constants.LIST_ZONES) || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} style={{ width: '100%' }}>
                            <button className="btn btn-primary" type="button" onClick={this.cleanSearch}
                                title="Limpiar búsqueda" style={{ marginLeft: "17px" }}>
                                <i className="erase icon"
                                    style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
                            </button>
                        </Col>
                    </Row>
                </form>
                <Row>
                    <div style={{ padding: "15px", fontSize: '25px', textAlign: 'center', width: '100%' }}>
                        Total: {numberTotalClientFiltered}
                    </div>
                </Row>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Grid style={{ display: visibleTable, width: "98%" }}>
                            <Row>
                                <Col xs>
                                    <ListClientsPendingUpdate />
                                    <Pagination />
                                </Col>
                            </Row>
                        </Grid>
                        <Grid style={{ display: visibleMessage, width: "100%" }}>
                            <Row center="xs">
                                <Col xs={12} sm={8} md={12} lg={12}>
                                    <span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado resultados para la búsqueda</span>
                                </Col>
                            </Row>
                        </Grid>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchClientsPendingUpdateFindServer: clientsPendingUpdateFindServer,
    dispatchClearFilter: clearFilter,
    dispatchGetMasterDataFields: getMasterDataFields,
    dispatchChangePage: changePage,
    dispatchConsultList: consultList,
    dispatchUpdateTitleNavBar: updateTitleNavBar,
    dispatchConsultListWithParameterUbication: consultListWithParameterUbication,
    dispatchConsultDataSelect: consultDataSelect,
    dispatchShowLoading: showLoading,
    dispatchChangeTeam: changeTeam,
    dispatchChangeRegion: changeRegion,
    dispatchChangeZone: changeZone,
    dispatchConsultTeamsByRegionByEmployee: consultTeamsByRegionByEmployee
}, dispatch);

const mapStateToProps = ({ alertPendingUpdateClient, selectsReducer, navBar, reducerGlobal }) => ({
    alertPendingUpdateClient,
    selectsReducer,
    navBar,
    reducerGlobal
})

export default reduxForm({ form: FORM_FILTER_ALERT_PUC, fields }, mapStateToProps, mapDispatchToProps)(ClientsPendingUpdate);
