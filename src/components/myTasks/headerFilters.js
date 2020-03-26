import React, {Component} from 'react';
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import {Col, Row} from "react-flexbox-grid";
import {bindActionCreators} from "redux";
import {reduxForm} from "redux-form";
import DateTimePickerUi from "../../ui/dateTimePicker/dateTimePickerComponent";
import {getUserAssistantsById} from "./actions";
import MultipleSelect from "../../ui/multipleSelect/multipleSelectComponent";
import moment from "moment";
import {MESSAGE_ERROR} from "../../constantsGlobal";
import {swtShowMessage} from "../sweetAlertMessages/actions";

const fields = ["users", "rol", "initialDate", "finalDate"];
const rolFilter = [
    {'id': 'RESPONSIBLE', 'value': "Responsable"},
    {'id': 'ASSIGNED', 'value': "Asignador"}
];

export class HeaderFilters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subordinates: [],
            user: null,
            rol: null,
            initialDate: null,
            finalDate: null
        }
    }

    async componentDidMount() {
        const {fields: {users, rol, initialDate, finalDate}, dispatchGetUserAssistantsById} = this.props;
        let userName = window.localStorage.getItem("name");
        const getAssistant = await dispatchGetUserAssistantsById();
        await this.setState({
            subordinates: _.get(getAssistant, 'payload.data.data')
        });

        let value = _.find(_.get(getAssistant, 'payload.data.data'), prop => prop.name === userName);

        rol.onChange("RESPONSIBLE");
        users.onChange(JSON.stringify(value.id));

        const dateInitial = moment();
        dateInitial.subtract(3, 'months');
        initialDate.onChange(dateInitial);

        const dateFinal = moment();
        finalDate.onChange(dateFinal);
    }

    validateFilter = () => {
        const {fields: {users, rol, initialDate, finalDate}, dispatchShowMessage} = this.props;

        let errorField = "";
        if (_.isEmpty(users.value)) {
            errorField = 'Señor usuario, el campo Usuario es obligatorio';
            dispatchShowMessage(MESSAGE_ERROR, "Campos obligatorios", errorField);
        }
        if (_.isEmpty(rol.value)) {
            errorField = 'Señor usuario, el campo Rol es obligatorio';
            dispatchShowMessage(MESSAGE_ERROR, "Campos obligatorios", errorField);
        }
        if (_.isEmpty(initialDate.value)) {
            errorField = 'Señor usuario, el campo Desde es obligatorio';
            dispatchShowMessage(MESSAGE_ERROR, "Campos obligatorios", errorField);
        }
        if (_.isEmpty(finalDate.value)) {
            errorField = 'Señor usuario, el campo Hasta es obligatorio';
            dispatchShowMessage(MESSAGE_ERROR, "Campos obligatorios", errorField);
        }

    };

    searchByFilters = () => {
        this.validateFilter();
    };

    render() {
        const {fields: {users, rol, initialDate, finalDate}} = this.props;
        return (
            <div style={{paddingTop: "10px", width: "100%", paddingBottom: "50px"}}>
                <Row style={{padding: "5px 10px 0px 20px"}}>
                    <Col xs={3} sm={3} md={3} lg={3}>
                        <span>Usuario</span>
                        <MultipleSelect
                            {...users}
                            name="usuarios"
                            labelInput="Seleccione"
                            valueProp={'id'}
                            textProp={'name'}
                            touched={true}
                            data={this.state.subordinates}
                            maxSelections={15}
                            onChange={(val) => this.searchByFilters(initialDate.value, finalDate.value)}
                        />
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={3}>
                        <span>Rol</span>
                        <ComboBox
                            {...rol}
                            name="rol"
                            labelInput="Rol"
                            valueProp={'id'}
                            textProp={'value'}
                            data={rolFilter}
                        />
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={3}>
                        <span>Desde</span>
                        <DateTimePickerUi
                            {...initialDate}
                            culture='es'
                            format={"DD/MM/YYYY"}
                            time={false}
                            placeholder='DD/MM/YYYY'
                            className='field-input'
                            name="initialDate"
                        />
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={3}>
                        <span>Hasta</span>
                        <DateTimePickerUi
                            {...finalDate}
                            culture='es'
                            format={"DD/MM/YYYY"}
                            time={false}
                            placeholder='DD/MM/YYYY'
                            className='field-input'
                            name="finalDate"
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchGetUserAssistantsById: getUserAssistantsById,
        dispatchShowMessage: swtShowMessage
    }, dispatch);
}

function mapStateToProps({reducerGlobal}) {
    return {
        reducerGlobal
    };
}

export default reduxForm({form: 'simple', fields}, mapStateToProps, mapDispatchToProps)(HeaderFilters);