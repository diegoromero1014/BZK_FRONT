import React, { Component } from "react";
import { Col, Row } from "react-flexbox-grid";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import _ from 'lodash';

import ActividadEconomica from "./actividadEconomica";
import InventoryPolicy from "./inventoryPolicy";
import ControlLinkedPayments from "./controlLinkedPayments";
import MainCustomer from "./mainCustomer";
import MainSupplier from "./mainSupplier";
import MainCompetitor from "./mainCompetitor";
import UbicationCorrespondence from "./ubicationCorrespondence";
import InfoFinanciera from "./infoFinanciera";
import DataComercial from "./dataComercial";
import DeclarationOfOrigin from "./declarationOfOrigin";
import InternationalOperations from "./internationalOperations";
import DocumentInformationServices from "./managementDocumentary/documentInformationServices";
import ButtonLinkClient from "./linkingClient/buttonLinkClientComponent";
import ComponentAccordion from "../accordion/componentAccordion";
import Notas from "./notas";
import Products from "./product";
import SectionOpportunitiesWeaknesses from "../opportunitiesWeaknesses/SectionOpportunitiesWeaknesses"; 

import { changeAccordionValue, seletedButton, sendErrorsUpdate, validateContactShareholder } from "./actions";
import { onSessionExpire, shorterStringValue, validatePermissionsByModule } from "../../actionsGlobal";
import { redirectUrl } from "../globalComponents/actions";
import { showModalRiskGroup } from "../clientRiskGroup/actions";

import { BUTTON_EDIT, BUTTON_UPDATE, CLOSE_TAB, OPEN_TAB } from "./constants";
import {
    EDITAR,
    GESTION_DOCUMENTAL,
    GRUPO_RIESGO,
    INFO_ESTUDIO_CREDITO,
    MODULE_CLIENTS,
    VINCULAR,
    VISUALIZAR
} from "../../constantsGlobal";

class DetailsInfoClient extends Component {
    constructor(props) {
        super(props);

        this._clickButtonClientEdit = this._clickButtonClientEdit.bind(this);
        this._clickButtonClientUpdate = this._clickButtonClientUpdate.bind(this);
        this._changeValueAccordion = this._changeValueAccordion.bind(this);
        this._clickButtonStudyCredit = this._clickButtonStudyCredit.bind(this);
        this.openModalRiskGroup = this.openModalRiskGroup.bind(this);
    }

    componentWillMount() {
        const { validatePermissionsByModule } = this.props;
        if (window.localStorage.getItem('sessionTokenFront') === "") {
            redirectUrl("/login");
        }

        validatePermissionsByModule(MODULE_CLIENTS).then((data) => {
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                onSessionExpire();
            } else {
                if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
                    redirectUrl("/dashboard");
                }
            }
        });
        
    }

    _mapNoteItems(item, idx) {
        return <Notas
            typeOfNoteKey={item.typeOfNoteKey}
            note={item.note}
            key={idx + 1}
        />
    }

    _clickButtonClientEdit() {
        const { seletedButton } = this.props;
        seletedButton(BUTTON_EDIT);
        redirectUrl("/dashboard/clientEdit");
    }

    _clickButtonClientUpdate() {
        const { seletedButton, validateContactShareholder } = this.props;
        seletedButton(BUTTON_UPDATE);
        //Valido si el cliente tiene un representante legal y accionistas
        validateContactShareholder().then((data) => {
            if (!_.get(data, 'payload.data.validateLogin')) {
                onSessionExpire();
            } else {
                redirectUrl("/dashboard/clientEdit");
            }
        });
    }

    _clickButtonClientCertify() {
        redirectUrl("/dashboard/certifyClient");
    }

    _clickButtonStudyCredit() {
        redirectUrl("/dashboard/creditStudy");
    }

    openModalRiskGroup() {
        this.props.showModalRiskGroup(true);
    }

    _changeValueAccordion(tabSeleted) {
        const { changeAccordionValue, tabReducer } = this.props;
        const accordion = tabReducer.get('accordion');
        const newAccordion = _.mapValues(accordion, (value, key) => {
            if (_.isEqual(key, tabSeleted)) {
                return _.isEqual(value, OPEN_TAB) ? CLOSE_TAB : OPEN_TAB;
            } else {
                return value;
            }
        });
        changeAccordionValue(newAccordion);
    }

    render() {
        const { infoClient, reducerGlobal, linkedStatusKey, tabReducer } = this.props;
        const accordion = tabReducer.get('accordion');
        var actualizationDateString = "";
        if (infoClient.actualizationDate !== null && infoClient.actualizationDate !== undefined) {
            var actualizationDate = moment(infoClient.actualizationDate).locale('es');
            actualizationDateString = actualizationDate.format("DD") + " " + actualizationDate.format("MMM") + " " + actualizationDate.format("YYYY");
        }

        var { notes } = infoClient;
        if (notes === undefined || notes === null) {
            notes = [];
        }

        var { foreignProducts } = infoClient;
        if (foreignProducts === undefined || foreignProducts === null) {
            foreignProducts = [];
        }

        var paddingDivEdit = "0px";
        if (infoClient.haveAccessEdit) {
            paddingDivEdit = "50px";
        }

        const paddingButtons = { paddingRight: '7px', paddingLeft: '7px' };
        const paddingLink = { paddingTop: '8px', paddingLeft: '10px', paddingRight: '10px' };
        const styleLink = { cursor: "pointer", textDecoration: "underline" };
        const containerButtons = {
            marginLeft: "-20px",
            position: "fixed",
            border: "1px solid #C2C2C2",
            bottom: "0px",
            width: "100%",
            marginBottom: "0px",
            backgroundColor: "#F8F8F8",
            height: "50px",
            background: "rgba(255,255,255,0.75)"
        };

        const allowEdit = _.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), EDITAR), false);
        const allowLinked = _.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), VINCULAR), false);
        const allowCreditStudy = _.get(reducerGlobal.get('permissionsStudyCredit'), _.indexOf(reducerGlobal.get('permissionsStudyCredit'), VISUALIZAR), false);

        const allowAccessAndEdit = infoClient.haveAccessEdit && allowEdit;
        const showFooterButtons = allowAccessAndEdit || allowLinked || allowCreditStudy;

        const allowAccessRiskGroup = _.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), GRUPO_RIESGO), false);
        const allowAccessContextClient = _.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), INFO_ESTUDIO_CREDITO), false);
        const allowAccessGestionDocumental = _.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), GESTION_DOCUMENTAL), false);

        return (
            <div style={{ width: "100%", marginTop: "10px", marginBottom: "70px" }}>
                <div style={{ paddingBottom: paddingDivEdit, paddingTop: "10px" }}>
                    <table style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Entidad/Línea de negocio</span>
                                </th>
                                <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Segmento</span></th>
                                <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Subsegmento</span></th>

                                {
                                    allowAccessRiskGroup && <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Grupo de riesgo</span></th>
                                }

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ width: "25%", verticalAlign: "initial" }}>
                                    <span style={{ marginLeft: "0px" }}>{infoClient.lineOfBusinessKeys}</span>
                                </td>
                                <td style={{ width: "25%", verticalAlign: "initial" }}>
                                    <span style={{ marginLeft: "0px" }}>{infoClient.segmentKey}</span>
                                </td>
                                <td style={{ width: "25%", verticalAlign: "initial" }}>
                                    <dl className="company-detail-dl">
                                        <dd style={{ marginLeft: "0px" }}>{infoClient.subSegmentKey}</dd>
                                    </dl>
                                </td>

                                <td style={{ width: "25%", verticalAlign: "initial" }}>
                                    {
                                        allowAccessRiskGroup &&
                                        <a onClick={this.openModalRiskGroup} style={{ marginLeft: "0px", cursor: 'pointer' }}>{shorterStringValue(infoClient.riskGroup)}</a>
                                    }
                                </td>

                            </tr>
                        </tbody>
                    </table>

                    <table style={{ width: "100%", marginTop: "20px", marginBottom: "30px" }}>
                        <thead>
                            <tr>
                                <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Fecha de actualización</span></th>
                                <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Estado</span></th>
                                <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Estado de certificación</span></th>
                                <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Estado de vinculación</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ width: "25%", verticalAlign: "initial" }}>
                                    <span style={{ marginLeft: "0px" }}>{actualizationDateString}</span>
                                </td>
                                <td style={{ width: "25%", verticalAlign: "initial" }}>
                                    <span style={{ marginLeft: "0px" }}>{infoClient.clientStatusKey}</span>
                                </td>
                                <td style={{ width: "25%", verticalAlign: "initial" }}>
                                    <span style={{ marginLeft: "0px" }}>{infoClient.certificationStatusKey}</span>
                                </td>
                                <td style={{ width: "25%", verticalAlign: "initial" }}>
                                    <span style={{ marginLeft: "0px" }}>{linkedStatusKey}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <ComponentAccordion functionChange={() => this._changeValueAccordion('opportunitiesWeaknesses')}
                        codSection={accordion.opportunitiesWeaknesses} title="Oportunidades y debilidades" icon="payment"
                        componentView={<h1>Hola mundo</h1>} />

                    <ComponentAccordion functionChange={() => this._changeValueAccordion('economicActivity')}
                        codSection={accordion.economicActivity} title="Actividad económica" icon="payment"
                        componentView={<ActividadEconomica infoClient={infoClient} reducerGlobal={reducerGlobal} />} />

                    {
                        allowAccessContextClient &&

                        <ComponentAccordion functionChange={() => this._changeValueAccordion('inventoryPolicy')}
                            codSection={accordion.inventoryPolicy} title="Política de inventarios" icon="cubes"
                            componentView={<InventoryPolicy infoClient={infoClient} />} />

                    }
                    {
                        allowAccessContextClient &&
                        <ComponentAccordion functionChange={() => this._changeValueAccordion('controlLinkedPayments')}
                            codSection={accordion.controlLinkedPayments} title="Control para pagos entre vinculadas y cambios de control" icon="building"
                            componentView={<ControlLinkedPayments infoClient={infoClient} />} />
                    }

                    <ComponentAccordion functionChange={() => this._changeValueAccordion('ubicationCorrespondence')}
                        codSection={accordion.ubicationCorrespondence} title="Información de ubicación y correspondencia" icon="browser"
                        componentView={<UbicationCorrespondence infoClient={infoClient} />} />

                    <ComponentAccordion functionChange={() => this._changeValueAccordion('infoFinanciera')}
                        codSection={accordion.infoFinanciera} title="Información financiera" icon="suitcase"
                        componentView={<InfoFinanciera infoClient={infoClient} />} />

                    {
                        allowAccessContextClient &&
                        <ComponentAccordion functionChange={() => this._changeValueAccordion('mainCustomer')}
                            codSection={accordion.mainCustomer} title="Principales clientes" icon="users"
                            componentView={<MainCustomer infoClient={infoClient} />} />
                    }

                    {
                        allowAccessContextClient &&
                        <ComponentAccordion functionChange={() => this._changeValueAccordion('mainSupplier')}
                            codSection={accordion.mainSupplier} title="Principales proveedores" icon="shipping"
                            componentView={<MainSupplier infoClient={infoClient} />} />
                    }

                    {
                        allowAccessContextClient &&
                        <ComponentAccordion functionChange={() => this._changeValueAccordion('mainCompetition')}
                            codSection={accordion.mainCompetition} title="Principales competidores" icon="factory"
                            componentView={<MainCompetitor infoClient={infoClient} />} />
                    }

                    <ComponentAccordion functionChange={() => this._changeValueAccordion('dataComercial')}
                        codSection={accordion.dataComercial} title="Datos de conocimiento comercial" icon="book"
                        componentView={<DataComercial infoClient={infoClient} />} />

                    <ComponentAccordion functionChange={() => this._changeValueAccordion('notes')}
                        codSection={accordion.notes} title="Notas" icon="file outline"
                        componentView={notes.map(this._mapNoteItems)} />

                    <ComponentAccordion functionChange={() => this._changeValueAccordion('declarationOfOrigin')}
                        codSection={accordion.declarationOfOrigin} title="Declaración de origen de bienes y/o fondos" icon="money"
                        componentView={<DeclarationOfOrigin infoClient={infoClient} />} />


                    <ComponentAccordion functionChange={() => this._changeValueAccordion('internationalOperations')}
                        codSection={accordion.internationalOperations} title="Información operaciones internacionales" icon="world"
                        componentView={<InternationalOperations infoClient={infoClient} allowAccessInfoContextClient={allowAccessContextClient} />} />

                    {
                        allowAccessGestionDocumental &&
                        <ComponentAccordion functionChange={() => this._changeValueAccordion('documentInformationServices')}
                            codSection={accordion.documentInformationServices} title="Consulta de servicios de información documental" icon="newspaper"
                            componentView={<DocumentInformationServices infoClient={infoClient} />} />
                    }

                    <ComponentAccordion functionChange={() => this._changeValueAccordion('foreignProducts')}
                        codSection={accordion.foreignProducts} title="Descripción de los productos financieros en moneda extranjera" icon="product hunt"
                        componentView={<Products foreignProducts={foreignProducts} />} />

                </div>
                {showFooterButtons &&
                    <div className="" style={containerButtons}>
                        <div style={{
                            right: '0px',
                            position: 'fixed',
                            paddingRight: '15px'
                        }}>
                            <Row style={{ paddingTop: '8px' }}>
                                {allowAccessAndEdit &&
                                    <Col style={paddingLink}>
                                        <a style={styleLink} onClick={this._clickButtonClientEdit}>
                                            <span>Editar/Modificar</span></a>
                                    </Col>}
                                {allowAccessAndEdit &&
                                    <Col style={paddingButtons} onClick={this._clickButtonClientCertify}>
                                        <button className="btn"><span>Certificar cliente</span></button>
                                    </Col>}
                                {allowAccessAndEdit &&
                                    <Col style={paddingButtons} onClick={this._clickButtonClientUpdate}>
                                        <button className="btn"><span >Actualizar</span></button>
                                    </Col>
                                }
                                {allowLinked &&
                                    <ButtonLinkClient infoClient={infoClient} />
                                }
                                {allowCreditStudy &&
                                    <Col style={paddingButtons} onClick={this._clickButtonStudyCredit}>
                                        <button className="btn"><span >Estudio de crédito</span></button>
                                    </Col>
                                }
                            </Row>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        seletedButton,
        validateContactShareholder,
        sendErrorsUpdate,
        validatePermissionsByModule,
        changeAccordionValue,
        showModalRiskGroup
    }, dispatch);
}

function mapStateToProps({ navBar, reducerGlobal, clientInformacion, tabReducer }) {
    const linkedStatusKey = _.get(clientInformacion.get('responseClientInfo'), 'linkedStatusKey', null);
    return {
        infoClient: Object.assign({}, clientInformacion.get('responseClientInfo')),
        menuState: navBar.get('status'),
        linkedStatusKey,
        reducerGlobal,
        tabReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsInfoClient);