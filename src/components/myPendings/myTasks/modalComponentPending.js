import React, { Component } from "react";
import { reduxForm } from "redux-form";
import { bindActionCreators } from "redux";
import _ from "lodash";
import $ from 'jquery';
import { Col, Grid, Row } from "react-flexbox-grid";

import ComboBoxFilter from "../../../ui/comboBoxFilter/comboBoxFilter";
import ListPendingTaskComponent from "./listMyPendingComponent";
import ListMyPendingTeamComponent from "./listMyPendingTeamComponent";
import PaginationPendingTask from "./paginationPendingTask";
import PaginationPendingTeamTask from "./paginationPendingTeamTask";
import Tooltip from "../../toolTip/toolTipComponent";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';

import { redirectUrl } from "../../globalComponents/actions";
import { updateTitleNavBar } from "../../navBar/actions";
import { swtShowMessage } from "../../sweetAlertMessages/actions";
import { changeStateSaveData } from "../../main/actions";
import { showLoading } from "../../loading/actions";
import { filterUsersBanco } from '../../participantsVisitPre/actions';
import { formValidateKeyEnter, onSessionExpire, validateResponse } from '../../../actionsGlobal';
import {
    consultList,
    consultListWithParameter,
    consultListWithParameterUbication,
    getMasterDataFields
} from '../../selectsComponent/actions';
import {
    changePageTeam,
    clearMyPendingPaginator,
    clearMyPendingsOrder,
    clearMyPendingsTeamOrder,
    clearMyPendingTeamPaginator,
    clearOnlyListPendingTask,
    clearOnlyListPendingTaskTeam,
    clearPendingTask,
    clearPendingTaskTeam,
    downloadPendingTask,
    getDownloadMyPendingTask,
    getDownloadPendingTask,
    limitiInfTeam,
    tasksByUser,
    tasksTeamByUser
} from "./actions";

import { LIST_REGIONS, LIST_ZONES, TASK_STATUS, TEAM_FOR_EMPLOYEE_REGION_ZONE } from '../../selectsComponent/constants';
import {
    ERROR_TITLE_FILTERS_TEAM,
    ERROR_TITLE_FILTERS_TEAM_MESSAGE,
    MY_PENDINGS_BY_TEAM_TITLE,
    MY_PENDINGS_TITLE,
    NUMBER_RECORDS
} from "./constants";
import {
    DESCARGAR,
    GREEN_COLOR,
    MESSAGE_DOWNLOAD_DATA,
    MESSAGE_ERROR,
    MESSAGE_ERROR_SWEET_ALERT,
    MESSAGE_LOAD_DATA,
    ORANGE_COLOR,
    RED_COLOR,
    TITLE_ERROR_SWEET_ALERT
} from "../../../constantsGlobal";

const fields = ["region", "zone", "team", "taskStatus", "dateTaskTeam",
    "objetoUsuario", "nameUsuario", "idUsuario", "cargoUsuario", "empresaUsuario"
];

var usersBanco = [];

class ModalComponentPending extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keywordMyPending: '',
            teamViewTask: false,
            region: '',
            zone: '',
            team: '',
            enabledZona: false,
            dateTaskTeam: ""

        };

        this.consultInfoMyPendingTask = this.consultInfoMyPendingTask.bind(this);
        this._handleMyPendingByClientsFind = this._handleMyPendingByClientsFind.bind(this);
        this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
        this._downloadPendingTask = this._downloadPendingTask.bind(this);
        this._downloadMyPendingTask = this._downloadMyPendingTask.bind(this);
        this._changeViewModeTeamTask = this._changeViewModeTeamTask.bind(this);
        this.consultInfoMyPendingTeamTask = this.consultInfoMyPendingTeamTask.bind(this);
        this._onChangeRegion = this._onChangeRegion.bind(this);
        this._onChangeZone = this._onChangeZone.bind(this);
        this._changeDateTaskTeam = this._changeDateTaskTeam.bind(this);
        this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
        this._loadResponsable = this._loadResponsable.bind(this);
        this._changeResponsableInput = this._changeResponsableInput.bind(this);
    }

    _handleChangeKeyword(e) {
        if (e.keyCode === 13 || e.which === 13) {
            this.consultInfoMyPendingTask();
        } else {
            this.setState({
                keywordMyPending: e.target.value
            });
        }
    }

    _downloadPendingTask() {
        const { fields: { region, zone, team, taskStatus, dateTaskTeam, idUsuario }, getDownloadPendingTask, changeStateSaveData } = this.props;
        changeStateSaveData(true, MESSAGE_DOWNLOAD_DATA);
        getDownloadPendingTask(region.value, zone.value, team.value, taskStatus.value, dateTaskTeam.value, idUsuario.value).then((data) => {
            downloadPendingTask(data.payload.data.data,changeStateSaveData);
        });
    }

    _downloadMyPendingTask(){
        const {getDownloadMyPendingTask , changeStateSaveData} = this.props;
        changeStateSaveData(true, MESSAGE_DOWNLOAD_DATA);
        getDownloadMyPendingTask(this.state.keywordMyPending).then((data)=>{
            downloadPendingTask(data.payload.data.data,changeStateSaveData);
        });
    }

    componentWillMount() {
        const { clearPendingTask, updateTitleNavBar, getMasterDataFields, showLoading, swtShowMessage, consultListWithParameter } = this.props;
        clearPendingTask();
        showLoading(true, MESSAGE_LOAD_DATA);
        consultListWithParameter(TEAM_FOR_EMPLOYEE_REGION_ZONE, { region: "", zone: "" });

        getMasterDataFields([TASK_STATUS, LIST_REGIONS, LIST_ZONES]).then((data) => {
            this.consultInfoMyPendingTask();
            if (_.get(data, 'payload.data.validateLogin') === false) {
                onSessionExpire();
            }

        }, () => {
            showLoading(false, '');
            swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });

        updateTitleNavBar(MY_PENDINGS_TITLE);
    }

    consultInfoMyPendingTask() {
        const { tasksByUser, clearMyPendingPaginator, clearOnlyListPendingTask, showLoading, swtShowMessage } = this.props;

        clearOnlyListPendingTask();
        clearMyPendingPaginator();
        tasksByUser(0, NUMBER_RECORDS, this.state.keywordMyPending).then((data) => {
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            }
            showLoading(false, '');
        }, () => {
            showLoading(false, '');
            swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    consultInfoMyPendingTeamTask() {
        const { fields: { region, zone, team, taskStatus, dateTaskTeam, idUsuario }, tasksTeamByUser, clearMyPendingTeamPaginator,
            clearOnlyListPendingTaskTeam, clearMyPendingsTeamOrder, showLoading, swtShowMessage
        } = this.props;

        if (!region.value && !zone.value && !team.value && !taskStatus.value && !dateTaskTeam.value && !idUsuario.value) {
            swtShowMessage(MESSAGE_ERROR, ERROR_TITLE_FILTERS_TEAM, ERROR_TITLE_FILTERS_TEAM_MESSAGE);
            return;
        }

        clearMyPendingTeamPaginator();
        clearOnlyListPendingTaskTeam();
        clearMyPendingsTeamOrder();

        tasksTeamByUser(0, NUMBER_RECORDS, region.value, zone.value, team.value, taskStatus.value, dateTaskTeam.value, idUsuario.value).then((data) => {
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            }
            showLoading(false, '');
        }, () => {
            showLoading(false, '');
            swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });

    }

    _handleMyPendingByClientsFind() {
        const { tasksByUser, clearMyPendingPaginator, clearMyPendingsOrder, showLoading } = this.props;
        clearMyPendingPaginator();
        clearMyPendingsOrder();
        this.setState({ keywordMyPending: this.state.keywordMyPending.trim() });
        if (this.state.keywordMyPending) {
            showLoading(true, MESSAGE_LOAD_DATA);
            tasksByUser(0, NUMBER_RECORDS, this.state.keywordMyPending, null, "").then((data) => {
                showLoading(false, '');
            });
        }
    }

    _changeViewModeTeamTask() {
        
        const { fields: { region, zone, team }, clearMyPendingTeamPaginator, clearOnlyListPendingTaskTeam, clearPendingTaskTeam, updateTitleNavBar } = this.props;

        this.state.teamViewTask = !this.state.teamViewTask;

        clearMyPendingTeamPaginator();
        clearOnlyListPendingTaskTeam();

        region.onChange("");
        zone.onChange("");
        team.onChange("");

        clearPendingTaskTeam();

        if (!this.state.teamViewTask) {
            updateTitleNavBar(MY_PENDINGS_TITLE);
            this.consultInfoMyPendingTask();
        } else {
            updateTitleNavBar(MY_PENDINGS_BY_TEAM_TITLE);
        }
    }

    _cleanSearch() {
        this.setState({ keywordMyPending: "" });
        const {
            fields: { region, zone, team, nameUsuario, idUsuario, cargoUsuario, empresaUsuario, taskStatus, dateTaskTeam },
            tasksByUser, clearMyPendingPaginator, clearMyPendingsOrder, clearOnlyListPendingTask,
            showLoading, clearPendingTaskTeam, consultListWithParameter
        } = this.props;


        region.onChange("");
        zone.onChange("");
        team.onChange("");

        nameUsuario.onChange("");
        idUsuario.onChange("");
        cargoUsuario.onChange("");
        empresaUsuario.onChange("");
        taskStatus.onChange("");
        dateTaskTeam.onChange("");

        clearOnlyListPendingTask();
        clearMyPendingPaginator();
        clearMyPendingsOrder();

        clearPendingTaskTeam();

        showLoading(true, MESSAGE_LOAD_DATA);

        consultListWithParameter(TEAM_FOR_EMPLOYEE_REGION_ZONE, { region: "", zone: "" });

        tasksByUser(0, NUMBER_RECORDS, "", null, "").then(() => {
            showLoading(false, '');
        });

        this.setState({
            enabledZona: false
        })
    }

    _onChangeRegion() {
        const { fields: { region, zone, team }, consultListWithParameterUbication, consultListWithParameter } = this.props;

        consultListWithParameterUbication(LIST_ZONES, region.value);
        consultListWithParameter(TEAM_FOR_EMPLOYEE_REGION_ZONE, {
            region: region.value
        });

        this.setState({
            enabledZona: true
        })

        zone.onChange("");
        team.onChange("");
    }

    _onChangeZone() {
        const { fields: { region, zone, team }, consultListWithParameter } = this.props;
        consultListWithParameter(TEAM_FOR_EMPLOYEE_REGION_ZONE, {
            region: region.value,
            zone: zone.value
        });

        team.onChange("");
    }

    _changeDateTaskTeam(value) {
        const { fields: { dateTaskTeam } } = this.props;
        dateTaskTeam.onChange(value);
    }

    _loadResponsable() {
        const { fields: { objetoUsuario, nameUsuario, idUsuario, cargoUsuario, empresaUsuario }, filterUsersBanco, swtShowMessage } = this.props;

        if (nameUsuario.value !== "" && nameUsuario.value !== null && nameUsuario.value !== undefined) {
            if (nameUsuario.value.length < 3) {
                swtShowMessage('error', 'Error', 'Señor usuario, para realizar la búsqueda es necesario ingresar al menos 3 caracteres');
                return;
            }

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
                        onSelect: (event) => {
                            objetoUsuario.onChange(event);
                            nameUsuario.onChange(event.title);
                            idUsuario.onChange(event.idUsuario);
                            cargoUsuario.onChange(event.cargo);
                            empresaUsuario.onChange(event.empresa);
                            return 'default';
                        }
                    });
                $('.ui.search.participantBanc').toggleClass('loading');
                setTimeout(() => {
                    $('#inputParticipantBanc').focus();
                }, 150);
            });
        } else {
            objetoUsuario.onChange(null);
            nameUsuario.onChange(null);
            idUsuario.onChange(null);
            cargoUsuario.onChange(null);
            empresaUsuario.onChange(null);
        }
    }

    updateKeyValueUsersBanco(e) {
        if (e.keyCode === 13 || e.which === 13) {
            e.consultclick ? "" : e.preventDefault();
            this._loadResponsable();
        }
    }

    _changeResponsableInput(e) {
        const { fields: { objetoUsuario, nameUsuario, idUsuario, cargoUsuario, empresaUsuario } } = this.props;
        nameUsuario.onChange(e);

        if (!e.currentTarget.value) {
            objetoUsuario.onChange(null);
            nameUsuario.onChange(null);
            idUsuario.onChange(null);
            cargoUsuario.onChange(null);
            empresaUsuario.onChange(null);
        }
    }

    render() {
        const {
            fields: { region, zone, team, taskStatus, dateTaskTeam, nameUsuario, idUsuario },
            myPendingsReducer, reducerGlobal, selectsReducer, formValidateKeyEnter
        } = this.props;

        let visibleTable = 'none';
        let visibleTableTeam = 'none';
        let visibleMessage = 'block';
        let visibleMessageTeam = 'block';
        if (myPendingsReducer.get('rowCount') !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }

        if (myPendingsReducer.get('rowCountTeamTask') !== 0) {
            visibleTableTeam = 'block';
            visibleMessageTeam = 'none';
        }

        return (
            <div className="tab-pane quickZoomIn animated"
                style={{ width: "100%", marginTop: "10px", marginBottom: "20px" }}>
                <div style={{ padding: '10px', overflow: 'initial' }}>

                    <form onKeyPress={val => formValidateKeyEnter(val, true)} >
                        <Row style={{ borderBottom: "2px solid #D9DEDF" }}>
                            {this.state.teamViewTask &&
                                <Row style={{ width: "100%", marginLeft: "2px", marginBottom: "15px" }}>

                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <ComboBox
                                            labelInput="Región"
                                            {...region}
                                            value={region.value}
                                            onBlur={region.onBlur}
                                            onChange={val => this._onChangeRegion(val)}
                                            valueProp={'id'}
                                            textProp={'value'}
                                            searchClient={'client'}
                                            data={selectsReducer.get(LIST_REGIONS) || []}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <ComboBox
                                            labelInput="zona"
                                            {...zone}
                                            value={zone.value}
                                            onBlur={zone.onBlur}
                                            onChange={this._onChangeZone}
                                            valueProp={'id'}
                                            textProp={'value'}
                                            searchClient={'client'}
                                            disabled={this.state.enabledZona ? '' : 'disabled'}
                                            data={selectsReducer.get(LIST_ZONES) || []}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <ComboBox
                                            name="celula"
                                            labelInput="Célula"
                                            {...team}
                                            value={team.value}
                                            onBlur={team.onBlur}
                                            valueProp={'id'}
                                            textProp={'description'}
                                            searchClient={'client'}
                                            data={selectsReducer.get('teamValueObjects')}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <ComboBox
                                            name="estadoTarea"
                                            labelInput="Estado"
                                            {...taskStatus}
                                            value={taskStatus.value}
                                            onBlur={taskStatus.onBlur}
                                            valueProp={'id'}
                                            textProp={'value'}
                                            searchClient={'client'}
                                            data={selectsReducer.get('taskStatus')}
                                        />
                                    </Col>
                                </Row>
                            }
                            {this.state.teamViewTask &&
                                <Row style={{ width: "60%", marginLeft: "2px" }}>
                                    <Col xs={12} sm={12} md={6} lg={6}>
                                        <DateTimePickerUi
                                            placeholder="Fecha de cierre"
                                            {...dateTaskTeam}
                                            value={dateTaskTeam.value}
                                            culture='es'
                                            format={"DD/MM/YYYY"}
                                            time={false}
                                            onChange={val => this._changeDateTaskTeam(val)}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6}>

                                        <div className="ui dropdown search participantBanc fluid" style={{ border: "0px", zIndex: "1", padding: "0px" }}>
                                            <ComboBoxFilter
                                                name="inputParticipantBanc"
                                                placeholder="Responsable"
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

                                </Row>
                            }

                            {!this.state.teamViewTask &&
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <div className="InputAddOn">
                                        <input type="text" style={{ padding: '0px 11px !important' }}
                                            placeholder="Búsqueda por tipo de documento, número de documento y nombre del cliente"
                                            value={this.state.keywordMyPending}
                                            onKeyPress={this._handleChangeKeyword}
                                            onChange={this._handleChangeKeyword}
                                            className="input-lg input InputAddOn-field" />
                                        <button id="searchExpression" className="btn" title="Búsqueda por tipo de documento, número de documento y nombre del cliente" type="button"
                                            onClick={this._handleMyPendingByClientsFind} style={{ backgroundColor: "#E0E2E2" }}>
                                            <i className="search icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                                        </button>
                                    </div>
                                </Col>
                            }

                            <Col xs={12} sm={12} md={2} lg={4} style={{ width: '100%', minWidth: "436px" }}>
                                {this.state.teamViewTask &&

                                    <button className="btn btn-primary" type="button" onClick={this.consultInfoMyPendingTeamTask}
                                        title="Buscar" style={{ marginLeft: "10px" }}>
                                        <i className="search icon"
                                            style={{ color: "white", margin: '0em', fontSize: '1.2em' }} />
                                    </button>

                                }
                                <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                                    title="Limpiar búsqueda" style={{ marginLeft: "10px" }}>
                                    <i className="erase icon"
                                        style={{ color: "white", margin: '0em', fontSize: '1.2em' }} />
                                </button>
                                <button className="btn btn-primary" type="button" onClick={this._changeViewModeTeamTask}
                                    title="Cambiar modo de visualización" style={{ marginLeft: "10px" }}>
                                    <i className="refresh icon" style={{ color: "white", margin: '0em', fontSize: '1.2em' }} />
                                    Cambiar tipo de búsqueda
                                </button>
                                {_.get(reducerGlobal.get('permissionsTasks'), _.indexOf(reducerGlobal.get('permissionsTasks'), DESCARGAR), false) &&

                                    <Tooltip text="Descarga de tareas pendientes">
                                        <button className="btn btn-primary" type="button" onClick={ this.state.teamViewTask ? this._downloadPendingTask : this._downloadMyPendingTask}
                                            style={{ marginLeft: "10px" }} >
                                            <i className="file excel outline icon"
                                                style={{ color: "white", margin: '0em', fontSize: '1.2em' }} />
                                        </button>
                                    </Tooltip>

                                }
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} >
                                <div style={{ height: "50px", marginLeft: "30px", width: "auto", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                                    <Row style={{ width: "150px", display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <div style={{
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: RED_COLOR
                                        }} />
                                        <span style={{ marginLeft: '10px' }}> Tarea vencida</span>
                                    </Row>
                                    <Row style={{ width: "225px", display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <div style={{
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: ORANGE_COLOR
                                        }} />
                                        <span style={{ marginLeft: '10px' }}> Tarea próxima a vencerse</span>
                                    </Row>
                                    <Row style={{ width: "150px", display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <div style={{
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: GREEN_COLOR
                                        }} />
                                        <span style={{ marginLeft: '10px' }}> Tarea con tiempo</span>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </form>

                </div>

                {!this.state.teamViewTask &&
                    <div>
                        <Grid style={{ display: visibleTable, width: "100%", marginBottom: '10px' }}>
                            <Row style={{ backgroundColor: 'white', marginLeft: '10px', marginRight: '10px' }}>
                                <Col style={{ width: '100%' }}>
                                    <ListPendingTaskComponent keyWordParameter={this.state.keywordMyPending} />
                                    <div style={{ marginBottom: '10px' }}>
                                        <PaginationPendingTask keyWordParameter={this.state.keywordMyPending} />
                                    </div>
                                </Col>
                            </Row>
                        </Grid>

                        <Grid style={{ display: visibleMessage, width: "100%" }}>
                            <Row center="xs">
                                <Col xs={12} sm={8} md={12} lg={12} style={{ marginTop: '15px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado resultados para la búsqueda</span>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                }
                {this.state.teamViewTask &&
                    <div>
                        <Grid style={{ display: visibleTableTeam, width: "100%", marginBottom: '10px' }}>
                            <Row style={{ backgroundColor: 'white', marginLeft: '10px', marginRight: '10px' }}>
                                <Col style={{ width: '100%' }}>
                                    <ListMyPendingTeamComponent region={region.value} zone={zone.value}
                                        team={team.value} taskStatus={taskStatus.value} dateTaskTeam={dateTaskTeam.value} idUsuario={idUsuario.value} />
                                    <div style={{ marginBottom: '10px' }}>
                                        <PaginationPendingTeamTask region={region.value} zone={zone.value}
                                            team={team.value} taskStatus={taskStatus.value} dateTaskTeam={dateTaskTeam.value} idUsuario={idUsuario.value} />
                                    </div>
                                </Col>
                            </Row>
                        </Grid>

                        <Grid style={{ display: visibleMessageTeam, width: "100%" }}>
                            <Row center="xs">
                                <Col xs={12} sm={8} md={12} lg={12} style={{ marginTop: '15px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado resultados para la búsqueda</span>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                }

            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clearOnlyListPendingTask,
        redirectUrl,
        clearPendingTask,
        tasksByUser,
        clearMyPendingPaginator,
        clearMyPendingsOrder,
        updateTitleNavBar,
        changeStateSaveData,
        getDownloadPendingTask,
        validateResponse,
        swtShowMessage,
        showLoading,
        getMasterDataFields,
        tasksTeamByUser,
        changePageTeam,
        limitiInfTeam,
        clearMyPendingTeamPaginator,
        clearOnlyListPendingTaskTeam,
        consultList,
        consultListWithParameterUbication,
        consultListWithParameter,
        clearMyPendingsTeamOrder,
        clearPendingTaskTeam,
        filterUsersBanco,
        formValidateKeyEnter,
        getDownloadMyPendingTask
    }, dispatch);
}

function mapStateToProps({ myPendingsReducer, reducerGlobal, navBar, selectsReducer }, ownerProps) {
    return {
        myPendingsReducer,
        reducerGlobal,
        navBar,
        selectsReducer
    };
}

export default reduxForm({ form: 'simple', fields }, mapStateToProps, mapDispatchToProps)(ModalComponentPending);