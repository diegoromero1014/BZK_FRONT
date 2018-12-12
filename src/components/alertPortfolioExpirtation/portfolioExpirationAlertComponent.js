/**
 * Created by ahurtado on 12/06/2016.
 */
import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {bindActionCreators} from 'redux';
import {
    clientsPortfolioExpirationFindServer,
    clearFilter,
    changePage,
    changeKeyword,
    changeTeam,
    changeRegion,
    changeZone
} from './actions';
import {showLoading} from '../loading/actions';
import SearchBarClient from './searchClientsPortfolioExpiration';
import {NUMBER_RECORDS, FORM_FILTER_ALERT_PE} from './constants';
import Pagination from './pagination';
import {redirectUrl} from '../globalComponents/actions';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import {
    consultList,
    getMasterDataFields,
    consultListWithParameterUbication,
    consultDataSelect,
    consultTeamsByRegionByEmployee
} from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';
import {reduxForm} from 'redux-form';
import {updateTitleNavBar} from '../navBar/actions';
import {SESSION_EXPIRED} from '../../constantsGlobal';
import ListClientsAlertPortfolioExp from './listPortfolioExpiration';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {formatLongDateToDateWithNameMonth, validateResponse} from '../../actionsGlobal';
import {swtShowMessage} from "../sweetAlertMessages/actions";
import _ from 'lodash';
import { relative } from 'path';

const fields = ["team", "region", "zone"];
const titleModule = 'Alerta de clientes de cartera vencida o próxima a vencer';

class ClientsPendingUpdate extends Component {
    constructor(props) {
        super(props);
        momentLocalizer(moment);
        this._onChangeTeam = this._onChangeTeam.bind(this);
        this._onChangeRegionStatus = this._onChangeRegionStatus.bind(this);
        this._onChangeZoneStatus = this._onChangeZoneStatus.bind(this);
        this._handleClientsFind = this._handleClientsFind.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
    }

    componentWillMount() {
        const {showLoading} = this.props;
        if (window.localStorage.getItem('sessionTokenFront') === "" || window.localStorage.getItem('sessionTokenFront') === undefined) {
            redirectUrl("/login");
        } else {
            const {clearFilter, consultList, consultDataSelect, updateTitleNavBar, swtShowMessage} = this.props;
            showLoading(true, 'Cargando..');
            consultList(constants.TEAM_FOR_EMPLOYEE);
            consultDataSelect(constants.LIST_REGIONS);
            clearFilter().then((data) => {
                showLoading(false, null);
                if (!validateResponse(data)) {
                    swtShowMessage('error', 'Error consultando las alertas', 'Señor usuario, ocurrió un error consultanto las alertas.');
                }
            });
            updateTitleNavBar(titleModule);
        }
    }

    componentWillUnmount() {
        this.props.updateTitleNavBar('');
    }

    _cleanSearch() {
        const {resetForm, showLoading, clearFilter, consultList, swtShowMessage} = this.props;
        showLoading(true, 'Cargando..');
        resetForm();
        clearFilter();
        consultList(constants.TEAM_FOR_EMPLOYEE).then((data) => {
            showLoading(false, null);
            if (!_.has(data, 'payload.data')) {
                swtShowMessage('error', 'Error consultando las alertas', 'Señor usuario, ocurrió un error consultanto las alertas.');
            }
        });
    }

    _onChangeTeam(val) {
        const {fields: {team}, changeTeam} = this.props;
        team.onChange(val);
        changeTeam(val);
        if (val) {
            this._handleClientsFind();
        }
    }

    _onChangeRegionStatus(val) {
        if (!_.isEqual(val, "")) {
            const {fields: {team, region, zone}, consultListWithParameterUbication, changeRegion, consultTeamsByRegionByEmployee} = this.props;
            region.onChange(val);
            zone.onChange(null);
            team.onChange(null);
            changeRegion(val);
            consultListWithParameterUbication(constants.LIST_ZONES, val);
            this._handleClientsFind();
            consultTeamsByRegionByEmployee(val);
        }
    }

    _onChangeZoneStatus(val) {
        const {fields: {zone}, changeZone} = this.props;
        zone.onChange(val);
        changeZone(val);
        if (val) {
            this._handleClientsFind();
        }
    }

    _handleClientsFind() {
        const {fields: {team, region, zone}, clientsPortfolioExpirationFindServer, alertPortfolioExpiration, changePage, showLoading, swtShowMessage} = this.props;
        const keyWordNameNit = alertPortfolioExpiration.get('keywordNameNit');
        const order = alertPortfolioExpiration.get('order');
        const columnOrder = alertPortfolioExpiration.get('columnOrder');
        showLoading(true, 'Cargando..');
        clientsPortfolioExpirationFindServer(keyWordNameNit, team.value, region.value, zone.value, 1, NUMBER_RECORDS, order, columnOrder).then((data) => {
            showLoading(false, null);
            if (!validateResponse(data)) {
                swtShowMessage('error', 'Error consultando las alertas', 'Señor usuario, ocurrió un error consultanto las alertas.');
            }
        });
    }

    render() {
        var visibleTable = 'none';
        var visibleMessage = 'block';
        const {fields: {team, region, zone}, handleSubmit, reducerGlobal, alertPortfolioExpiration, selectsReducer} = this.props;
        if (_.size(alertPortfolioExpiration.get('responseClients')) !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }
        const numberTotalClientFiltered = alertPortfolioExpiration.get('totalClientsByFiltered');
        return (
            <div>
                <form>
                    <Row style={{borderBottom: "2px solid #D9DEDF", marginTop: "15px"}}>
                        <Col xs={12} sm={12} md={4} lg={4} style={{width: '60%'}}>
                            <SearchBarClient valueTeam={team.value} valueRegion={region.value} valueZone={zone.value}/>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={2} style={{width: '60%'}}>
                            <ComboBox
                                name="celula"
                                labelInput="Célula"
                                {...team}
                                onChange={val => this._onChangeTeam(val)}
                                value={team.value}
                                onBlur={team.onBlur}
                                valueProp={'id'}
                                textProp={'description'}
                                searchClient={'client'}
                                data={selectsReducer.get('teamValueObjects')}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={2} style={{width: '60%'}}>
                            <ComboBox
                                name="region"
                                labelInput="Región"
                                {...region}
                                onChange={val => this._onChangeRegionStatus(val)}
                                value={region.value}
                                onBlur={region.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient={'client'}
                                data={selectsReducer.get(constants.LIST_REGIONS) || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={2} style={{width: '60%'}}>
                            <ComboBox
                                name="zona"
                                labelInput="Zona"
                                {...zone}
                                onChange={val => this._onChangeZoneStatus(val)}
                                value={zone.value}
                                onBlur={zone.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient={'client'}
                                data={selectsReducer.get(constants.LIST_ZONES) || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} style={{width: '100%'}}>
                            <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                                    title="Limpiar búsqueda" style={{marginLeft: "17px"}}>
                                <i className="erase icon"
                                   style={{color: "white", margin: '0em', fontSize: '1.2em'}}></i>
                            </button>
                        </Col>
                    </Row>
                </form>
                <Row style={{position: 'relative', heigth: '50px'}}>
                    <div style={{
                        marginTop: "18px",
                        marginLeft: "18px",
                        float: 'left',
                        position: 'absolute'
                    }}>
                        <span style={{fontWeight: "bold", color: "#818282"}}>Fecha última carga: </span>
                        <span style={{marginLeft: "0px", color: "#818282"}}>
                            {formatLongDateToDateWithNameMonth(alertPortfolioExpiration.get("lastUploadDate"))}
                        </span>
                    </div>
                    <div style={{padding: "15px", fontSize: '25px', textAlign: 'center', width: '100%'}}>
                        Total: {numberTotalClientFiltered}
                    </div>
                </Row>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Grid style={{display: visibleTable, width: "98%"}}>
                            <Row>
                                <Col xs>
                                    <ListClientsAlertPortfolioExp />
                                    <Pagination />
                                </Col>
                            </Row>
                        </Grid>
                        <Grid style={{display: visibleMessage, width: "100%"}}>
                            <Row center="xs">
                                <Col xs={12} sm={8} md={12} lg={12}>
                                    <span style={{fontWeight: 'bold', color: '#4C5360'}}>No se han encontrado resultados para la búsqueda</span>
                                </Col>
                            </Row>
                        </Grid>
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clientsPortfolioExpirationFindServer,
        clearFilter,
        getMasterDataFields,
        changePage,
        changeKeyword,
        consultList,
        updateTitleNavBar,
        consultListWithParameterUbication,
        consultDataSelect,
        showLoading,
        changeTeam,
        swtShowMessage,
        changeRegion,
        changeZone,
        consultTeamsByRegionByEmployee
    }, dispatch);
}

function mapStateToProps({alertPortfolioExpiration, selectsReducer, navBar, reducerGlobal}, {fields}) {
    return {
        alertPortfolioExpiration,
        selectsReducer,
        navBar,
        reducerGlobal
    };
}

export default reduxForm({
    form: FORM_FILTER_ALERT_PE,
    fields
}, mapStateToProps, mapDispatchToProps)(ClientsPendingUpdate);

