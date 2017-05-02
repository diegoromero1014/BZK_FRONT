/**
 * Created by ahurtado on 12/06/2016.
 */
import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {bindActionCreators} from 'redux';
import {contactsByFunctionOrTypeFindServer, clearFilter, changePage, changeFunction, changeType,} from './actions';
import {showLoading} from '../loading/actions';
import {NUMBER_RECORDS, FORM_FILTERS_CONTACT_BY_FUNCTION_OR_TYPE} from './constants';
import Pagination from './pagination';
import {redirectUrl} from '../globalComponents/actions';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import {
    getMasterDataFields,
    consultDataSelect,
} from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';
import {reduxForm} from 'redux-form';
import {updateTitleNavBar} from '../navBar/actions';
import {SESSION_EXPIRED} from '../../constantsGlobal';
import ListContactByFunctionOrType from './listContactByFunctionOrType';
import _ from 'lodash';

const fields = ['contactFunction', 'contactType'];
const titleModule = 'Búsqueda de contactos por función o tipo';

class ContactsByFunctionOrType extends Component {
    constructor(props) {
        super(props);
        this._onChangeFunctionStatus = this._onChangeFunctionStatus.bind(this);
        this._onChangeTypeStatus = this._onChangeTypeStatus.bind(this);
        this._handleContactsFind = this._handleContactsFind.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionToken') === "" || window.localStorage.getItem('sessionToken') === undefined) {
            redirectUrl("/login");
        } else {
            const {clearFilter, getMasterDataFields, consultDataSelect, updateTitleNavBar} = this.props;
            consultDataSelect(constants.FILTER_FUNCTION_ID);
            consultDataSelect(constants.FILTER_TYPE_CONTACT_ID);
            clearFilter();
            updateTitleNavBar(titleModule);
        }
    }

    componentWillUnmount() {
        this.props.updateTitleNavBar('');
    }

    _cleanSearch() {
        const {fields: {contactType,contactFunction}, clearFilter} = this.props;
        clearFilter();
        contactFunction.onChange(null);
        contactType.onChange(null);
    }

    _onChangeFunctionStatus(val) {
        const {fields: {contactFunction}, changeFunction} = this.props;
        contactFunction.onChange(val);
        changeFunction(val);
        if (val) {
            this._handleContactsFind();
        }
    }

    _onChangeTypeStatus(val) {
        const {fields: {contactType}, changeType} = this.props;
        contactType.onChange(val);
        changeType(val);
        if (val) {
            this._handleContactsFind();
        }
    }

    _handleContactsFind() {
        const {fields: {contactFunction, contactType}, contactsByFunctionOrTypeFindServer, contactsByFunctionOrType, changePage, showLoading} = this.props;
        const order = contactsByFunctionOrType.get('order');
        const columnOrder = contactsByFunctionOrType.get('columnOrder');
        showLoading(true, 'Cargando..');
        contactsByFunctionOrTypeFindServer(contactFunction.value, contactType.value, 1, NUMBER_RECORDS, order, columnOrder)
            .then((data) => {
                if (_.has(data, 'payload.data')) {
                    showLoading(false, null);
                    changePage(1);
                }
            }, (reason) => {
            });
    }

    render() {
        var visibleTable = 'none';
        var visibleMessage = 'block';
        const {fields: {contactFunction, contactType}, handleSubmit, reducerGlobal, contactsByFunctionOrType, selectsReducer} = this.props;
        if (_.size(contactsByFunctionOrType.get('responseContacts')) !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }

        return (
            <div>
                <form>
                    <Row style={{borderBottom: "2px solid #D9DEDF", paddingTop:"15px", paddingBottom:"17px",paddingLeft:"17px", paddingRight:"17px"}}>
                        <Col xs={12} sm={12} md={4} lg={4} style={{width: '100%'}}>
                            <ComboBox
                                name="contactFunction"
                                labelInput="Función del contacto"
                                {...contactFunction}
                                onChange={val => this._onChangeFunctionStatus(val)}
                                value={contactFunction.value}
                                onBlur={contactFunction.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                data={selectsReducer.get('dataTypeFunction') || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={4} lg={4} style={{width: '100%'}}>
                            <ComboBox
                                name="contactType"
                                labelInput="Tipo del contacto"
                                {...contactType}
                                onChange={val => this._onChangeTypeStatus(val)}
                                value={contactType.value}
                                onBlur={contactType.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                data={selectsReducer.get('dataTypeContact') || []}
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
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Grid style={{display: visibleTable, width: "98%"}}>
                            <Row>
                                <Col xs>
                                    <ListContactByFunctionOrType />
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
        contactsByFunctionOrTypeFindServer,
        clearFilter,
        getMasterDataFields,
        changePage,
        updateTitleNavBar,
        consultDataSelect,
        showLoading,
        changeFunction,
        changeType
    }, dispatch);
}

function mapStateToProps({contactsByFunctionOrType, selectsReducer, navBar, reducerGlobal}, {fields}) {
    return {
        contactsByFunctionOrType,
        selectsReducer,
        navBar,
        reducerGlobal,
        initialValues: {contactFunction: null, contactType:null}
    };
}

export default reduxForm({
    form: FORM_FILTERS_CONTACT_BY_FUNCTION_OR_TYPE,
    fields
}, mapStateToProps, mapDispatchToProps)(ContactsByFunctionOrType);

