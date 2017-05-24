import React, { Component, PropTypes } from 'react';
import ActividadEconomica from './actividadEconomica';
import InventoryPolicy from './inventoryPolicy';
import MainCustomer from './mainCustomer';
import MainSupplier from './mainSupplier';
import MainCompetitor from './mainCompetitor';
import UbicationCorrespondence from './ubicationCorrespondence';
import InfoFinanciera from './infoFinanciera';
import DataComercial from './dataComercial';
import DeclarationOfOrigin from './DeclarationOfOrigin';
import InternationalOperations from './internationalOperations';
import DocumentInformationServices from './managementDocumentary/documentInformationServices';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { seletedButton, validateContactShareholder, sendErrorsUpdate, changeAccordionValue } from './actions';
import { BUTTON_UPDATE, BUTTON_EDIT, CONSULT, ACTIVE_TAB, INACTIVE_TAB } from './constants';
import Notas from './notas';
import { bindActionCreators } from 'redux';
import Products from './product';
import { connect } from 'react-redux';
import moment from 'moment';
import { EDITAR, MODULE_CLIENTS, VINCULAR } from '../../constantsGlobal';
import { validatePermissionsByModule } from '../../actionsGlobal';
import { redirectUrl } from '../globalComponents/actions';
import { MENU_CLOSED } from '../navBar/constants';
import ButtonLinkClient from './linkingClient/buttonLinkClientComponent';
import { Accordion, Icon } from 'semantic-ui-react';
import TitleSectionComponent from '../titleSection/titleSection';

class DetailsInfoClient extends Component {
    constructor(props) {
        super(props);

        this._clickButtonClientEdit = this._clickButtonClientEdit.bind(this);
        this._clickButtonClientUpdate = this._clickButtonClientUpdate.bind(this);
        this._changeValueAccordion = this._changeValueAccordion.bind(this);
    }

    componentWillMount() {
        const { login, validatePermissionsByModule } = this.props;
        if (window.localStorage.getItem('sessionToken') === "") {
            redirectUrl("/login");
        }
        validatePermissionsByModule(MODULE_CLIENTS).then((data) => {
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
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

    _mapProductItems(item, idx) {
        return <Products
            name={item.name}
            type={item.typeKey}
            num={item.number}
            averageMontlyAmount={item.averageMontlyAmount}
            coin={item.coin}
            country={item.countryKey}
            city={item.city}
            key={idx + 1}
        />
    }

    _clickButtonClientEdit() {
        const { seletedButton } = this.props;
        seletedButton(BUTTON_EDIT);
        redirectUrl("/dashboard/clientEdit");
    }

    _clickButtonClientUpdate() {
        const { seletedButton, validateContactShareholder, updateClient, sendErrorsUpdate } = this.props;
        seletedButton(BUTTON_UPDATE);
        //Valido si el cliente tiene un representante legal y accionistas
        validateContactShareholder().then((data) => {
            if (!_.get(data, 'payload.data.validateLogin')) {
                redirectUrl("/login");
            } else {
                redirectUrl("/dashboard/clientEdit");
            }
        });
    }

    _changeValueAccordion(tabSeleted) {
        const { changeAccordionValue, tabReducer } = this.props;
        var accordion = tabReducer.get('accordion');
        var newAccordion = _.mapValues(accordion, (value, key) => {
            if (_.isEqual(key, tabSeleted)) {
                return _.isEqual(value, INACTIVE_TAB) ? ACTIVE_TAB : INACTIVE_TAB;
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
        const paddingLink = { paddingTop: '8px', paddingRight: '10x', paddingLeft: '10px', paddingRight: '10px' };
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

        //const active = Array.of(1, 2, 3);
        const active = 0;
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
                                <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Grupo de riesgo</span></th>
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
                                    <span style={{ marginLeft: "0px" }}>{infoClient.riskGroup}</span>
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

                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.economicActivity}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('economicActivity')}>
                            <TitleSectionComponent iconClass="payment" fontSize="25px" typeTitle={true}>
                                Actividad económica
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content >
                            <ActividadEconomica infoClient={infoClient} />
                        </Accordion.Content>
                    </Accordion>

                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.inventoryPolicy}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('inventoryPolicy')}>
                            <TitleSectionComponent iconClass="cubes" fontSize="25px" typeTitle={true}>
                                Política de inventarios
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content >
                            <InventoryPolicy infoClient={infoClient} />
                        </Accordion.Content>
                    </Accordion>

                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.mainCustomer}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('mainCustomer')}>
                            <TitleSectionComponent iconClass="users" fontSize="25px" typeTitle={true}>
                                Principales clientes
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content >
                            <MainCustomer infoClient={infoClient} />
                        </Accordion.Content>
                    </Accordion>

                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.mainSupplier}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('mainSupplier')}>
                            <TitleSectionComponent iconClass="shipping" fontSize="25px" typeTitle={true}>
                                Principales proveedores
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content >
                            <MainSupplier infoClient={infoClient} />
                        </Accordion.Content>
                    </Accordion>

                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.mainCompetition}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('mainCompetition')}>
                            <TitleSectionComponent iconClass="factory" fontSize="25px" typeTitle={true}>
                                Principales competidores
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content >
                            <MainCompetitor infoClient={infoClient} />
                        </Accordion.Content>
                    </Accordion>


                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.ubicationCorrespondence}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('ubicationCorrespondence')}>
                            <TitleSectionComponent iconClass="browser" fontSize="25px" typeTitle={true}>
                                Información de ubicación y correspondencia
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content >
                            <UbicationCorrespondence infoClient={infoClient} />
                        </Accordion.Content>
                    </Accordion>


                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.infoFinanciera}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('infoFinanciera')}>
                            <TitleSectionComponent iconClass="suitcase " fontSize="25px" typeTitle={true}>
                                Información financiera
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content>
                            <InfoFinanciera infoClient={infoClient} />
                        </Accordion.Content>
                    </Accordion>


                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.dataComercial}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('dataComercial')}>
                            <TitleSectionComponent iconClass="book" fontSize="25px" typeTitle={true}>
                                Datos de conocimiento comercial
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content>
                            <DataComercial infoClient={infoClient} />
                        </Accordion.Content>
                    </Accordion>


                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.notes}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('notes')}>
                            <TitleSectionComponent iconClass="file outline" fontSize="25px" typeTitle={true}>
                                Notas
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content>
                            {notes.map(this._mapNoteItems)}
                        </Accordion.Content>
                    </Accordion>


                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.declarationOfOrigin}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('declarationOfOrigin')}>
                            <TitleSectionComponent iconClass="money" fontSize="25px" typeTitle={true}>
                                Declaración de origen de bienes y/o fondos
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content>
                            <DeclarationOfOrigin infoClient={infoClient} />
                        </Accordion.Content>
                    </Accordion>


                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.internationalOperations}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('internationalOperations')}>
                            <TitleSectionComponent iconClass="world" fontSize="25px" typeTitle={true}>
                                Información operaciones internacionales
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content>
                            <InternationalOperations infoClient={infoClient} />
                        </Accordion.Content>
                    </Accordion>


                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.documentInformationServices}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('documentInformationServices')}>
                            <TitleSectionComponent iconClass="newspaper" fontSize="25px" typeTitle={true}>
                                Consulta de servicios de información documental
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content>
                            <DocumentInformationServices />
                        </Accordion.Content>
                    </Accordion>


                    <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                    <Accordion defaultActiveIndex={accordion.foreignProducts}>
                        <Accordion.Title onClick={() => this._changeValueAccordion('foreignProducts')}>
                            <TitleSectionComponent iconClass="payment" fontSize="25px" typeTitle={true}>
                                Productos
                            </TitleSectionComponent>
                        </Accordion.Title>
                        <Accordion.Content>
                            {foreignProducts.map(this._mapProductItems)}
                        </Accordion.Content>
                    </Accordion>



                </div>
                {infoClient.haveAccessEdit && (allowEdit || allowLinked) &&
                    <div className="" style={containerButtons}>
                        <div style={{
                            right: '0px',
                            position: 'fixed',
                            paddingRight: '15px'
                        }}>
                            <Row style={{ paddingTop: '8px' }}>
                                {allowEdit &&
                                    <Col style={paddingLink}>
                                        <a style={styleLink} onClick={this._clickButtonClientEdit}>
                                            <span>Editar/Modificar</span></a>
                                    </Col>}
                                {allowEdit &&
                                    <Col style={paddingButtons} onClick={this._clickButtonClientUpdate}>
                                        <button className="btn"><span >Actualizar</span></button>
                                    </Col>
                                }
                                {allowLinked &&
                                    <ButtonLinkClient infoClient={infoClient} />
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
        changeAccordionValue
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
