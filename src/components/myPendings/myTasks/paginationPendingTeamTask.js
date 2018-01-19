import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NUMBER_RECORDS } from './constants';
import {
    tasksTeamByUser,
    limitiInfTeam,
    changePageTeam,
    clearPendingTaskTeam,
    clearMyPendingsTeamOrder,
    clearOnlyListPendingTaskTeam
} from './actions';
import { get } from 'lodash';
import { showLoading } from '../../loading/actions';
import { MESSAGE_LOAD_DATA } from '../../../constantsGlobal';
import { redirectUrl } from '../../../actionsGlobal';

let region = "";
let zone = "";
let team = "";
let taskStatus = "";
let dateTaskTeam = "";
let idUsuario = "";

class PaginationPendingTeamTask extends Component {

    constructor(props) {
        super(props);
        this._handleFindPendingtask = this._handleFindPendingtask.bind(this);
    }

    _handleFindPendingtask(limInf) {
        const { tasksTeamByUser, myPendingsReducer, showLoading } = this.props;
        showLoading(true, MESSAGE_LOAD_DATA);

        tasksTeamByUser(limInf, NUMBER_RECORDS, region, zone, team,
            taskStatus, dateTaskTeam, idUsuario, myPendingsReducer.get('orderMyPending'), myPendingsReducer.get('columnMyPending')).then((data) => {
                showLoading(false, null);
                if (!get(data, 'payload.data.validateLogin') || get(data, 'payload.data.validateLogin') === 'false') {
                    redirectUrl("/login");
                }
            });
    }

    componentWillMount() {
        this.props.clearPendingTaskTeam();
    }

    componentWillReceiveProps(nextProps) {
        const { clearMyPendingsTeamOrder } = this.props;
        let flagClear = false;
        if (region !== nextProps.region) {
            region = nextProps.region;
            flagClear = true;
        }
        if (zone !== nextProps.zone) {
            zone = nextProps.zone;
            flagClear = true;
        }
        if (team !== nextProps.team) {
            team = nextProps.team;
            flagClear = true;
        }
        if (taskStatus !== nextProps.taskStatus) {
            taskStatus = nextProps.taskStatus;
            flagClear = true;
        }
        if (dateTaskTeam !== nextProps.dateTaskTeam) {
            dateTaskTeam = nextProps.dateTaskTeam;
            flagClear = true;
        }
        if (idUsuario !== nextProps.idUsuario) {
            idUsuario = nextProps.idUsuario;
            flagClear = true;
        }

        if (flagClear) {
            clearMyPendingsTeamOrder();
        }
    }

    _handlePaginar(page) {
        const { changePageTeam, limitiInfTeam, clearOnlyListPendingTaskTeam } = this.props;
        clearOnlyListPendingTaskTeam();
        const limInf = (page - 1);
        limitiInfTeam(limInf);
        changePageTeam(page);
        this._handleFindPendingtask(limInf);
    }

    render() {
        const { myPendingsReducer, config } = this.props;
        const page = myPendingsReducer.get('pageTeam');
        let firstPage = 1;
        if (page > 4) {
            firstPage = page - 3;
        }
        const rowCount = myPendingsReducer.get('rowCountTeamTask');
        const lastPage = Math.ceil(rowCount / NUMBER_RECORDS);
        return (
            <div>
                {rowCount > NUMBER_RECORDS ?
                    <div style={{
                        borderTop: "2px solid #D9DEDF",
                        width: "100%",
                        marginTop: "15px",
                        paddingTop: "15px",
                        marginLeft: '5px'
                    }}>
                        <span style={{ fontWeight: 'bold' }}>Pág. {page} de {lastPage}</span>
                        <div style={{ textAlign: "center" }}>
                            <ul className="pagination">
                                {page !== 1 ? <li onClick={() => {
                                    this._handlePaginar(page - 1)
                                }}><a>«</a></li> : ""}
                                {firstPage <= lastPage ?
                                    <li><a className={page === firstPage ? "active" : ""} onClick={() => {
                                        this._handlePaginar(firstPage)
                                    }}>{firstPage}</a></li>
                                    : ''}
                                {firstPage + 1 <= lastPage ?
                                    <li><a className={page === firstPage + 1 ? "active" : ""} onClick={() => {
                                        this._handlePaginar(firstPage + 1)
                                    }}>{firstPage + 1}</a></li>
                                    : ''}
                                {firstPage + 2 <= lastPage ?
                                    <li><a className={page === firstPage + 2 ? "active" : ""} onClick={() => {
                                        this._handlePaginar(firstPage + 2)
                                    }}>{firstPage + 2}</a></li>
                                    : ''}
                                {firstPage + 3 <= lastPage ?
                                    <li><a className={page === firstPage + 3 ? "active" : ""} onClick={() => {
                                        this._handlePaginar(firstPage + 3)
                                    }}>{firstPage + 3}</a></li>
                                    : ''}
                                {firstPage + 4 <= lastPage ?
                                    <li><a className={page === firstPage + 4 ? "active" : ""} onClick={() => {
                                        this._handlePaginar(firstPage + 4)
                                    }}>{firstPage + 4}</a></li>
                                    : ''}
                                {firstPage + 5 <= lastPage ?
                                    <li><a className={page === firstPage + 5 ? "active" : ""} onClick={() => {
                                        this._handlePaginar(firstPage + 5)
                                    }}>{firstPage + 5}</a></li>
                                    : ''}
                                {firstPage + 6 <= lastPage ?
                                    <li><a className={page === firstPage + 6 ? "active" : ""} onClick={() => {
                                        this._handlePaginar(firstPage + 6)
                                    }}>{firstPage + 6}</a></li>
                                    : ''}
                                {page !== lastPage ?
                                    <li onClick={() => {
                                        this._handlePaginar(page + 1)
                                    }}><a>»</a></li>
                                    : ''}
                            </ul>
                        </div>
                    </div>
                    : <div></div>}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clearOnlyListPendingTaskTeam,
        tasksTeamByUser,
        limitiInfTeam,
        changePageTeam,
        clearPendingTaskTeam,
        clearMyPendingsTeamOrder,
        showLoading
    }, dispatch);
}

function mapStateToProps({ myPendingsReducer }, ownerProps) {
    return {
        myPendingsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationPendingTeamTask);
