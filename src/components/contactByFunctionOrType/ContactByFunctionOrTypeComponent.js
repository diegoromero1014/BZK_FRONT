import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { contactsByFunctionOrTypeFindServer, clearFilter, changePage, changeFunction, changeType, changePosition, changeDependency } from './actions';
import { showLoading } from '../loading/actions';
import { NUMBER_RECORDS, FORM_FILTERS_CONTACT_BY_FUNCTION_OR_TYPE } from './constants';
import Pagination from './pagination';
import { redirectUrl } from '../globalComponents/actions';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import {
    getMasterDataFields,
    consultDataSelect,
} from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';
import { reduxForm } from 'redux-form';
import { updateTitleNavBar } from '../navBar/actions';
import ListContactByFunctionOrType from './listContactByFunctionOrType';
import _ from 'lodash';

const fields = ['contactFunction', 'contactType', 'contactPositionFilter', 'contactDependencyFilter'];
const titleModule = 'Búsqueda avanzada';

class ContactsByFunctionOrType extends Component {
    constructor(props) {
        super(props);
        this._onChangeFunctionStatus = this._onChangeFunctionStatus.bind(this);
        this._onChangeTypeStatus = this._onChangeTypeStatus.bind(this);
        this._onChangePositionStatus = this._onChangePositionStatus.bind(this);
        this._onChangeDependencyStatus = this._onChangeDependencyStatus.bind(this);
        this._handleContactsFind = this._handleContactsFind.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionTokenFront') === "" || window.localStorage.getItem('sessionTokenFront') === undefined) {
            redirectUrl("/login");
        } else {
            const { clearFilter, getMasterDataFields, consultDataSelect, updateTitleNavBar } = this.props;
            consultDataSelect(constants.FILTER_FUNCTION_ID);
            consultDataSelect(constants.FILTER_TYPE_CONTACT_ID);
            consultDataSelect(constants.FILTER_CONTACT_POSITION);
            consultDataSelect(constants.FILTER_DEPENDENCY);
            clearFilter();
            updateTitleNavBar(titleModule);
        }
    }

    componentWillUnmount() {
        this.props.updateTitleNavBar('');
    }

    _cleanSearch() {
        const { fields: { contactType, contactFunction, contactPositionFilter, contactDependencyFilter }, clearFilter } = this.props;
        clearFilter();
        contactFunction.onChange(null);
        contactType.onChange(null);
        contactPositionFilter.onChange(null);
        contactDependencyFilter.onChange(null);
    }

    _onChangeFunctionStatus(val) {
        const { fields: { contactFunction }, changeFunction } = this.props;
        contactFunction.onChange(val);
        changeFunction(val);
        if (val) {
            this._handleContactsFind();
        }
    }

    _onChangeTypeStatus(val) {
        const { fields: { contactType }, changeType } = this.props;
        contactType.onChange(val);
        changeType(val);
        if (val) {
            this._handleContactsFind();
        }
    }

    _onChangePositionStatus(val) {
        const { fields: { contactPositionFilter }, changePosition } = this.props;
        contactPositionFilter.onChange(val);
        changePosition(val);
        if (val) {
            this._handleContactsFind();
        }
    }

    _onChangeDependencyStatus(val) {
        const { fields: { contactDependencyFilter }, changeDependency } = this.props;
        contactDependencyFilter.onChange(val);
        changeDependency(val);
        if (val) {
            this._handleContactsFind();
        }
    }

    _handleContactsFind() {
        const { fields: { contactFunction, contactType, contactPositionFilter, contactDependencyFilter }, contactsByFunctionOrTypeFindServer, contactsByFunctionOrType, changePage, showLoading } = this.props;
        const order = contactsByFunctionOrType.get('order');
        const columnOrder = contactsByFunctionOrType.get('columnOrder');
        showLoading(true, 'Cargando..');
        contactsByFunctionOrTypeFindServer(contactFunction.value, contactType.value, contactPositionFilter.value, contactDependencyFilter.value, 1, NUMBER_RECORDS, order, columnOrder)
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
        const { fields: { contactFunction, contactType, contactPositionFilter, contactDependencyFilter }, handleSubmit, reducerGlobal, contactsByFunctionOrType, selectsReducer } = this.props;
        if (_.size(contactsByFunctionOrType.get('responseContacts')) !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }
        const totalContactsFiltered = contactsByFunctionOrType.get('totalContactsFiltered');
        return (
            <div>
                <form>
                    <Row style={{ borderBottom: "2px solid #D9DEDF", paddingTop: "15px", paddingBottom: "17px", paddingLeft: "17px", paddingRight: "17px" }}>
                        <Col xs={12} sm={12} md={2} lg={2} style={{ width: '100%' }}>
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
                        <Col xs={12} sm={12} md={2} lg={2} style={{ width: '100%' }}>
                            <ComboBox
                                name="contactType"
                                labelInput="Tipo de contacto"
                                {...contactType}
                                onChange={val => this._onChangeTypeStatus(val)}
                                value={contactType.value}
                                onBlur={contactType.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                data={selectsReducer.get('dataTypeContact') || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} style={{ width: '100%' }}>
                            <ComboBox
                                name="contactPositionFilter"
                                labelInput="Cargo"
                                {...contactPositionFilter}
                                onChange={val => this._onChangePositionStatus(val)}
                                value={contactPositionFilter.value}
                                onBlur={contactPositionFilter.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                data={selectsReducer.get('dataTypeContactPosition') || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} style={{ width: '100%' }}>
                            <ComboBox
                                name="contactDependencyFilter"
                                labelInput="Área"
                                {...contactDependencyFilter}
                                onChange={val => this._onChangeDependencyStatus(val)}
                                value={contactDependencyFilter.value}
                                onBlur={contactDependencyFilter.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                data={selectsReducer.get('dataTypeDependency') || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={1} lg={1} style={{ width: '100%' }}>
                            <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                                title="Limpiar búsqueda" style={{ marginLeft: "17px" }}>
                                <i className="erase icon"
                                    style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
                            </button>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <button className="btn btn-primary" type="button" onClick={() => redirectUrl("/dashboard/contacts")}
                                title="Cambiar búsqueda">
                                <i className="refresh icon" style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i> Cambiar tipo de búsqueda
                            </button>
                        </Col>
                    </Row>
                </form>
                <Row>
                    <div style={{ padding: "15px", fontSize: '25px', textAlign: 'center', width: '100%' }}>
                        Total: {totalContactsFiltered}
                    </div>
                </Row>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Grid style={{ display: visibleTable, width: "98%" }}>
                            <Row>
                                <Col xs>
                                    <ListContactByFunctionOrType />
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
        contactsByFunctionOrTypeFindServer,
        clearFilter,
        getMasterDataFields,
        changePage,
        updateTitleNavBar,
        consultDataSelect,
        showLoading,
        changeFunction,
        changeType,
        changePosition,
        changeDependency
    }, dispatch);
}

function mapStateToProps({ contactsByFunctionOrType, selectsReducer, navBar, reducerGlobal }, { fields }) {
    return {
        contactsByFunctionOrType,
        selectsReducer,
        navBar,
        reducerGlobal,
        initialValues: { contactFunction: null, contactType: null, contactPositionFilter: null, contactDependencyFilter: null }
    };
}

export default reduxForm({
    form: FORM_FILTERS_CONTACT_BY_FUNCTION_OR_TYPE,
    fields
}, mapStateToProps, mapDispatchToProps)(ContactsByFunctionOrType);

