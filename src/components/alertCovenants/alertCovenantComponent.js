/**
 * Created by ahurtado on 15/02/2016.
 */
import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {bindActionCreators} from 'redux';
import {covenantsFindServer, clearFilter, changePage, changeKeyword, changeStatusCovenant} from './actions';
import {showLoading} from '../loading/actions';
import SearchBarClient from './searchCovenants';
import {FORM_FILTER_ALERT_COVENANT,NUMBER_RECORDS} from './constants';
import Pagination from './pagination';
import {redirectUrl} from '../globalComponents/actions';
import {reduxForm} from 'redux-form';
import {updateTitleNavBar} from '../navBar/actions';
import {SESSION_EXPIRED} from '../../constantsGlobal';
import ListCovenants from './listCovenants';
import _ from 'lodash';
import { Dropdown } from 'semantic-ui-react'
import {GREEN_COLOR,ORANGE_COLOR ,RED_COLOR} from '../../constantsGlobal'

const fields = ["status"];
const titleModule = 'Alerta de covenants vencidos o próximos a vencer';
const optionsColorExpiration = [
    {
        text: 'Vencido',
        value: '0',
        label: {color: 'red', empty: true, circular: true},
    },
    {
        text: 'Se vence el próximo mes',
        value: '1',
        label: {color: 'orange', empty: true, circular: true},
    },
    {
        text: 'Covenant con tiempo',
        value: '2',
        label: {color: 'green', empty: true, circular: true},
    }
];

class AlertCovenants extends Component {
    constructor(props) {
        super(props);
        this._onChangeStatusCovenant = this._onChangeStatusCovenant.bind(this);
        this._handleCovenantsFind = this._handleCovenantsFind.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
    }

    componentWillMount() {
        const {showLoading} = this.props;
        if (window.localStorage.getItem('sessionToken') === "" || window.localStorage.getItem('sessionToken') === undefined) {
            redirectUrl("/login");
        } else {
            const {clearFilter, updateTitleNavBar} = this.props;
            // showLoading(true, 'Cargando..');
            // clearFilter().then((data) => {
            //     if (_.has(data, 'payload.data.data')) {
            //         showLoading(false, null);
            //     }
            // });
            updateTitleNavBar(titleModule);
        }
    }
    componentWillUnmount(){
        this.props.updateTitleNavBar('');
    }

    _cleanSearch() {
        const {resetForm,showLoading, clearFilter} = this.props;
        showLoading(true, 'Cargando..');
        resetForm();
        clearFilter();
    }

    _onChangeStatusCovenant(val) {
        if (!_.isEqual(val, "")) {
            this._handleCovenantsFind();
            // consultTeamsByRegionByEmployee(val);
        }
    }

    _handleCovenantsFind() {
        const {fields: {status}, covenantsFindServer, alertCovenant, changePage, showLoading} = this.props;
        const keyWordNameNit = alertCovenant.get('keywordNameNit');
        const pageNum = alertCovenant.get('pageNum');
        const order = alertCovenant.get('order');
        const columnOrder = alertCovenant.get('columnOrder');
        showLoading(true, 'Cargando..');
        covenantsFindServer(keyWordNameNit, status.value, pageNum, NUMBER_RECORDS, order, columnOrder).then((data) => {
            if (_.has(data, 'payload.data.data')) {
                showLoading(false, null);
            }
        });
        changePage(1);
    }

    render() {
        var visibleTable = 'none';
        var visibleMessage = 'block';
        const {fields:{status}, alertCovenant} = this.props;
        if(_.size(alertCovenant.get('responseCovenants')) !== 0) {
        visibleTable = 'block';
        visibleMessage = 'none';
        }
        const numberTotalClientFiltered = alertCovenant.get('totalCovenantsByFiltered');
        return (
            <div>
                <form>
                    <Row style={{borderBottom: "2px solid #D9DEDF", marginTop: "15px"}}>
                        <Col xs={12} sm={12} md={4} lg={4} >
                            <SearchBarClient valueStatus={status.value}/>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <Dropdown onChange={val => this._onChangeStatusCovenant(val)} placeholder='Seleccionar estado' fluid search selection options={optionsColorExpiration} />
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
                <Row>
                    <div style={{padding: "15px", fontSize: '25px', textAlign: 'center', width: '100%'}}>
                        Total: {numberTotalClientFiltered}
                    </div>
                </Row>
                <Row style={{paddingLeft: "10px", marginBottom: '20px', display: visibleTable, backgroundColor: '#FFF'}} xs={12} md={12} lg={12}>
                    <Col xs={12} md={4} lg={3} style={{ marginTop: "5px", display: '-webkit-inline-box' }}>
                        <div className="traffickLigth-item-covenants" style={{backgroundColor: RED_COLOR }}></div>
                        <span style={{ marginLeft: '10px' }}>Vencida</span>
                    </Col>
                    <Col xs={12} md={4} lg={3} style={{ marginTop: "5px", display: '-webkit-inline-box' }}>
                        <div className="traffickLigth-item-covenants" style={{ backgroundColor: ORANGE_COLOR }}></div>
                        <span style={{ marginLeft: '10px' }}>Se vence el próximo mes</span>
                    </Col>
                    <Col xs={12} md={4} lg={3} style={{ marginTop: "5px", display: '-webkit-inline-box' }}>
                        <div className="traffickLigth-item-covenants" style={{ backgroundColor: GREEN_COLOR }}></div>
                        <span style={{ marginLeft: '10px' }}>Covenant con tiempo</span>
                    </Col>
                </Row>
                <Row style={{paddingLeft: "10px"}}>
                    <Col xs={12} md={12} lg={12}>
                        <Grid style={{display: visibleTable, width: "98%"}}>
                            <Row>
                                <Col xs>
                                    <ListCovenants />
                                    <Pagination/>
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
        covenantsFindServer,
        changeStatusCovenant,
        clearFilter,
        changePage,
        changeKeyword,
        updateTitleNavBar,
        showLoading,
    }, dispatch);
}

function mapStateToProps({alertCovenant}, {ownerProps}) {
    return {
        alertCovenant
    };
}

export default reduxForm({form: FORM_FILTER_ALERT_COVENANT, fields}, mapStateToProps, mapDispatchToProps)(AlertCovenants);

