import React, {Component} from "react";
import Tooltip from "../toolTip/toolTipComponent";
import {ErrorMessage, Field, Form, withFormik} from "formik";
import {Col, Row} from "react-flexbox-grid";
import {renderLabel, renderMessageError} from "../../functions";
import DateTimePickerUi from "../../ui/dateTimePicker/dateTimePickerComponent";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {
    consultListWithParameter,
    consultListWithParameterUbication,
    getMasterDataFields,
    getRegionsByEmployee
} from "../selectsComponent/actions";
import {
    LIST_REGIONS,
    LIST_ZONES,
    TEAM_FOR_EMPLOYEE_REGION_ZONE,
    TEAM_VALUE_OBJECTS
} from "../selectsComponent/constants";
import moment from "moment";
import _ from 'lodash';
import {schema} from "./advancedFiltersSchema";
import * as Yup from 'yup';

export class AdvancedFilters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                closingDateFromState: {
                    name: 'Desde',
                    nullable: true,
                    message: null
                },
                closingDateTo: {
                    name: 'Hasta',
                    nullable: true,
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
                }
            },
            initial: null,
            finalDate: null,
            defaultInitial: null,
            defaultFinal: null
        }
    }

    async componentDidMount() {
        const {setFieldValue, defaultFilters} = this.props;
        await this.masterDataFields();
        setFieldValue('closingDateTo', moment(), true);
        setFieldValue('closingDateFrom', moment(defaultFilters.initialDate).format("DD/MM/YYYY"));
        await this.setState({
            initial: moment(defaultFilters.initialDate).format("DD/MM/YYYY"),
            defaultInitial: moment(defaultFilters.initialDate).format("DD/MM/YYYY"),
            finalDate: moment(),
            defaultFinal: moment()
        });
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
        await dispatchGetMasterDataFields([LIST_REGIONS]);
    };

    onChangeClosingDateTo = async val => {
        const {setFieldValue} = this.props;
        if (_.isEmpty(val)) {
            val = moment();
            await this.setState({
                finalDate: val
            });
        }
        setFieldValue('closingDateTo', val, true);
        await this.setState({
            finalDate: val
        })
        this.dispatchAdvancedFilters();
    };

    onChangeClosingDateFrom =  async val => {
        const {setFieldValue, defaultFilters} = this.props;
        if (_.isEmpty(val)) {
            val = moment(defaultFilters.initialDate).format("DD/MM/YYYY");
            await this.setState({
                initial: val
            });
        }
        setFieldValue('closingDateFrom', val, true);
        await this.setState({
            initial: val
        })
        this.dispatchAdvancedFilters();
    };

    onChangeRegionStatus = val => {
        const {setFieldValue, consultListWithParameterUbicationDispatch, consultListWithParameterDispatch} = this.props;

        if (!_.isEqual(val, "")) {
            consultListWithParameterUbicationDispatch(LIST_ZONES, val);
            consultListWithParameterDispatch(TEAM_FOR_EMPLOYEE_REGION_ZONE, {
                region: val,
                zone: 0
            });
            setFieldValue('region', val, true);
            setFieldValue('zone', '', true);
            setFieldValue('cell', '', true);
            this.dispatchAdvancedFilters();
        }
    };

    onChangeZoneStatus = val => {
        const {consultListWithParameterDispatch, setFieldValue, values: {region}} = this.props;

        if (val) {
            consultListWithParameterDispatch(TEAM_FOR_EMPLOYEE_REGION_ZONE, {
                region: region,
                zone: val
            });
            setFieldValue('zone', val, true);
            setFieldValue('cell', '', true);
            this.dispatchAdvancedFilters();
        }
    };

    onChangeCell = val => {
        const {setFieldValue} = this.props;
        setFieldValue('cell', val, true);
        this.dispatchAdvancedFilters();
    };

    dispatchAdvancedFilters = () => {
        const {dispatchFilters, values: {region, zone, cell}} = this.props;
        let filters = {
            closingDateTo: moment(this.state.finalDate, "DD/MM/YYYY").toDate().getTime(),
            closingDateFrom: moment(this.state.initial, "DD/MM/YYYY").toDate().getTime(),
            region,
            zone,
            cell
        };
        dispatchFilters(filters);
    };

    clearForm = () => {
        const {setFieldValue} = this.props;
        setFieldValue('closingDateFrom', this.state.defaultInitial, true);
        setFieldValue('closingDateTo', this.state.defaultFinal, true);
        setFieldValue('region', '', true);
        setFieldValue('zone', '', true);
        setFieldValue('cell', '', true);
        this.dispatchAdvancedFilters();
    };

    render() {
        const {fields: {closingDateFromState, closingDateTo, region, zone, cell}} = this.state;
        const {selectsReducer, doneFilter} = this.props;
        return (<div>
                <Form style={{backgroundColor: "#FFFFFF", width: "100%", paddingBottom: "50px"}}>
                    <Row style={{paddingTop: 20, width: '99%', paddingLeft: 20}}>
                        <Col xs={12}>
                            <h3>Filtrar</h3>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 20, width: '99%', paddingLeft: 20}}>
                        <Col xs={12}><b>Fecha de cierre</b></Col>
                        <Col xs={6}>
                            <Field type="date" name="closingDateFrom">
                                {({field: {value, name, onBlur}}) =>
                                    <div>
                                        {renderLabel(closingDateFromState)}
                                        <DateTimePickerUi
                                            culture='es'
                                            format={"DD/MM/YYYY"}
                                            time={false}
                                            value={this.state.initial}
                                            onChange={val => this.onChangeClosingDateFrom(val)}
                                            onBlur={onBlur}
                                            placeholder='DD/MM/YYYY'
                                            className='field-input'
                                            name="closingDateFrom"
                                            style={{fontSize: "85%"}}
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
                                            value={this.state.finalDate}
                                            onChange={val => this.onChangeClosingDateTo(val)}
                                            onBlur={onBlur}
                                            placeholder='DD/MM/YYYY'
                                            className='field-input'
                                            name="closingDateTo"
                                            style={{fontSize: "85%"}}
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
                                            textProp={'description'}
                                            value={value}
                                            onChange={val => this.onChangeCell(val)}
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
                    <Row style={{paddingTop: 20, width: '99%', paddingLeft: 20}}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{textAlign: "center"}}>
                                <button id="btnDoneFilter"
                                        className="btn"
                                        title="Hecho"
                                        type="button"
                                        style={{
                                            margin: "8px 10px 0px 0px",
                                            backgroundColor: "rgb(79,78,78)",
                                            width: '40%'
                                        }}
                                        onClick={() => doneFilter(false)}>
                                    <span style={{color: "#FFFFFF", padding: "10px"}}>Hecho</span>
                                </button>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '99%', paddingLeft: 20}}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{textAlign: "center"}}>
                                <button id="btnFilter"
                                        className="btn"
                                        title="Limpiar"
                                        type="button"
                                        style={{
                                            margin: "8px 10px 0px 0px",
                                            backgroundColor: "rgb(193, 193, 193)",
                                            width: '40%'
                                        }}
                                        onClick={() => this.clearForm()}>
                                    <span style={{color: "#FFFFFF", padding: "10px"}}>Limpiar</span>
                                </button>
                            </div>
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

    mapPropsToValues: (props) => {
    },

    validationSchema: () => {
        const object = {};
        const objectSchema = Object.assign({}, schema, object);
        return Yup.object().shape(objectSchema);
    }
})(AdvancedFilters);

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultListWithParameterUbicationDispatch: consultListWithParameterUbication,
        consultListWithParameterDispatch: consultListWithParameter,
        getRegionsByEmployeeDispatch: getRegionsByEmployee,
        dispatchGetMasterDataFields: getMasterDataFields,
    }, dispatch);
}

function mapStateToProps({selectsReducer, myTasks}) {
    return {
        selectsReducer,
        myTasks
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(form);