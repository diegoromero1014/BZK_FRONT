import React, {Component} from "react";
import Tooltip from "../toolTip/toolTipComponent";
import {ErrorMessage, Field, Form, withFormik} from "formik";
import {Col, Row} from "react-flexbox-grid";
import {renderLabel, renderMessageError} from "../../functions";
import DateTimePickerUi from "../../ui/dateTimePicker/dateTimePickerComponent";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {changeTeam, clearFilter} from "../sheduler/actions";
import {consultInfoClient} from "../clientInformation/actions";
import {validatePermissionsByModule} from "../../actionsGlobal";
import {
    clearLists,
    consultDataSelect,
    consultListWithParameter,
    consultListWithParameterUbication, getMasterDataFields,
    getRegionsByEmployee
} from "../selectsComponent/actions";
import {showLoading} from "../loading/actions";
import {
    LIST_REGIONS,
    LIST_ZONES,
    TASK_STATUS,
    TEAM_FOR_EMPLOYEE_REGION_ZONE,
    TEAM_VALUE_OBJECTS
} from "../selectsComponent/constants";

export class AdvancedFilters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                closingDateFrom: {
                    name: 'Desde',
                    nullable: false,
                    message: null
                },
                closingDateTo: {
                    name: 'Hasta',
                    nullable: false,
                    message: null
                },
                region: {
                    name: 'Región',
                    nullable: true,
                    message: null
                },
                zone: {
                    name: 'Zona',
                    nullable: true,
                    message: null
                },
                cell: {
                    name: 'Célula',
                    nullable: true,
                    message: null
                },
                state: {
                    name: 'Estado',
                    nullable: true,
                    message: null
                }
            }
        }
    }

    async componentDidMount() {
        await this.masterDataFields();
    }

    renderTitle = ({name, message, nullable}) => (
        <div style={{
            fontSize: "23px",
            color: "#CEA70B",
            marginTop: "5px",
            marginBottom: "5px",
            display: "-webkit-inline-box"
        }}>
            <i className="browser icon" style={{fontSize: "20px"}}/>
            <span>{`${name} ${!nullable ? '(' : ''}`}</span>
            {!nullable && <span style={{color: 'red'}}>*</span>}
            {!nullable && ')'}

            {message &&
            <Tooltip text={message}>
                <i className="help circle icon blue" style={{fontSize: "16px", cursor: "pointer", marginLeft: "10px"}}/>
            </Tooltip>
            }
        </div>
    );

    masterDataFields = async () => {
        const {dispatchGetMasterDataFields} = this.props;
        await dispatchGetMasterDataFields([TASK_STATUS, LIST_REGIONS, LIST_ZONES, TEAM_VALUE_OBJECTS]);
    };

    onChangeRegionStatus = val =>  {
        const { setFieldValue, consultListWithParameterUbicationDispatch, clearListsDispatch} = this.props;
        /*region.onChange(val);
        zone.onChange("");
        team.onChange("");*/

        clearListsDispatch([LIST_ZONES, TEAM_VALUE_OBJECTS]);

        if (!_.isEqual(val, "")) {
            consultListWithParameterUbicationDispatch(LIST_ZONES, val);
        }

        setFieldValue('region', val, true);
        setFieldValue('zone', '', true);
    };

    onChangeZoneStatus = val => {
        const {consultListWithParameterDispatch, clearListsDispatch, setFieldValue, values: {region}, consultListWithParameterUbicationDispatch} = this.props;
        /*zone.onChange(val);
        team.onChange("");*/
        setFieldValue('zone', val, true);
        clearListsDispatch([TEAM_VALUE_OBJECTS]);

        debugger;
        if (val) {
            consultListWithParameterUbicationDispatch(TEAM_FOR_EMPLOYEE_REGION_ZONE, val);
            /*consultListWithParameterDispatch(TEAM_FOR_EMPLOYEE_REGION_ZONE, {
                region: region,
                zone: val
            });*/
            //this._handlePrevisitsFind();
        }

    };

    render() {
        const {fields: {closingDateFrom, closingDateTo, region, zone, cell, state}} = this.state;
        const {selectsReducer, setFieldValue} = this.props;
        return (<div>
                <Form style={{backgroundColor: "#FFFFFF", width: "100%", paddingBottom: "50px"}}>
                    <Row style={{width: '99%', paddingLeft: 20}}>
                        <Col xs={12}><label>Fecha de cierre</label></Col>
                        <Col xs={6}>
                            <Field type="date" name="closingDateFrom">
                                {({field: {value, name, onBlur}}) =>
                                    <div>
                                        {renderLabel(closingDateFrom)}
                                        <DateTimePickerUi
                                            culture='es'
                                            format={"DD/MM/YYYY"}
                                            time={false}
                                            value={value}
                                            onChange={val => setFieldValue(name, val, false)}
                                            onBlur={onBlur}
                                            placeholder='DD/MM/YYYY'
                                            className='field-input'
                                            name="closingDateFrom"
                                        />
                                        <ErrorMessage name="closingDateFrom" component={'div'}>
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }
                            </Field>
                        </Col>
                        <Col xs={6}>
                            <Field type="text" name="closingDateTo">
                                {({field: {value, name, onBlur}}) =>
                                    <div>
                                        {renderLabel(closingDateTo)}
                                        <DateTimePickerUi
                                            culture='es'
                                            format={"DD/MM/YYYY"}
                                            time={false}
                                            value={value}
                                            onChange={val => setFieldValue(name, val, false)}
                                            onBlur={onBlur}
                                            placeholder='DD/MM/YYYY'
                                            className='field-input'
                                            name="closingDateTo"
                                        />

                                        <ErrorMessage name="closingDateTo" component={'div'}>
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }
                            </Field>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 40, width: '99%', paddingLeft: 20}}>
                        <Col xs={12} md={12} lg={12}>
                            <Field type="text" name="region">
                                {({field: {value, name, onBlur}}) =>
                                    <div>
                                        {renderLabel(region)}
                                        <ComboBox
                                            name="region"
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            value={value}
                                            onChange={val => this.onChangeRegionStatus(val)}
                                            onBlur={onBlur}
                                            data={selectsReducer.get(LIST_REGIONS) || []}
                                            className='field-input'
                                            parentId="dashboardComponentScroll"
                                            filterData={true}
                                        />
                                        <ErrorMessage name="region" component={'div'}>
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }
                            </Field>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 40, width: '99%', paddingLeft: 20}}>
                        <Col xs={12} md={12} lg={12}>
                            <Field type="text" name="zone">
                                {({field: {value, name, onBlur}}) =>
                                    <div>
                                        {renderLabel(zone)}
                                        <ComboBox
                                            name="zone"
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            value={value}
                                            onChange={val => this.onChangeZoneStatus(val)}
                                            onBlur={onBlur}
                                            data={selectsReducer.get(LIST_ZONES) || []}
                                            className='field-input'
                                            parentId="dashboardComponentScroll"
                                            filterData={true}
                                        />
                                        <ErrorMessage name="zone" component={'div'}>
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }
                            </Field>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 40, width: '99%', paddingLeft: 20}}>
                        <Col xs={12} md={12} lg={12}>
                            <Field type="text" name="cell">
                                {({field: {value, name, onBlur}}) =>
                                    <div>
                                        {renderLabel(cell)}
                                        <ComboBox
                                            name="cell"
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            value={value}
                                            onChange={(id, val) => {
                                                setFieldValue(name, id, false);
                                            }}
                                            onBlur={onBlur}
                                            data={selectsReducer.get(TEAM_VALUE_OBJECTS) || []}
                                            className='field-input'
                                            parentId="dashboardComponentScroll"
                                            filterData={true}
                                        />
                                        <ErrorMessage name="cell" component={'div'}>
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }
                            </Field>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 40, width: '99%', paddingLeft: 20}}>
                        <Col xs={12} md={12} lg={12}>
                            <Field type="text" name="state">
                                {({field: {value, name, onBlur}}) =>
                                    <div>
                                        {renderLabel(state)}
                                        <ComboBox
                                            name="state"
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            value={value}
                                            onChange={(id, val) => {
                                                setFieldValue(name, id, false);
                                            }}
                                            onBlur={onBlur}
                                            data={selectsReducer.get(TASK_STATUS) || []}
                                            className='field-input'
                                            parentId="dashboardComponentScroll"
                                            filterData={true}
                                        />
                                        <ErrorMessage name="state" component={'div'}>
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }
                            </Field>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

const form = withFormik({
    handleSubmit: (values, {props}) => {
        props.onSubmit(values);
    },

    mapPropsToValues: (props) => {}
})(AdvancedFilters);

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultInfoClientDispatch: consultInfoClient,
        validatePermissionsByModuleDispatch: validatePermissionsByModule,
        consultDataSelectDispatch: consultDataSelect,
        consultListWithParameterUbicationDispatch: consultListWithParameterUbication,
        consultListWithParameterDispatch: consultListWithParameter,
        changeTeam,
        showLoadingDispatch: showLoading,
        clearFilterDispatch: clearFilter,
        getRegionsByEmployeeDispatch: getRegionsByEmployee,
        clearListsDispatch: clearLists,
        dispatchGetMasterDataFields: getMasterDataFields,
    }, dispatch);
}

function mapStateToProps({selectsReducer}) {
    return {
        selectsReducer,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(form);