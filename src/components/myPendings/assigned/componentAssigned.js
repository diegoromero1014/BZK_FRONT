import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { updateTitleNavBar } from '../../navBar/actions';
import _ from 'lodash';
import { validateResponse } from '../../../actionsGlobal';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT, GREEN_COLOR, ORANGE_COLOR, RED_COLOR } from '../../../constantsGlobal';
import { getAssigned, clearListOfAssigned } from './actions';
import ListAssigned from './listAssigned';
import PaginationAssigned from './paginationAssigned';
import { NUMBER_RECORDS } from './constants';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import { reduxForm } from 'redux-form';
import { Dropdown } from 'semantic-ui-react'

const fields = ['stateTask', 'trafficLight'];
const optionsColorExpiration = [
    {
        text: 'Seleccione...',
        value: '-1'
    },
    {
        text: 'Tarea vencida',
        value: '0',
        label: { color: 'red-ayax', empty: true, circular: true },
    },
    {
        text: 'Tarea próxima a vencerse',
        value: '1',
        label: { color: 'orange-ayax', empty: true, circular: true },
    },
    {
        text: 'Tarea con tiempo',
        value: '2',
        label: { color: 'green-ayax', empty: true, circular: true },
    }
];

class ComponentAssigned extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentWillMount() {
        const { updateTitleNavBar, swtShowMessage, clearListOfAssigned, assignedReducer, getAssigned } = this.props;
        var paginationAssigned = {
            statusOfTask: null,
            clientNumber: null,
            clientName: null,
            sortOrder: assignedReducer.get('sortOrder'),
            pageNum: assignedReducer.get('limInf'),
            maxRows: NUMBER_RECORDS
        };
        updateTitleNavBar("Asignadas");
        clearListOfAssigned();
        getAssigned(paginationAssigned).then((data) => {
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            }
        }, (reason) => {
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    render() {
        const { fields: { stateTask }, assignedReducer, selectsReducer } = this.props;
        const listAssigned = assignedReducer.get('assigned');
        var visibleTable = 'none';
        var visibleMessage = 'block';
        if (assignedReducer.get('rowCount') !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }
        return (
            <div className="tab-pane quickZoomIn animated" style={{ width: "100%", marginTop: "10px", marginBottom: "20px" }}>
                <div style={{ zIndex: 0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'initial', marginLeft: '10px', marginRight: '10px' }}>
                    <Grid style={{ width: "100%" }}>
                        <Row>
                            <Col xs={12} sm={12} md={5} lg={5}>
                                <div className="InputAddOn">
                                    <input type="text" style={{ padding: '0px 11px !important' }} id="searchExpression" onKeyPress={this._handleChangeKeyword} type="text" placeholder="Búsqueda por número o nombre del cliente" value={this.state.keywordMyPending} onChange={this._handleChangeKeyword} className="input-lg input InputAddOn-field" />
                                    <button id="searchClients" className="btn" title="Buscar" type="button" onClick={this._handleClientsFind} style={{ backgroundColor: "#E0E2E2" }}>
                                        <i className="search icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                                    </button>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3}>
                                <ComboBox
                                    name="stateTask"
                                    labelInput="Estado de la tarea"
                                    {...stateTask}
                                    onChange={val => this._onChangeTypeStatus(val)}
                                    value={stateTask.value}
                                    onBlur={stateTask.onBlur}
                                    valueProp={'id'}
                                    textProp={'value'}
                                    data={selectsReducer.get('dataTypeContact') || []}
                                />
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3}>
                                <Dropdown value={0}
                                    onChange={(e, val) => { this._onChangeStatusCovenant(val.value) }}
                                    placeholder='Por favor, seleccione un estado' fluid search selection
                                    options={optionsColorExpiration}
                                />
                            </Col>
                            <Col xs={12} sm={12} md={1} lg={1} style={{ width: '100%' }}>
                                <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                                    title="Limpiar búsqueda" style={{ marginLeft: "17px" }}>
                                    <i className="erase icon"
                                        style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
                                </button>
                            </Col>
                        </Row>
                    </Grid>
                </div>
                <Grid style={{ display: visibleTable, width: "100%", marginBottom: '10px' }}>
                    <Row style={{ backgroundColor: 'white', marginLeft: '10px', marginRight: '10px' }}>
                        <Col style={{ width: '100%' }}>
                            <ListAssigned listAssigned={listAssigned} />
                            <div style={{ marginBottom: '10px' }}>
                                <PaginationAssigned />
                            </div>
                        </Col>
                    </Row>
                </Grid>
                <Grid style={{ display: visibleMessage, width: "100%" }}>
                    <Row center="xs">
                        <Col xs={12} sm={8} md={12} lg={12} style={{ marginTop: '15px' }}>
                            <span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado pendientes asignados</span>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar,
        swtShowMessage,
        getAssigned,
        clearListOfAssigned
    }, dispatch);
}

function mapStateToProps({ assignedReducer, selectsReducer }, ownerProps) {
    return {
        assignedReducer,
        selectsReducer
    };
}

export default reduxForm({
    fields
}, mapStateToProps, mapDispatchToProps)(ComponentAssigned);
