import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { covenantsFindServer, defaultValues, clearFilter, changePage, changeKeyword, changeStatusCovenant } from './actions';
import { showLoading } from '../loading/actions';
import SearchBarClient from './searchCovenants';
import { FORM_FILTER_ALERT_COVENANT, NUMBER_RECORDS } from './constants';
import Pagination from './pagination';
import { reduxForm } from 'redux-form';
import { updateTitleNavBar } from '../navBar/actions';
import ListAlertCovenants from './listAlertCovenants';
import _ from 'lodash';
import { Dropdown } from 'semantic-ui-react'
import { GREEN_COLOR, ORANGE_COLOR, RED_COLOR } from '../../constantsGlobal'

const fields = [];
const titleModule = 'Alerta de covenants vencidos o próximos a vencer';
const optionsColorExpiration = [
    {
        text: 'Seleccione un estado de covenant',
        value: '-1'
    },
    {
        text: 'Covenants con seguimiento pendiente',
        value: '0',
        label: { color: 'red-ayax', empty: true, circular: true },
    },
    {
        text: 'Covenants con seguimiento próximo mes',
        value: '1',
        label: { color: 'orange-ayax', empty: true, circular: true },
    },
    {
        text: 'Covenants con revisión posterior',
        value: '2',
        label: { color: 'green-ayax', empty: true, circular: true },
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
        const { redirectUrl, defaultValues, updateTitleNavBar, showLoading } = this.props;
        if (window.localStorage.getItem('sessionTokenFront') === "" || window.localStorage.getItem('sessionTokenFront') === undefined) {
            redirectUrl("/login");
        } else {
            showLoading(true, 'Cargando..');
            defaultValues().then((data) => {
                if (_.has(data, 'payload.data.data')) {
                    showLoading(false, null);
                }
            });
            updateTitleNavBar(titleModule);
        }
    }
    componentWillUnmount() {
        this.props.updateTitleNavBar('');
    }

    _cleanSearch() {
        const { resetForm, showLoading, clearFilter } = this.props;
        resetForm();
        clearFilter();
    }

    _onChangeStatusCovenant(val) {
        if (!_.isEqual(val, "")) {
            this.props.changeStatusCovenant(val);
            this._handleCovenantsFind(val);
        }
    }

    _handleCovenantsFind(statusCovenant) {
        const { covenantsFindServer, alertCovenant, changePage, showLoading } = this.props;
        const keyWordNameNit = alertCovenant.get('keywordNameNit');
        const order = alertCovenant.get('order');
        const columnOrder = alertCovenant.get('columnOrder');
        showLoading(true, 'Cargando..');
        covenantsFindServer(keyWordNameNit, statusCovenant, 1, NUMBER_RECORDS, order, columnOrder).then((data) => {
            if (_.has(data, 'payload.data.data')) {
                showLoading(false, null);
                changePage(1);
            }
        });
    }

    render() {
        var visibleTable = 'none';
        var visibleDoots = 'none';
        var visibleMessage = 'block';
        const { alertCovenant } = this.props;
        if (_.size(alertCovenant.get('responseCovenants')) !== 0) {
            visibleTable = 'block';
            visibleDoots = 'flex';
            visibleMessage = 'none';
        }
        var statusCovenant = alertCovenant.get('statusCovenant');
        if (_.isNull(statusCovenant)) {
            statusCovenant = "0";
        }
        const numberTotalClientFiltered = alertCovenant.get('totalCovenantsByFiltered');
        return (
            <div>
                <form>
                    <Row style={{ borderBottom: "2px solid #D9DEDF", marginTop: "15px" }}>
                        <Col xs={12} sm={12} md={6} lg={6} >
                            <SearchBarClient valueStatus={status.value} />
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4}>
                            <Dropdown value={statusCovenant} onChange={(e, val) => {
                                this._onChangeStatusCovenant(val.value)
                            }} placeholder='Por favor, seleccione un estado' fluid search selection options={optionsColorExpiration} />
                        </Col>

                        <Col xs={12} sm={12} md={2} lg={2} style={{ width: '100%' }}>
                            <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
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
                <Row style={{ width: "98%", marginLeft: '12px', padding: '10px 5px 5px 10px', display: visibleDoots, backgroundColor: '#FFF' }} xs={12} md={12} lg={12}>
                    <Col xs={12} md={4} lg={4} style={{ display: '-webkit-inline-box' }}>
                        <div className="traffickLigth-item-covenants" style={{ backgroundColor: RED_COLOR , display: "-ms-inline-flexbox" }}></div>
                        <span style={{ marginLeft: '10px'}}>{optionsColorExpiration[1].text}</span>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ display: '-webkit-inline-box' }}>
                        <div className="traffickLigth-item-covenants" style={{ backgroundColor: ORANGE_COLOR , display: "-ms-inline-flexbox" }}></div>
                        <span style={{ marginLeft: '10px'}}>{optionsColorExpiration[2].text}</span>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ display: '-webkit-inline-box' }}>
                        <div className="traffickLigth-item-covenants" style={{ backgroundColor: GREEN_COLOR , display: "-ms-inline-flexbox" }}></div>
                        <span style={{ marginLeft: '10px'}}>{optionsColorExpiration[3].text}</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Grid style={{ display: visibleTable, width: "98%" }}>
                            <Row>
                                <Col xs>
                                    <ListAlertCovenants />
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        covenantsFindServer,
        changeStatusCovenant,
        clearFilter,
        changePage,
        changeKeyword,
        updateTitleNavBar,
        showLoading,
        defaultValues
    }, dispatch);
}

function mapStateToProps({ alertCovenant }, { ownerProps }) {
    return {
        alertCovenant
    };
}

export default reduxForm({ form: FORM_FILTER_ALERT_COVENANT, fields }, mapStateToProps, mapDispatchToProps)(AlertCovenants);

