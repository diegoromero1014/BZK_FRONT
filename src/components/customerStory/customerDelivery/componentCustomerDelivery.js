import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { consultList } from '../../selectsComponent/actions';
import { REASON_TRANFER } from '../../selectsComponent/constants';
import { getMasterDataFields } from '../../selectsComponent/actions';
import { VALUE_REQUIERED, MESSAGE_LOAD_DATA, MESSAGE_SAVE_DATA } from '../../../constantsGlobal';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import ListClientsValidations from './listClientsValidations';
import { clientsByEconomicGroup, updateTeamClients, getAllteams } from '../actions';
import { validateResponse } from '../../../actionsGlobal';
import { changeStateSaveData } from '../../dashboard/actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { consultInfoClient } from '../../clientInformation/actions';
import SweetAlert from 'sweetalert-react';
import _ from 'lodash';

const fields = ["idCelula", "reasonTranfer"];
const meesageOneClient = "¿Señor usuario, certifica que el cliente y su información de historial se encuentra actualizada ?";
const meesageMoreOneClient = "¿Señor usuario, certifica que los clientes y su información de historial se cuentra actualizada ?";
const validate = values => {
    const errors = {}
    if (!values.idCelula) {
        errors.idCelula = VALUE_REQUIERED;
    } else {
        errors.idCelula = null;
    }
    if (!values.reasonTranfer) {
        errors.reasonTranfer = VALUE_REQUIERED;
    } else {
        errors.reasonTranfer = null;
    }
    return errors;
}

class ComponentCustomerDelivery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkEconomicGroup: false,
            errorValidateClients: false,
            showConfirmUpdate: false
        };
        this._handleChangeCheck = this._handleChangeCheck.bind(this);
        this._handleSubmitDelivery = this._handleSubmitDelivery.bind(this);
        this.consultClients = this.consultClients.bind(this);
        this._saveUpdateTeamClient = this._saveUpdateTeamClient.bind(this);
    }

    _handleChangeCheck() {
        if (!this.state.checkEconomicGroup) {
            const { clientInformacion, clientsByEconomicGroup, swtShowMessage } = this.props;
            const economicGroup = clientInformacion.get('responseClientInfo').economicGroup;
            if (_.isNull(economicGroup) || _.isUndefined(economicGroup)) {
                swtShowMessage('error', 'Error grupo económico', 'Señor usuario, el cliente no tiene asociado un grupo económico.');
            } else {
                this.consultClients(null, economicGroup);
            }
        } else {
            this.consultClients(window.localStorage.getItem('idClientSelected'), null);
        }
        this.setState({ checkEconomicGroup: !this.state.checkEconomicGroup });
    }

    consultClients(idClient, idEconomic) {
        const { clientsByEconomicGroup, changeStateSaveData, swtShowMessage } = this.props;
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        clientsByEconomicGroup(idClient, idEconomic).then((data) => {
            if (validateResponse(data)) {
                changeStateSaveData(false, "");
            } else {
                swtShowMessage('error', 'Error validando clientes', 'Señor usuario, ocurrió un error validando los clientes.');
            }
        });
    }

    componentWillMount() {
        const { consultList, getAllteams, getMasterDataFields } = this.props;
        getAllteams();
        getMasterDataFields([REASON_TRANFER]);
        this.consultClients(window.localStorage.getItem('idClientSelected'), null);
    }

    _handleSubmitDelivery() {
        const { fields: { idCelula }, customerStory, clientInformacion, swtShowMessage } = this.props;
        if (_.isEqual(idCelula.value, clientInformacion.get("responseClientInfo").celulaId.toString())) {
            swtShowMessage('error', 'Error entregando cliente(s)', 'Señor usuario, la célula que seleccionó es a la que pertenece(n) actualmente.');
        } else {
            const validateErrorsUpdateClient = _.filter(customerStory.get('listClientsDelivery'), ['updateClient', false]);
            const validateErrorsDeliveryClient = _.filter(customerStory.get('listClientsDelivery'), ['deliveryComplete', false]);
            if (_.size(validateErrorsUpdateClient) > 0 || _.size(validateErrorsDeliveryClient) > 0) {
                swtShowMessage('error', 'Error entregando cliente(s)', 'Señor usuario, no ha completado los requisitos para realizar la entrega.');
            } else {
                this.setState({ showConfirmUpdate: true });
            }
        }
    }

    _saveUpdateTeamClient() {
        const { fields: { idCelula, reasonTranfer }, customerStory, swtShowMessage, updateTeamClients, changeStateSaveData, 
            consultInfoClient, clientInformacion } = this.props;
        //Valido si el cliente me lo estan asignando, para así no mostrar los campos de cmabio de célula
        const { deliveryClient } = clientInformacion.get("responseClientInfo");
        changeStateSaveData(true, MESSAGE_SAVE_DATA);
        this.setState({ showConfirmUpdate: false });
        const idClients = _.map(customerStory.get('listClientsDelivery'), 'idClient');
        const json = {
            "clients": customerStory.get('listClientsDelivery'),
            "idTeam": idCelula.value,
            "idReasonTransfer": reasonTranfer.value
        };
        updateTeamClients(json).then((data) => {
            changeStateSaveData(false, "");
            if (validateResponse(data)) {
                reasonTranfer.onChange('');
                idCelula.onChange('');
                swtShowMessage('success', 'Cliente(s) actualizado(s)', 'Señor usuario, el cambio de céula se registró correctamente, está acción se hará efectiva cuando el gerente de cuenta acepte los cambios.');
                consultInfoClient();
            } else {
                swtShowMessage('error', 'Error actualizando cliente(s)', 'Señor usuario, ocurrió un error actualizando la célula .');
            }
        });
    }

    render() {
        const { fields: { idCelula, reasonTranfer }, customerStory, selectsReducer, handleSubmit, clientInformacion } = this.props;
        const { deliveryClient } = clientInformacion.get("responseClientInfo");
        return (
            <form onSubmit={handleSubmit(this._handleSubmitDelivery)}>
                {!deliveryClient &&
                    <Row>
                        <Col xs={12} md={6} lg={3} style={{ marginLeft: '7px' }}>
                            <dt><span>Célula (</span><span style={{ color: "red" }}>*</span>)</dt>
                            <ComboBox
                                name="Célula"
                                labelInput="Célula"
                                valueProp={'id'}
                                textProp={'description'}
                                data={customerStory.get('listTeams')}
                                {...idCelula}
                            />
                        </Col>
                        <Col xs={12} md={6} lg={3} style={{ marginLeft: '7px' }}>
                            <dt><span>Motivo de traslado (</span><span style={{ color: "red" }}>*</span>)</dt>
                            <ComboBox
                                name="reasonTranfer"
                                labelInput="Motivo de traslado"
                                valueProp={'id'}
                                textProp={'value'}
                                data={selectsReducer.get(REASON_TRANFER)}
                                {...reasonTranfer}
                            />
                        </Col>
                        <Col xs={12} md={6} lg={4}>
                            <label style={{ fontWeight: "bold", marginTop: '28px', marginLeft: '80px' }}>
                                <input type="checkbox" checked={this.state.checkEconomicGroup} onClick={this._handleChangeCheck} />
                                &nbsp;&nbsp; ¿Traslada todo el grupo económico?
                    </label>
                        </Col>
                    </Row>
                }
                <Row>
                    <Col xs={12} md={12} lg={12} style={{ marginTop: '10px' }} >
                        <ListClientsValidations />
                    </Col>
                    {!deliveryClient &&
                        <Col xs={12} md={12} lg={12} style={{ marginTop: '10px' }} >
                            <button className="btn btn-primary" type="submit"
                                style={{ float: 'right', cursor: 'pointer', marginRight: '10px' }}>
                                Guardar
                        </button>
                        </Col>
                    }
                </Row>
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmUpdate}
                    title="Entrega estructurada de clientes"
                    confirmButtonColor='#2671d7'
                    confirmButtonText='Sí'
                    cancelButtonText="No"
                    text={_.size(customerStory.get('listClientsDelivery')) === 1 ? meesageOneClient : meesageMoreOneClient}
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmUpdate: false })}
                    onConfirm={() => this._saveUpdateTeamClient()} />
            </form>
        )
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultList,
        clientsByEconomicGroup,
        changeStateSaveData,
        swtShowMessage,
        updateTeamClients,
        consultInfoClient,
        getAllteams,
        getMasterDataFields
    }, dispatch);
}

function mapStateToProps({ navBar, customerStory, clientInformacion, selectsReducer }, ownerProps) {
    return {
        navBar,
        customerStory,
        clientInformacion,
        selectsReducer
    };
}

export default reduxForm({
    form: 'formDeliveryCustomer',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(ComponentCustomerDelivery);