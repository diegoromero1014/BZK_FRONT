import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { bindActionCreators } from "redux";
import { Col, Grid, Row } from "react-flexbox-grid";
import { redirectUrl } from "../../globalComponents/actions";
import { updateTitleNavBar } from "../../navBar/actions";
import {
    clearMyPendingPaginator,
    clearMyPendingsOrder,
    clearOnlyListPendingTask,
    clearPendingTask,
    getDownloadPendingTask,
    tasksByUser,

    tasksTeamByUser,
    changePageTeam,
    limitiInfTeam,
    clearMyPendingTeamPaginator,
    clearOnlyListPendingTaskTeam

} from "./actions";
import {
    NUMBER_RECORDS,
    MY_PENDINGS_TITLE,
    MY_PENDINGS_BY_TEAM_TITLE
} from "./constants";
import ListPendingTaskComponent from "./listMyPendingComponent";
import ListMyPendingTeamComponent from "./ListMyPendingTeamComponent";
import PaginationPendingTask from "./paginationPendingTask";
import PaginationPendingTeamTask from "./paginationPendingTeamTask";
import {
    APP_URL,
    DESCARGAR,
    GREEN_COLOR,
    MESSAGE_DOWNLOAD_DATA,
    MESSAGE_LOAD_DATA, MESSAGE_ERROR,
    ORANGE_COLOR,
    SESSION_EXPIRED,
    RED_COLOR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT
} from "../../../constantsGlobal";
import { validateResponse } from "../../../actionsGlobal";
import _ from "lodash";
import Tooltip from "../../toolTip/toolTipComponent";
import { swtShowMessage } from "../../sweetAlertMessages/actions";
import { changeStateSaveData } from "../../dashboard/actions";
import { showLoading } from "../../loading/actions";
import { getMasterDataFields, consultList, consultTeamsByRegionByEmployee, consultListWithParameterUbication, consultListWithParameter } from '../../selectsComponent/actions';
import { TASK_STATUS, LIST_REGIONS, LIST_ZONES, TEAM_FOR_EMPLOYEE, TEAM_FOR_REGION_EMPLOYEE, TEAM_FOR_EMPLOYEE_REGION_ZONE } from '../../selectsComponent/constants';
import ComboBox from "../../../ui/comboBox/comboBoxComponent";

const fields = ["region", "zone", "team",];

class ModalComponentPending extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keywordMyPending: '',
            teamViewTask: false,
            region: '',
            zone: '',
            team: ''
        };
        this.consultInfoMyPendingTask = this.consultInfoMyPendingTask.bind(this);
        this._handleMyPendingByClientsFind = this._handleMyPendingByClientsFind.bind(this);
        this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
        this._downloadPendingTask = this._downloadPendingTask.bind(this);
        this._changeViewModeTeamTask = this._changeViewModeTeamTask.bind(this);
        this.consultInfoMyPendingTeamTask = this.consultInfoMyPendingTeamTask.bind(this);
        this._onChangeRegion = this._onChangeRegion.bind(this);
        this._onChangeZone = this._onChangeZone.bind(this);
        this._onChangeTeam = this._onChangeTeam.bind(this);
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
        const { getDownloadPendingTask, changeStateSaveData, swtShowMessage } = this.props;
        changeStateSaveData(true, MESSAGE_DOWNLOAD_DATA);
        getDownloadPendingTask().then((data) => {
            changeStateSaveData(false, "");
            if (validateResponse(data)) {
                window.open(APP_URL + '/getExcelReport?filename=' + _.get(data, 'payload.data.data.filename', null) + '&id=' + _.get(data, 'payload.data.data.sessionToken', null), '_blank');
            } else {
                swtShowMessage('error', 'Error descargando tareas', 'Señor usuario, ocurrió un error al tratar de descargar las tareas pendientes.');
            }
        });
    }

    componentWillMount() {
        const { clearPendingTask, consultList, updateTitleNavBar, getMasterDataFields, showLoading, swtShowMessage } = this.props;
        clearPendingTask();
        showLoading(true, MESSAGE_LOAD_DATA);

        consultList(TEAM_FOR_EMPLOYEE);

        getMasterDataFields([TASK_STATUS, LIST_REGIONS, LIST_ZONES]).then((data) => {
            this.consultInfoMyPendingTask();
            if (_.get(data, 'payload.data.messageHeader.status') === SESSION_EXPIRED) {
                redirectUrl("/login");
            }
        }, (reason) => {
            showLoading(false, '');
            swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
        updateTitleNavBar(MY_PENDINGS_TITLE);
    }

    consultInfoMyPendingTask() {
        const { tasksByUser, clearMyPendingPaginator, clearOnlyListPendingTask, showLoading, swtShowMessage, updateTitleNavBar } = this.props;
        updateTitleNavBar(MY_PENDINGS_TITLE);
        clearOnlyListPendingTask();
        clearMyPendingPaginator();
        tasksByUser(0, NUMBER_RECORDS, this.state.keywordMyPending).then((data) => {
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            }
            showLoading(false, '');
        }, (reason) => {
            console.log(reason);
            showLoading(false, '');
            swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    consultInfoMyPendingTeamTask() {
        const { fields: { region, zone, team }, tasksTeamByUser, clearMyPendingTeamPaginator,
            clearOnlyListPendingTaskTeam, showLoading, swtShowMessage, updateTitleNavBar } = this.props;

        updateTitleNavBar(MY_PENDINGS_BY_TEAM_TITLE);

        clearMyPendingTeamPaginator();
        clearOnlyListPendingTaskTeam();

        tasksTeamByUser(0, NUMBER_RECORDS, { region: region, zone: zone, team: team }).then((data) => {
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            }
            showLoading(false, '');
        }, (reason) => {
            showLoading(false, '');
            swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    _handleMyPendingByClientsFind() {
        const { tasksByUser, clearMyPendingPaginator, clearMyPendingsOrder, showLoading } = this.props;
        clearMyPendingPaginator();
        clearMyPendingsOrder();
        showLoading(true, MESSAGE_LOAD_DATA);
        tasksByUser(0, NUMBER_RECORDS, this.state.keywordMyPending, null, "").then((data) => {
            showLoading(false, '');
        });
    }


    _changeViewModeTeamTask() {
        this.state.teamViewTask = !this.state.teamViewTask;

        clearMyPendingTeamPaginator();
        clearOnlyListPendingTaskTeam();

        clearOnlyListPendingTask();
        clearMyPendingPaginator();

        if (this.state.teamViewTask) {
            this.consultInfoMyPendingTeamTask();
        } else {
            this.consultInfoMyPendingTask();
        }
    }

    _cleanSearch() {
        this.setState({ keywordMyPending: "" });
        const { tasksByUser, clearMyPendingPaginator, clearMyPendingsOrder, clearOnlyListPendingTask, showLoading } = this.props;
        clearOnlyListPendingTask();
        clearMyPendingPaginator();
        clearMyPendingsOrder();
        showLoading(true, MESSAGE_LOAD_DATA);
        tasksByUser(0, NUMBER_RECORDS, "", null, "").then((data) => {
            showLoading(false, '');
        });
    }


    _onChangeRegion(val) {
        const { fields: { region, zone, team }, consultTeamsByRegionByEmployee, consultListWithParameterUbication, consultListWithParameter } = this.props;
        consultListWithParameterUbication(LIST_ZONES, val);
        consultListWithParameter(TEAM_FOR_EMPLOYEE_REGION_ZONE, {
            region: region.value
        });
        this.consultInfoMyPendingTeamTask();
    }
    _onChangeZone() {
        const { fields: { region, zone, team }, consultTeamsByRegionByEmployee, consultListWithParameterUbication, consultListWithParameter } = this.props;
        consultListWithParameter(TEAM_FOR_EMPLOYEE_REGION_ZONE, {
            region: region.value,
            zone: zone.value
        });
        this.consultInfoMyPendingTeamTask();
    }
    _onChangeTeam() {
        this.consultInfoMyPendingTeamTask();
    }

    render() {
        const { fields: { region, zone, team }, myPendingsReducer, reducerGlobal, selectsReducer } = this.props;
        let visibleTable = 'none';
        let visibleMessage = 'block';
        if (myPendingsReducer.get('rowCount') !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }
        return (
            <div className="tab-pane quickZoomIn animated"
                style={{ width: "100%", marginTop: "10px", marginBottom: "20px" }}>
                <div style={{ padding: '10px', overflow: 'initial' }}>
                    <form>
                        <Row style={{ borderBottom: "2px solid #D9DEDF" }}>
                            {this.state.teamViewTask &&

                                <Row style={{ width: "60%", marginLeft: "2px" }}>
                                    <Col xs={12} sm={12} md={4} lg={4}>
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
                                    <Col xs={12} sm={12} md={4} lg={4}>
                                        <ComboBox
                                            labelInput="zona"
                                            {...zone}
                                            value={zone.value}
                                            onBlur={zone.onBlur}
                                            onChange={val => this._onChangeZone(val)}
                                            valueProp={'id'}
                                            textProp={'value'}
                                            searchClient={'client'}
                                            data={selectsReducer.get(LIST_ZONES) || []}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4}>
                                        <ComboBox
                                            name="celula"
                                            labelInput="Célula"
                                            {...team}
                                            value={team.value}
                                            onBlur={team.onBlur}
                                            onChange={val => this._onChangeTeam(val)}
                                            valueProp={'id'}
                                            textProp={'description'}
                                            searchClient={'client'}
                                            data={selectsReducer.get('teamValueObjects')}
                                        />
                                    </Col>
                                </Row>
                            }



                            {!this.state.teamViewTask &&
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <div className="InputAddOn">
                                        <input type="text" style={{ padding: '0px 11px !important' }} placeholder="Búsqueda por tipo de documento, número de documento y nombre del cliente"
                                            value={this.state.keywordMyPending} onKeyPress={this._handleChangeKeyword} onChange={this._handleChangeKeyword}
                                            className="input-lg input InputAddOn-field" />
                                        <button id="searchExpression" className="btn" title="Búsqueda por tipo de documento, número de documento y nombre del cliente" type="button"
                                            onClick={this._handleMyPendingByClientsFind} style={{ backgroundColor: "#E0E2E2" }}>
                                            <i className="search icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                                        </button>
                                    </div>
                                </Col>
                            }



                            <Col xs={12} sm={12} md={2} lg={1} style={{ width: '100%' }}>
                                <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                                    title="Limpiar búsqueda" style={{ marginLeft: "17px" }}>
                                    <i className="erase icon"
                                        style={{ color: "white", margin: '0em', fontSize: '1.2em' }} />
                                </button>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} style={{ width: '100%' }}>
                                <button className="btn btn-primary" type="button" onClick={this._changeViewModeTeamTask}
                                    title="Cambiar modo de visualización" style={{ marginLeft: "17px" }}>
                                    <i className="refresh icon" style={{ color: "white", margin: '0em', fontSize: '1.2em' }} />
                                    Cambiar tipo de búsqueda
                            </button>
                            </Col>
                            {_.get(reducerGlobal.get('permissionsTasks'), _.indexOf(reducerGlobal.get('permissionsTasks'), DESCARGAR), false) &&

                                <Col xs={12} sm={12} md={2} lg={1} style={{ width: '100%' }}>
                                    <Tooltip text="Descarga de tareas pendientes">
                                        <button className="btn btn-primary" type="button" onClick={this._downloadPendingTask}
                                            style={{ marginLeft: '-15px' }}>
                                            <i className="file excel outline icon"
                                                style={{ color: "white", margin: '0em', fontSize: '1.2em' }} />
                                        </button>
                                    </Tooltip>
                                </Col>
                            }
                            <Col xs={12} sm={12} md={12} lg={12} >
                                <div style={{ height: "50px", marginLeft: "30px", width: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Row style={{ width: "150px", display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <div style={{
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: RED_COLOR
                                        }} />
                                        <span style={{ marginLeft: '10px' }}> Tarea vencida</span>
                                    </Row>
                                    <Row style={{ width: "250px", display: "flex", flexDirection: "row", alignItems: "center" }}>
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
                        <Grid style={{ display: visibleTable, width: "100%", marginBottom: '10px' }}>
                            <Row style={{ backgroundColor: 'white', marginLeft: '10px', marginRight: '10px' }}>
                                <Col style={{ width: '100%' }}>
                                    <ListMyPendingTeamComponent keyWordParameter={this.state.keywordMyPending} />
                                    <div style={{ marginBottom: '10px' }}>
                                        <PaginationPendingTeamTask keyWordParameter={this.state.keywordMyPending} />
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
        consultListWithParameter
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

// export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentPending);
