import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import { reduxForm } from 'redux-form';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import ComboBoxFilter from "../../ui/comboBoxFilter/comboBoxFilter";
import { showLoading } from '../loading/actions';
import { updateTitleNavBar, showBrandConfidential } from '../navBar/actions';
import { Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from "../globalComponents/actions";
import { getSchedulerPrevisits, changeTeam, changeRegion, changeZone, clearFilter } from './actions';
import { consultInfoClient } from "../clientInformation/actions";
import { consultList, consultDataSelect, consultListWithParameterUbication, clearConsultListWithParameterUbication, consultListWithParameter, clrearConsultListWithParameter, clearLists, getRegionsByEmployee } from "../selectsComponent/actions";
import { validatePermissionsByModule, validateValue, clearPrevisitPermissions } from "../../actionsGlobal";
import { MODULE_PREVISITS } from "../../constantsGlobal";
import { SHEDULER_FILTER, GREEN_COLOR, ORANGE_COLOR } from "./constants";
import { TEAM_FOR_EMPLOYEE, LIST_REGIONS, LIST_ZONES, TEAM_FOR_EMPLOYEE_REGION_ZONE, TEAM_VALUE_OBJECTS } from "../selectsComponent/constants";
import { bindActionCreators } from "redux";
import _ from 'lodash';
import $ from 'jquery';
import EditPrevisit from '../previsita/editPrevisit/editPrevisit';
import { filterUsersBanco } from '../participantsVisitPre/actions';
import ConfidentialBrandComponent from '../commercialReport/ConfidentialBrandComponent';
import PrevisitPage from '../previsita/previsitPage';


BigCalendar.momentLocalizer(moment);
const fields = ["team", "region", "zone", "nameUsuario", "idUsuario"];
var usersBanco = [];
class Sheduler extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalIsOpen: false,
            idUser: 0,
            display: 'none'
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.bindClassParticipants = this.bindClassParticipants.bind(this);
        this._onChangeTeam = this._onChangeTeam.bind(this);
        this._onChangeRegionStatus = this._onChangeRegionStatus.bind(this);
        this._onChangeZoneStatus = this._onChangeZoneStatus.bind(this);
        this._handlePrevisitsFind = this._handlePrevisitsFind.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
        this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
        this._updateValue = this._updateValue.bind(this);
        this.onBlurClear = this.onBlurClear.bind(this);
    }


    componentWillMount() {
        const { getSchedulerPrevisits, clearLists, updateTitleNavBar, clrearConsultListWithParameter, clearConsultListWithParameterUbication, consultList, consultDataSelect, getRegionsByEmployee } = this.props;
        clearLists([LIST_ZONES, TEAM_VALUE_OBJECTS]);
        getRegionsByEmployee().then((regions) => {

            let listaRegiones = regions.payload.data.data
            if (_.isEmpty(listaRegiones)) {
                consultDataSelect(LIST_REGIONS);
            }
        });

        updateTitleNavBar('Agenda');
    }

    openModal(idClient, idPrevisit) {
        const { validatePermissionsByModule, showLoading } = this.props;
        showLoading(true, 'Cargando..');
        validatePermissionsByModule(MODULE_PREVISITS).then((data) => {
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            }
        });

        const { consultInfoClient } = this.props;
        window.sessionStorage.setItem("idClientSelected", idClient);
        consultInfoClient().then((success) => {
            showLoading(false, null);
            this.setState({
                modalIsOpen: true,
                idPrevisit: idPrevisit
            });
        });
    }

    onBlurClear() {
        this.setState({
            display: 'none'
        });
    }

    closeModal() {
        const { showBrandConfidential } = this.props;
        
        this._handlePrevisitsFind();
        this.setState({ modalIsOpen: false });
        
        showBrandConfidential(false);
    }

    _onChangeRegionStatus(val) {

        const { fields: { team, region, zone }, consultListWithParameterUbication, consultListWithParameter, changeRegion, clearLists } = this.props;
        region.onChange(val);
        zone.onChange("");
        team.onChange("");

        clearLists([LIST_ZONES, TEAM_VALUE_OBJECTS]);

        if (!_.isEqual(val, "")) {
            consultListWithParameterUbication(LIST_ZONES, val);
            this._handlePrevisitsFind();
        }


    }

    _cleanSearch() {
        const { resetForm, showLoading, clearFilter, consultList, consultDataSelect, clrearConsultListWithParameter, clearConsultListWithParameterUbication, clearLists } = this.props;

        showLoading(true, "cargando..");

        resetForm();

        clearLists([LIST_ZONES, TEAM_VALUE_OBJECTS]);

        clearFilter();

        this.setState({
            display: 'none'
        });

        showLoading(false, false);

    }

    _onChangeZoneStatus(val) {
        const { fields: { team, region, zone }, consultListWithParameterUbication, clrearConsultListWithParameter, consultListWithParameter, changeRegion, clearLists } = this.props;
        zone.onChange(val);
        team.onChange("");

        clearLists([TEAM_VALUE_OBJECTS]);

        if (val) {
            consultListWithParameter(TEAM_FOR_EMPLOYEE_REGION_ZONE, {
                region: region.value,
                zone: zone.value
            });
            this._handlePrevisitsFind();
        }

    }

    _onChangeTeam(val) {
        const { fields: { team, region, zone }, consultListWithParameterUbication, consultListWithParameter, changeRegion } = this.props;
        team.onChange(val);
        changeTeam(val);
        if (val) {
            this._handlePrevisitsFind();
        }

    }

    _handlePrevisitsFind() {
        const { fields: { team, region, zone, idUsuario }, getSchedulerPrevisits, showLoading } = this.props;
        showLoading(true, 'Cargando..');
        getSchedulerPrevisits(team.value, region.value, zone.value, idUsuario.value)

        this.setState({
            display: 'block'
        });

        showLoading(false, null);

    }

    bindClassParticipants(listParticipants, userName) {
        let isGrant = listParticipants.filter((item) => {
            return item.toLowerCase() === userName.toLowerCase();
        }).length > 0;
        return isGrant ? 'cls-green' : 'cls-yelow';
    }

    _updateValue(value) {
        const { fields: { idUsuario, nameUsuario, cargoUsuario }, contactsByClient } = this.props;
        var contactClient = contactsByClient.get('contacts');
        var userSelected;
        _.map(contactClient, contact => {
            if (contact.id.toString() === value) {
                userSelected = contact;
                return contact;
            }
        });
        if (validateValue(userSelected)) {
            nameUsuario.onChange(userSelected.nameComplet);
            this._handlePrevisitsFind();
        }
    }

    componentDidMount() {
        let self = this;
        $("#iconSearchParticipants").click(function () {
            var e = { keyCode: 13, consultclick: true };
            self.updateKeyValueUsersBanco(e);
        });
    }

    componentWillUpdate() {
        let self = this;
        $("#iconSearchParticipants").click(function () {
            var e = { keyCode: 13, consultclick: true };
            self.updateKeyValueUsersBanco(e);
        });
    }

    updateKeyValueUsersBanco(e) {
        const { fields: { objetoUsuario, nameUsuario, idUsuario, cargoUsuario, empresaUsuario }, filterUsersBanco } = this.props;
        const selfThis = this;
        if (e.keyCode === 13 || e.which === 13) {
            e.consultclick ? "" : e.preventDefault();
            if (nameUsuario.value !== "" && nameUsuario.value !== null && nameUsuario.value !== undefined) {
                $('.ui.search.participantBanc').toggleClass('loading');
                filterUsersBanco(nameUsuario.value).then((data) => {
                    usersBanco = _.get(data, 'payload.data.data');
                    $('.ui.search.participantBanc')
                        .search({
                            cache: false,
                            source: usersBanco,
                            maxResults: 1500,
                            searchFields: [
                                'title',
                                'description',
                                'idUsuario',
                                'cargo'
                            ],
                            onSelect: function (event) {
                                nameUsuario.onChange(event.title);
                                idUsuario.onChange(event.idUsuario);
                                selfThis._handlePrevisitsFind();
                                selfThis.setState({
                                    display: 'block'
                                });
                                return 'default';
                            }
                        });
                    $('.ui.search.participantBanc').toggleClass('loading');
                    setTimeout(function () {
                        $('#inputParticipantBanc').focus();
                    }, 150);
                });
            }
        }
    }

    render() {
        const { fields: { team, region, zone, nameUsuario }, schedulerPrevisitReduser, selectsReducer, navBar } = this.props;
        const data = schedulerPrevisitReduser.get('schedulerPrevisitList');
        const userName = localStorage.getItem('userNameFront');
        const confidential = navBar.get('confidential');

        return (
            <div>
                <form>
                    <Row style={{ borderBottom: "2px solid #D9DEDF", marginTop: "15px", padding: "10px" }}>
                        <Col xs={12} sm={12} md={3} lg={2} style={{ width: '60%' }}>
                            <ComboBox
                                name="region"
                                labelInput="Región"
                                {...region}
                                onChange={val => this._onChangeRegionStatus(val)}
                                value={region.value}
                                onBlur={region.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient={'client'}
                                data={selectsReducer.get(LIST_REGIONS) || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={2} style={{ width: '60%' }}>
                            <ComboBox
                                name="zona"
                                labelInput="Zona"
                                {...zone}
                                onChange={val => this._onChangeZoneStatus(val)}
                                value={zone.value}
                                onBlur={zone.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient={'client'}
                                data={selectsReducer.get(LIST_ZONES) || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={2} style={{ width: '60%' }}>
                            <ComboBox
                                name="celula"
                                labelInput="Célula"
                                {...team}
                                onChange={val => this._onChangeTeam(val)}
                                value={team.value}
                                onBlur={team.onBlur}
                                valueProp={'id'}
                                textProp={'description'}
                                searchClient={'client'}
                                data={selectsReducer.get('teamValueObjects') || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={2}>
                                <div className="ui dropdown search participantBanc fluid" style={{ border: "0px", zIndex: "1", padding: "0px" }}>
                                    <ComboBoxFilter
                                        name="inputParticipantBanc"
                                        placeholder="Creador"
                                        {...nameUsuario}
                                        parentId="dashboardComponentScroll"
                                        value={nameUsuario.value}
                                        onChange={nameUsuario.onChange}
                                        onKeyPress={this.updateKeyValueUsersBanco}
                                        onSelect={val => this._updateValue(val)}
                                        max="255"
                                    />
                                </div>
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} style={{ width: '100%' }}>
                            <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                                title="Limpiar búsqueda" style={{ marginLeft: "17px" }}>
                                <i className="erase icon"
                                    style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
                            </button>
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2}>
                            <div style={{ height: '80px', marginLeft: '0px' }}>
                                <Row>
                                    <div style={{
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: GREEN_COLOR
                                    }} />
                                    <span style={{ marginLeft: '10px' }}> Está invitado</span>
                                </Row>
                                <Row style={{ marginTop: "5px" }}>
                                    <div style={{
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: ORANGE_COLOR
                                    }} />
                                    <span style={{ marginLeft: '10px' }}> No está invitado</span>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </form>
                <div style={{ padding: '10px', background: 'white', display: this.state.display }}>
                    <BigCalendar
                        {...this.props}
                        selectable
                        events={data}
                        defaultView='week'
                        culture={'es'}
                        messages={{
                            next: "Siguiente", previous: "Atrás",
                            today: "Hoy", week: "Semana",
                            month: "Mes", day: "Día",
                            agenda: "Agenda",
                            allDay: "Todo el día"

                        }}
                        scrollToTime={new Date(1970, 1, 1, 6)}
                        defaultDate={new Date()}
                        onSelectEvent={data => this.openModal(data.idClient, data.idPrevisit)}
                        eventPropGetter={data => ({ className: this.bindClassParticipants(data.listParticipantsBank, userName) })}
                    />
                </div>
                <Modal isOpen={this.state.modalIsOpen} contentLabel="Previsitas" onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
                    <div className="modalBt4-dialog modalBt4-lg">
                        <div className="modalBt4-content modal-content">
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">
                                    Previsita 
                                    {confidential &&
                                        <ConfidentialBrandComponent />
                                    }
                                </h4>
                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                           {/*<EditPrevisit params={{ id: this.state.idPrevisit }} viewBottons={true} closeModal={this.closeModal} />*/}
                           <PrevisitPage params={{ id: this.state.idPrevisit }} viewBottons={true} closeModal={this.closeModal}></PrevisitPage>
                        </div>
                    </div>
                </Modal>
            </div>
        )

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSchedulerPrevisits,
        consultInfoClient,
        validatePermissionsByModule,
        updateTitleNavBar,
        consultList,
        consultDataSelect,
        consultListWithParameterUbication,
        clearConsultListWithParameterUbication,
        consultListWithParameter,
        changeTeam,
        changeRegion,
        showLoading,
        clearFilter,
        changeZone,
        getRegionsByEmployee,
        clrearConsultListWithParameter,
        filterUsersBanco,
        clearPrevisitPermissions,
        clearLists,
        showBrandConfidential
    }, dispatch);
}
function mapStateToProps({ schedulerPrevisitReduser, selectsReducer, contactsByClient, navBar }, ownerProps) {
    return {
        schedulerPrevisitReduser,
        selectsReducer,
        contactsByClient,
        fields,
        navBar
    };
}


export default reduxForm({ form: SHEDULER_FILTER, fields }, mapStateToProps, mapDispatchToProps)(Sheduler);