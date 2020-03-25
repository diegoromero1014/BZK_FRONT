import React, {Component} from 'react';
import '../../../styles/field/main.scss';
import Tooltip from "../toolTip/toolTipComponent";
import {Col, Row} from "react-flexbox-grid";
import {ErrorMessage, Field, Form, withFormik} from "formik";
import {schema} from "./taskSchema";
import {renderLabel, renderMessageError} from "../../functions";
import DateTimePickerUi from "../../ui/dateTimePicker/dateTimePickerComponent";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import RichText from "../richText/richTextComponent";
import Textarea from "../../ui/textarea/textareaComponent";
import * as Yup from 'yup';
import SearchEmployeeInput from "../globalComponents/searchEmployeeInput/component";

export class TaskFormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                closingDate: {
                    name: 'Fecha de cierre',
                    nullable: false,
                    message: null
                },
                state: {
                    name: 'Estado',
                    nullable: false,
                    message: null
                },
                responsible: {
                    name: 'Responsable',
                    nullable: false,
                    message: null
                },
                task: {
                    name: 'Tarea',
                    nullable: false,
                    message: null
                },
                observations: {
                    name: 'Observaciones',
                    nullable: true,
                    message: null
                }
            }
        }
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

    onSelectEmployee = employee => {
        const { setFieldValue } = this.props;
        if (employee.idUsuario) {
            setFieldValue('responsible', employee.idUsuario, true);
            setFieldValue('employeeName', employee.title, true);
        }
    };

    validateOnChangeEmployee = value => {
        const { setFieldValue } = this.props;
        setFieldValue('employeeName', value, true);
    };

    componentDidMount() {
        this.forceUpdate();
    }

    render() {
        const {fields: {closingDate, state, responsible, task, observations}} = this.state;
        const { isEditable, setFieldValue, stateTask, values: {employeeName}, commercialReportButtons, children} = this.props;
        return (
            <div>
                <Form style={{backgroundColor: "#FFFFFF",  width: "100%", paddingBottom: "50px"}}>

                    <Row style={{width: '99%', paddingLeft: 20}}>
                        <Col xs={4}>
                            <Field type="date" name="finalDate">
                                {({field: {value, name, onBlur}}) =>
                                    <div>
                                        {renderLabel(closingDate)}
                                        <DateTimePickerUi
                                            culture='es'
                                            format={"DD/MM/YYYY"}
                                            time={false}
                                            value={value}
                                            onChange={val => setFieldValue(name, val, false)}
                                            onBlur={onBlur}
                                            placeholder='DD/MM/YYYY'
                                            className='field-input'
                                            name="finalDate"
                                            disabled={isEditable ? 'disabled' : ''}
                                        />
                                        <ErrorMessage name="finalDate" component={'div'}>
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }
                            </Field>
                        </Col>
                        <Col xs={4}>
                            <Field type="text" name="idStatus">
                                {({field: {value, name, onBlur}}) =>
                                    <div>
                                        {renderLabel(state)}
                                        <ComboBox
                                            name="idStatus"
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            value={value}
                                            onChange={(id, val) => {
                                                setFieldValue(name, id, false);
                                            }}
                                            onBlur={onBlur}
                                            data={stateTask || []}
                                            className='field-input'
                                            disabled={isEditable ? 'disabled' : ''}
                                            parentId="dashboardComponentScroll"
                                            filterData={true}
                                        />

                                        <ErrorMessage name="idStatus" component={'div'}>
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }
                            </Field>
                        </Col>
                        <Col xs={4}>
                            <Field type="text" name="employeeName">
                                {({field: {value, name, onBlur}}) =>
                                    <div>
                                        {renderLabel(responsible)}
                                        <SearchEmployeeInput
                                            inputName={name}
                                            value={employeeName ? employeeName : value}
                                            onSelect={this.onSelectEmployee}
                                            validateOnChange={this.validateOnChangeEmployee}
                                            isEditable={isEditable}
                                        />
                                        <ErrorMessage name="employeeName" component={'div'}>
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }
                            </Field>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 40, width: '99%', paddingLeft: 20}}>
                        <Col xs={12} md={12} lg={12}>
                            <Field type="text" name="task">
                                {({field: {value, name, onBlur}}) =>
                                    <div>
                                        {renderLabel(task)}
                                        <RichText
                                            name="task"
                                            labelInput="Ingrese la tarea"
                                            parentId="dashboardComponentScroll"
                                            onChange={val => setFieldValue(name, val, false)}
                                            value={value}
                                            style={{width: '100%', height: '178px'}}
                                            readOnly={isEditable}
                                            disabled={!isEditable ? '' : 'disabled'}
                                        />
                                        <br/>
                                        <ErrorMessage name="task" component={'div'}>
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }
                            </Field>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 40, width: '99%', paddingLeft: 20}}>
                        <Col xs={12} md={12} lg={12}>
                            <Field type="text" name="advance">
                                {({field: {value, name, onBlur}}) =>
                                    <div>
                                        {renderLabel(observations)}
                                        <Textarea
                                            name="advance"
                                            type="text"
                                            max="1000"
                                            value={value}
                                            onChange={val => setFieldValue(name, val, false)}
                                            title="La longitud máxima de caracteres es de 1000"
                                            style={{width: '100%', height: '120px'}}
                                            disabled={!isEditable ? '' : 'disabled'}
                                        />
                                        <br/>
                                        <ErrorMessage name="advance" component={'div'}>
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }
                            </Field>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: 40, width: '99%', paddingLeft: 20}}>
                        <Col xs={12} md={12} lg={12}>
                            {children}
                        </Col>
                    </Row>
                    {commercialReportButtons(setFieldValue)}
                </Form>
            </div>
        );
    }
}

export default withFormik({
    handleSubmit: (values, {props}) => {
        props.onSubmit(values);
    },

    mapPropsToValues: (props) => {
        const {taskData} = props;
        const fields = {};
        if (taskData) {
            const {finalDate, idStatus, idResponsable, task, advance, userName} = taskData;
            return Object.assign({}, fields, {
                finalDate: new Date(finalDate),
                idStatus,
                responsible: idResponsable,
                task,
                advance,
                employeeName: userName
            })
        } else {
            return Object.assign({}, fields, {
                finalDate: new Date(),
                idStatus: '',
                responsible: '',
                task: '',
                advance: '',
                employeeName: ''
            });
        }
    },
    validationSchema: () => {
        const object = {};
        const objectSchema = Object.assign({}, schema, object);
        return Yup.object().shape(objectSchema);
    }
})(TaskFormComponent);