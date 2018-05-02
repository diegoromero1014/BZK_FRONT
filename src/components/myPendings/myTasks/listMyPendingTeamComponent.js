import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    tasksByUser,
    clearPendingTask,
    orderColumnMyPending,
    clearMyPendingPaginator,
    clearMyPendingsOrder,
    clearMyPendingTeamPaginator,
    orderColumnMyPendingTeam,
    tasksTeamByUser
} from './actions';
import GridComponent from '../../grid/component';
import { redirectUrl } from '../../globalComponents/actions'
import { NUMBER_RECORDS } from './constants';
import { MODULE_TASKS, EDITAR, MESSAGE_LOAD_DATA } from '../../../constantsGlobal';
import { validatePermissionsByModule } from '../../../actionsGlobal';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import { mapDataGrid } from './pendingTaskUtilities';
import { TASK_STATUS } from '../../selectsComponent/constants';
import { has, get, indexOf } from 'lodash';
import { showLoading } from '../../loading/actions';

let region = "";
let zone = "";
let team = "";
let taskStatus = "";
let dateTaskTeam = "";
let idUsuario = "";

class ListMyPendingTeamComponent extends Component {

    constructor(props) {
        super(props);
        momentLocalizer(moment);
        this._renderCellView = this._renderCellView.bind(this);
        this._renderHeaders = this._renderHeaders.bind(this);
        this.state = {
            column: "",
            order: "",
            orderA: 'none',
            orderD: 'inline-block'
        }
    }

    componentWillMount() {
        const { validatePermissionsByModule } = this.props;

        validatePermissionsByModule(MODULE_TASKS).then((data) => {
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            }
        });
        this.state = {
            orderA: 'none',
            orderD: 'inline-block'
        }
    }

    componentWillReceiveProps(nextProps) {
        if (region !== nextProps.region) {
            region = nextProps.region;
        }
        if (zone !== nextProps.zone) {
            zone = nextProps.zone;
        }
        if (team !== nextProps.team) {
            team = nextProps.team;
        }
        if (taskStatus !== nextProps.taskStatus) {
            taskStatus = nextProps.taskStatus;
        }
        if (dateTaskTeam !== nextProps.dateTaskTeam) {
            dateTaskTeam = nextProps.dateTaskTeam;
        }
        if (idUsuario !== nextProps.idUsuario) {
            idUsuario = nextProps.idUsuario;
        }
    }

    _orderColumn(orderMyPending, columnMyPending) {
        if (orderMyPending === 1) {
            this.setState({ orderA: 'none', orderD: 'inline-block' });
        } else {
            this.setState({ orderA: 'inline-block', orderD: 'none' });
        }
        const { clearMyPendingTeamPaginator, orderColumnMyPendingTeam, tasksTeamByUser, showLoading } = this.props;
        clearMyPendingTeamPaginator();
        orderColumnMyPendingTeam(orderMyPending, columnMyPending);

        showLoading(true, MESSAGE_LOAD_DATA);

        tasksTeamByUser(0, NUMBER_RECORDS, region, zone, team, taskStatus, dateTaskTeam, idUsuario, orderMyPending, columnMyPending).then((data) => {
            if (has(data, 'payload.data.data')) {
                showLoading(false, null);
            }
        });

    }

    _renderHeaders() {
        return [
            {
                title: "",
                key: "actions"
            },
            {
                title: "Tipo documento",
                orderColumn: <span><i className="caret down icon"
                    style={{ cursor: 'pointer', display: this.state.orderD }}
                    onClick={() => this._orderColumn(0, "MD_TC.D05_KEY")}></i><i
                        className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }}
                        onClick={() => this._orderColumn(1, "MD_TC.D05_KEY")}></i></span>,
                key: "idTypeClient",
                width: '160px'
            },
            {
                title: "Número documento",
                orderColumn: <span><i className="caret down icon"
                    style={{ cursor: 'pointer', display: this.state.orderD }}
                    onClick={() => this._orderColumn(0, "CLI.D09_CLIENT_ID_NUMBER")}></i><i
                        className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }}
                        onClick={() => this._orderColumn(1, "CLI.D09_CLIENT_ID_NUMBER")}></i></span>,
                key: "idNumberClient",
                width: '170px'
            },
            {
                title: "Nombre/Razón social",
                orderColumn: <span><i className="caret down icon"
                    style={{ cursor: 'pointer', display: this.state.orderD }}
                    onClick={() => this._orderColumn(0, "CLI.D09_CLIENT_NAME")}></i><i
                        className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }}
                        onClick={() => this._orderColumn(1, "CLI.D09_CLIENT_NAME")}></i></span>,
                key: "clientName",
                width: '380px'
            },
            {
                title: "Asignada por",
                orderColumn: <span><i className="caret down icon"
                    style={{ cursor: 'pointer', display: this.state.orderD }}
                    onClick={() => this._orderColumn(0, "FOE.D06_NAME")}></i><i
                        className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }}
                        onClick={() => this._orderColumn(1, "FOE.D06_NAME")}></i></span>,
                key: "assignedBy",
                width: '150px'
            },
            {
                title: "Responsable",
                key: "responsible",
                width: '150px'
            },
            {
                title: "",
                key: "trafficLight"
            },
            {
                title: "Fecha cierre",
                orderColumn: <span><i className="caret down icon"
                    style={{ cursor: 'pointer', display: this.state.orderD }}
                    onClick={() => this._orderColumn(0, "UT.D62_CLOSING_DATE")}></i><i
                        className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }}
                        onClick={() => this._orderColumn(1, "UT.D62_CLOSING_DATE")}></i></span>,
                key: "closeDate",
                width: '170px'
            },
            {
                title: "Estado",
                key: "changeStateTask",
                width: '100px'
            }
        ]
    }

    _renderCellView(data) {
        const { reducerGlobal } = this.props;
        var editPendings = get(reducerGlobal.get('permissionsTasks'), indexOf(reducerGlobal.get('permissionsTasks'), EDITAR), false);
        return mapDataGrid(data, editPendings === EDITAR ? true : editPendings);
    }

    render() {
        const { myPendingsReducer } = this.props;
        const modalTitle = 'Tarea';
        const data = myPendingsReducer.get('pendingTaskTeamListByUser');
        return (
            <div className="horizontal-scroll-wrapper" style={{ overflow: 'auto', overflowX: 'hidden' }}>
                <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle} />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        tasksByUser,
        clearPendingTask,
        orderColumnMyPending,
        clearMyPendingPaginator,
        clearMyPendingsOrder,
        validatePermissionsByModule,
        redirectUrl,
        clearMyPendingTeamPaginator, orderColumnMyPendingTeam, tasksTeamByUser,
        showLoading
    }, dispatch);
}

function mapStateToProps({ myPendingsReducer, reducerGlobal }, ownerProps) {
    return {
        myPendingsReducer,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListMyPendingTeamComponent);