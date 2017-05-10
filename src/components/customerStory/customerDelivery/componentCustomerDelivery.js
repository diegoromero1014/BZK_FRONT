import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { consultList } from '../../selectsComponent/actions';
import { TEAM_FOR_EMPLOYEE } from '../../selectsComponent/constants';
import { VALUE_REQUIERED, MESSAGE_LOAD_DATA } from '../../../constantsGlobal';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import ListClientsValidations from './listClientsValidations';
import { clientsByEconomicGroup } from '../actions';
import { validateResponse } from '../../../actionsGlobal';
import {changeStateSaveData} from '../../dashboard/actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import _ from 'lodash';

const fields = ["idCelula"];
const validate = values => {
    const errors = {}
    if (!values.idCelula) {
        errors.idCelula = VALUE_REQUIERED;
    } else {
        errors.idCelula = null;
    }
    return errors;
}

class ComponentCustomerDelivery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkEconomicGroup: false,
            errorValidateClients: false
        };
        this._handleChangeCheck = this._handleChangeCheck.bind(this);
    }

    _handleChangeCheck() {
        this.setState({ checkEconomicGroup: !this.state.checkEconomicGroup });
    }

    componentWillMount() {
        const { consultList, clientsByEconomicGroup, changeStateSaveData } = this.props;
        consultList(TEAM_FOR_EMPLOYEE);
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        clientsByEconomicGroup(window.localStorage.getItem('idClientSelected'), null).then((data) => {
            console.log('data', data);
            if (validateResponse(data)) {
                changeStateSaveData(false, "");
            } else {
                swtShowMessage('error', 'Error validando clientes', 'Señor usuario, ocurrió un error validando los clientes.');
            }
        });
    }

    render() {
        const { fields: { idCelula }, selectsReducer } = this.props;
        return (
            <Row>
                <Col xs={12} md={6} lg={4}>
                    <dt><span>Célula (</span><span style={{ color: "red" }}>*</span>)</dt>
                    <ComboBox
                        name="Célula"
                        labelInput="Célula"
                        valueProp={'id'}
                        textProp={'description'}
                        data={selectsReducer.get('teamValueObjects')}
                        {...idCelula}
                    />
                </Col>
                <Col xs={12} md={6} lg={4}>
                    <label style={{ fontWeight: "bold", marginTop: '28px', marginLeft: '80px' }}>
                        <input type="checkbox" checked={this.state.checkEconomicGroup} onClick={this._handleChangeCheck} />
                        &nbsp;&nbsp;Grupo económico
                    </label>
                </Col>
                <Col xs={12} md={12} lg={12} style={{ marginTop: '10px' }} >
                    <ListClientsValidations />
                </Col>
            </Row>
        )
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultList,
        clientsByEconomicGroup,
        changeStateSaveData
    }, dispatch);
}

function mapStateToProps({ navBar, customerStory, selectsReducer }, ownerProps) {
    return {
        navBar,
        customerStory,
        selectsReducer
    };
}

export default reduxForm({
    form: 'formDeliveryCustomer',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(ComponentCustomerDelivery);