import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { updateTitleNavBar } from '../../navBar/actions';
import { redirectUrl } from '../../globalComponents/actions';
import SweetAlert from 'sweetalert-react';
import { LINE_OF_BUSINESS, DISTRIBUTION_CHANNEL, MAIN_CLIENTS } from '../../contextClient/constants';
import ClientTypology from '../../contextClient/ClientTypology';
import ContextEconomicActivity from '../../contextClient/contextEconomicActivity';
import ComponentListLineBusiness from '../../contextClient/listLineOfBusiness/componentListLineBusiness';
import ComponentListDistributionChannel from '../../contextClient/listDistributionChannel/componentListDistributionChannel';
import InventorPolicy from '../../contextClient/inventoryPolicy';
import ComponentListMainClients from '../../contextClient/listMainClients/componentListMainClients';
import * as constantsSelects from '../../selectsComponent/constants';
import { ORIGIN_STUDY_CREDIT } from '../../contextClient/constants';

const fields = ["customerTypology", "contextClientField", "contextLineBusiness", "participationLB", "experience",
    "distributionChannel", "participationDC", "inventoryPolicy", "nameMainClient", "participationMC", "termMainClient",
    "relevantInformationMainClient"];

class ComponentStudyCredit extends Component {
    constructor(props) {
        super(props);
        this._closeWindow = this._closeWindow.bind(this);
        this._onConfirmExit = this._onConfirmExit.bind(this);
        this.showFormOut = this.showFormOut.bind(this);
        this._handleChangeValueActivityEconomic = this._handleChangeValueActivityEconomic.bind(this);
        this._handleChangeValueInventoryPolicy = this._handleChangeValueInventoryPolicy.bind(this);
        this._handleChangeValueMainClients = this._handleChangeValueMainClients.bind(this);
        this.state = {
            showConfirmExit: false,
            showFormAddLineOfBusiness: false,
            showFormAddDistribution: false,
            showFormAddMainClient: false,
            valueCheckSectionActivityEconomic: false,
            valueCheckSectionInventoryPolicy: false,
            valueCheckSectionMainClients: false,
        }
    }

    _handleChangeValueActivityEconomic() {
        this.setState({
            valueCheckSectionActivityEconomic: !this.state.valueCheckSectionActivityEconomic
        });
    }

    _handleChangeValueInventoryPolicy() {
        this.setState({
            valueCheckSectionInventoryPolicy: !this.state.valueCheckSectionInventoryPolicy
        });
    }

    _handleChangeValueMainClients() {
        this.setState({
            valueCheckSectionMainClients: !this.state.valueCheckSectionMainClients
        });
    }

    showFormOut(property, value) {
        if (_.isEqual(LINE_OF_BUSINESS, property)) {
            this.setState({ showFormAddLineOfBusiness: value });
        } else if (_.isEqual(DISTRIBUTION_CHANNEL, property)) {
            this.setState({ showFormAddDistribution: value });
        } else if (_.isEqual(MAIN_CLIENTS, property)) {
            this.setState({ showFormAddMainClient: value });
        }
    }

    _closeWindow() {
        this.setState({
            showConfirmExit: true
        });
    }

    _onConfirmExit() {
        this.setState({
            showConfirmExit: false
        });
        const { updateTabSeleted } = this.props;
        redirectUrl("/dashboard/clientInformation");
    }

    componentWillMount() {
        const { updateTitleNavBar } = this.props;
        updateTitleNavBar("Informe estudio de crédito");
    }

    render() {
        const { selectsReducer, fields: { customerTypology, contextClientField, contextLineBusiness, participationLB, experience,
            distributionChannel, participationDC, inventoryPolicy, nameMainClient, participationMC, termMainClient,
            relevantInformationMainClient
        } } = this.props;
        return (
            <form style={{ backgroundColor: "#FFFFFF", paddingBottom: "70px" }}>
                <Row style={{ paddingTop: "10px", marginLeft: "20px" }}>
                    <ClientTypology customerTypology={customerTypology} data={selectsReducer.get(constantsSelects.CUSTOMER_TYPOLOGY)} />
                </Row>
                <Row style={{ padding: "20px 10px 0px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <input type="checkbox" id="checkSectionActivityEconomic" style={{ marginRight: "10px" }}
                                checked={this.state.valueCheckSectionActivityEconomic}
                                onClick={this._handleChangeValueActivityEconomic} />
                            <i className="payment icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Actividad económica</span>
                        </div>
                    </Col>
                </Row>
                <ContextEconomicActivity contextClientField={contextClientField} origin={ORIGIN_STUDY_CREDIT} />
                <ComponentListLineBusiness contextLineBusiness={contextLineBusiness}
                    participation={participationLB} experience={experience}
                    showFormLinebusiness={this.state.showFormAddLineOfBusiness} fnShowForm={this.showFormOut} />
                <ComponentListDistributionChannel distributionChannel={distributionChannel} participation={participationDC}
                    showFormDistribution={this.state.showFormAddDistribution} fnShowForm={this.showFormOut} />
                <InventorPolicy inventoryPolicy={inventoryPolicy} origin={ORIGIN_STUDY_CREDIT}
                    valueCheckSectionInventoryPolicy={this.state.valueCheckSectionInventoryPolicy}
                    functionChangeInventoryPolicy={this._handleChangeValueInventoryPolicy} />
                <ComponentListMainClients nameClient={nameMainClient} participation={participationMC}
                    term={termMainClient} relevantInformation={relevantInformationMainClient} origin={ORIGIN_STUDY_CREDIT}
                    showFormMainClients={this.state.showFormAddMainClient} fnShowForm={this.showFormOut}
                    valueCheckSectionMainClients={this.state.valueCheckSectionMainClients}
                    functionChangeCheckSectionMainClients={this._handleChangeValueMainClients} />
                <div style={{
                    marginTop: "50px", position: "fixed",
                    border: "1px solid #C2C2C2", bottom: "0px", width: "100%", marginBottom: "0px",
                    backgroundColor: "#F8F8F8", height: "50px", background: "rgba(255,255,255,0.75)"
                }}>
                    <div style={{ width: "370px", height: "100%", position: "fixed", right: "0px" }}>
                        <button className="btn"
                            style={{ float: "right", margin: "8px 0px 0px 120px", position: "fixed" }}
                            onClick={this.clickButtonScrollTop} type="submit">
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar</span>
                        </button>
                        <button className="btn btn-secondary modal-button-edit" onClick={this._closeWindow} style={{
                            float: "right",
                            margin: "8px 0px 0px 240px",
                            position: "fixed",
                            backgroundColor: "#C1C1C1"
                        }} type="button">
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                        </button>
                    </div>
                </div>
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmExit}
                    title="Confirmar salida"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    text="Señor usuario, perderá los cambios que no haya guardado. ¿Está seguro que desea salir?"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmExit: false })}
                    onConfirm={() => this._onConfirmExit()} />
            </form>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar
    }, dispatch);
}

function mapStateToProps({ selectsReducer }, ownerProps) {
    return {
        selectsReducer
    };
}

export default reduxForm({
    form: 'formStudyCredit',
    fields
}, mapStateToProps, mapDispatchToProps)(ComponentStudyCredit);
