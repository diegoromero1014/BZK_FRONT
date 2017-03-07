/**
 * Created by Andres Hurtado on 01/03/2017.
 */
import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {bindActionCreators} from 'redux';
import {blackListFindServer, clearFilter, changePage, changeKeyword, changeKeywordClient, changeTypeEntity} from './actions';
import {showLoading} from '../loading/actions';
import SearchBarClient from './searchBarClient';
import SearchBarEntityBlackList from './searchBarEntityBlackList';
import {FORM_FILTER_ALERT_BLACK_LIST,NUMBER_RECORDS} from './constants';
import Pagination from './pagination';
import {redirectUrl} from '../globalComponents/actions';
import {reduxForm} from 'redux-form';
import {updateTitleNavBar} from '../navBar/actions';
import ListAlertBlackList from './listAlertBlackList';
import _ from 'lodash';
import { Dropdown } from 'semantic-ui-react';

const fields = [];
const titleModule = 'Alerta de listas de control';
const optionsTypeEntity = [
    {
        text: 'Cliente',
        value: 'Cliente',
        key: 'Cliente'
    },
    {
        text: 'Contacto/Representante legal',
        value: 'Contacto',
        key: 'Contacto'
    },
    {
        text: 'Accionista',
        value: 'Accionista',
        key: 'Accionista'
    }
];

class AlertBlackList extends Component {
    constructor(props) {
        super(props);
        this._onChangeTypeEntity = this._onChangeTypeEntity.bind(this);
        this._handleBlackListFind = this._handleBlackListFind.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
    }

    componentWillMount() {
        const {redirectUrl, updateTitleNavBar} = this.props;
        if (window.localStorage.getItem('sessionToken') === "" || window.localStorage.getItem('sessionToken') === undefined) {
            redirectUrl("/login");
        } else {
            this._cleanSearch();
            updateTitleNavBar(titleModule);
        }
    }
    componentWillUnmount(){
        this.props.updateTitleNavBar('');
    }

    _cleanSearch() {
        const {resetForm,showLoading, clearFilter} = this.props;
        resetForm();
        showLoading(true, 'Cargando..');
        clearFilter().then((data) => {
            if (_.has(data, 'payload.data.data')) {
                showLoading(false, null);
            }
        });
    }

    _onChangeTypeEntity(val) {
        if (!_.isEqual(val, "")) {
            this.props.changeTypeEntity(val);
            this._handleBlackListFind(val);
        }
    }

    _handleBlackListFind(typeEntity) {
        const {blackListFindServer, alertBlackList, changePage, showLoading} = this.props;
        const keyWordNameNit = alertBlackList.get('keywordNameNit');
        const keywordNameNitClient = alertBlackList.get('keywordNameNitClient');
        const order = alertBlackList.get('order');
        const columnOrder = alertBlackList.get('columnOrder');
        showLoading(true, 'Cargando..');
        blackListFindServer(keyWordNameNit,keywordNameNitClient, typeEntity, 1, NUMBER_RECORDS, order, columnOrder).then((data) => {
            if (_.has(data, 'payload.data.data')) {
                showLoading(false, null);
                changePage(1);
            }
        });
    }

    render() {
        var visibleTable = 'none';
        var visibleMessage = 'block';
        const {alertBlackList} = this.props;
        if(_.size(alertBlackList.get('responseBlackList')) !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }
        const totalBlackListFiltered = alertBlackList.get('totalBlackListFiltered');
        const typeEntity = alertBlackList.get('typeEntity');
        return (
            <div>
                <form>
                    <Row style={{borderBottom: "2px solid #D9DEDF", marginTop: "15px"}}>
                        <Col xs={12} sm={12} md={4} lg={4} >
                            <SearchBarClient valueStatus={status.value}/>
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4} >
                            <SearchBarEntityBlackList valueStatus={status.value}/>
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={3}>
                            <Dropdown  value={typeEntity} onChange={(e,val) => {
                                this._onChangeTypeEntity(val.value)}} placeholder='Tipo de entidad' fluid search selection options={optionsTypeEntity} />
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={1} style={{width: '100%'}}>
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
                        Total: {totalBlackListFiltered}
                    </div>
                </Row>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Grid style={{display: visibleTable, width: "98%"}}>
                            <Row>
                                <Col xs>
                                    <ListAlertBlackList />
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
        blackListFindServer,
        clearFilter, 
        changePage, 
        changeKeyword, 
        changeKeywordClient, 
        changeTypeEntity,
        updateTitleNavBar,
        showLoading
    }, dispatch);
}

function mapStateToProps({alertBlackList}, {ownerProps}) {
    return {
        alertBlackList
    };
}

export default reduxForm({form: FORM_FILTER_ALERT_BLACK_LIST, fields}, mapStateToProps, mapDispatchToProps)(AlertBlackList);

