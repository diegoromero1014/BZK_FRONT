import React, {Component} from 'react';
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import {Col, Row} from "react-flexbox-grid";
import {bindActionCreators} from "redux";
import {reduxForm} from "redux-form";
import DateTimePickerUi from "../../ui/dateTimePicker/dateTimePickerComponent";
import {getUserAssistantsById, setRolToSearch} from "./actions";
import MultipleSelect from "../../ui/multipleSelect/multipleSelectComponent";
import moment from "moment";
import {DATE_FORMAT, MESSAGE_ERROR} from "../../constantsGlobal";
import {swtShowMessage} from "../sweetAlertMessages/actions";
import _ from 'lodash';

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
            finalDate: null,
            defaultInitialDate: null,
            defaultFinalDate: null
        }
    }

    async componentDidMount() {
        const {fields: {users, rol, initialDate, finalDate}, dispatchGetUserAssistantsById} = this.props;
        let userName = window.localStorage.getItem("name");
        let dateInitial = await moment().subtract(3, 'months');
        initialDate.onChange(dateInitial);

        let dateFinal = await moment();
        finalDate.onChange(dateFinal);

        const getAssistant = await dispatchGetUserAssistantsById();
        let value = _.find(_.get(getAssistant, 'payload.data.data'), prop => prop.name === userName);
        await this.setState({
            subordinates: _.get(getAssistant, 'payload.data.data'),
            defaultInitialDate: dateInitial,
            defaultFinalDate: dateFinal,
            initialDate: dateInitial,
            finalDate: dateFinal,
            user: value.id
        });

        rol.onChange("RESPONSIBLE");
        users.onChange(value.id);
    }

    validateFilter = () => {
        const {fields: {users}, dispatchShowMessage} = this.props;
        if (_.isEmpty(users.value)) {
            users.onChange(this.state.user);
        }
    };

    searchByFilters = () => {
        const {fields: {users, rol}, dispatchFilters, dispatchSetRolToSearch} = this.props;
        let filters = {
            users: JSON.parse('[' + ((_.isNull(users) || _.isUndefined(users)) ? "" : users.value) + ']'),
            rol: rol.value,
            initialDate: moment(this.state.initialDate, "DD/MM/YYYY").toDate().getTime(),
            finalDate: moment(this.state.finalDate, "DD/MM/YYYY").toDate().getTime()
        };

        setTimeout(() => {
            this.validateFilter();
            dispatchSetRolToSearch(filters);
        }, 300);

        dispatchFilters(filters);
    };

    onClickDate = async (type, val) => {
        const {dispatchShowMessage} = this.props;
        if (_.isEqual(type, "initial")) {
            await this.setState({
                initialDate: val
            });
        }

        if (_.isEqual(type, "final")) {
            await this.setState({
                finalDate: val
            });
        }

        if (moment(this.state.initialDate, DATE_FORMAT).isAfter(moment(this.state.finalDate, DATE_FORMAT))) {
            dispatchShowMessage(MESSAGE_ERROR, 'Rango de fechas', 'Señor usuario, la fecha inicial tiene que ser menor o igual a la final.');
            await this.setState({
                initialDate: this.state.defaultInitialDate,
                finalDate: this.state.defaultFinalDate,
            });
        }

        this.searchByFilters();
    };

    fillDateEmpty = async (type, val) => {
        if (_.isEqual(type, "initial") && _.isEmpty(val.target.value)) {
            await this.setState({
                initialDate: this.state.defaultInitialDate,
            });
            this.searchByFilters();
        }
        if (_.isEqual(type, "final") && _.isEmpty(val.target.value)) {
            await this.setState({
                finalDate: this.state.defaultFinalDate,
            });
            this.searchByFilters();
        }
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
                            onChange={() => this.searchByFilters()}
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
                            onChange={() => this.searchByFilters()}
                        />
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={3}>
                        <span>Desde</span>
                        <DateTimePickerUi
                            {...initialDate}
                            culture='es'
                            format={"DD/MM/YYYY"}
                            time={false}
                            touched={true}
                            placeholder='DD/MM/YYYY'
                            className='field-input'
                            name="initialDate"
                            value={this.state.initialDate}
                            onChange={val => this.onClickDate("initial", val)}
                            onBlur={val => this.fillDateEmpty("initial", val)}
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
                            touched={true}
                            value={this.state.finalDate}
                            onChange={val => this.onClickDate("final", val)}
                            onBlur={val => this.fillDateEmpty("final", val)}
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
        dispatchShowMessage: swtShowMessage,
        dispatchSetRolToSearch: setRolToSearch
    }, dispatch);
}

function mapStateToProps({reducerGlobal}) {
    return {
        reducerGlobal
    };
}

export default reduxForm({form: 'simple', fields}, mapStateToProps, mapDispatchToProps)(HeaderFilters);