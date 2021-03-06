import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    clearClientOrder,
    clearClientPagination,
    orderColumnClientPortfolioExpiration
} from './actions';
import GridComponent from '../grid/component';
import {redirectUrl} from '../globalComponents/actions'
import {VISUALIZAR} from '../../constantsGlobal';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {mapDataGrid} from './clientPortfolioExpirationUtilities';
import {get,indexOf,has} from 'lodash';
import {showLoading} from '../loading/actions';
import {clientsPortfolioExpirationFindServer} from './actions';
import {NUMBER_RECORDS} from './constants';
import { ALERT_PORTFOLIO_EXPECTATIONS } from '../selectsComponent/constants';
import { getMasterDataFields } from "../../components/selectsComponent/actions";
import { ALERT_PORTFOLIO_EXPIRATION_LIST } from '../modal/constants';

class ListClientsPortfolioExpiration extends Component {

    constructor(props) {
        super(props);
        momentLocalizer(moment);
        this._renderHeaders = this._renderHeaders.bind(this);
        this._orderColumn = this._orderColumn.bind(this);
        this.state = {
            orderD: 'none',
            orderA: 'inline-block'
        }
    }

    componentWillMount() {
        const {getMasterDataFields} = this.props;
        this.state = {
            orderD: 'none',
            orderA: 'inline-block'
        }
        getMasterDataFields([ALERT_PORTFOLIO_EXPECTATIONS])
    }

    _orderColumn(orderClients, columnClients) {
        if (orderClients === 1) {
            this.setState({orderD: 'none', orderA: 'inline-block'});
        } else {
            this.setState({orderD: 'inline-block', orderA: 'none'});
        }
        const {clientsPortfolioExpirationFindServer,alertPortfolioExpiration,showLoading} = this.props;
        const keyWordNameNit = alertPortfolioExpiration.get('keywordNameNit');
        const idTeam = alertPortfolioExpiration.get('idTeam');
        const idRegion = alertPortfolioExpiration.get('idRegion');
        const idZone = alertPortfolioExpiration.get('idZone');
        const page = alertPortfolioExpiration.get('pageNum');
        showLoading(true, 'Cargando..');
        clientsPortfolioExpirationFindServer(keyWordNameNit, idTeam, idRegion, idZone, page, NUMBER_RECORDS, orderClients, columnClients).then((data) => {
            if (has(data, 'payload.data.data.pagination')) {
                showLoading(false, null);
            }
        });
    }

    _renderHeaders() {
        const headersTable = [
            {
                title: "Número documento",
                orderColumn: 
                    <span>
                        <i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "idNumberClient")}></i>
                        <i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "idNumberClient")}></i>
                    </span>,
                key: "idNumberClient"
            },
            {
                title: "Nombre/Razón social",
                orderColumn: 
                    <span>
                        <i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "clientName")}></i>
                        <i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "clientName")}></i>
                    </span>,
                key: "clientNameLink",
                showLink :has(this.props.reducerGlobal.get('permissionsClients'), indexOf(this.props.reducerGlobal.get('permissionsClients'), VISUALIZAR), false)
            },
            {
                title: "Saldo vencido",
                orderColumn: 
                    <span>
                        <i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "balanceOverdue")}></i>
                        <i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "balanceOverdue")}></i>
                    </span>,
                key: "balanceOverdue"
            },
            {
                title: "Saldo total grupo",
                orderColumn: 
                    <span>
                        <i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "groupTotalBalance")}></i>
                        <i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "groupTotalBalance")}></i>
                    </span>,
                key: "groupTotalBalance"
            },
            {
                title: "Días mora proyectados",
                orderColumn: 
                    <span>
                        <i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "daysOverdue")}></i>
                        <i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "daysOverdue")}></i>
                    </span>,
                key: "daysOverdue"
            },
            {
                title: "Entidad / línea de negocio",
                orderColumn: 
                    <span>
                        <i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "entity")}></i>
                        <i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "entity")}></i>
                    </span>,
                key: "entity"
            },
            {
                title: "Responsable",
                orderColumn: 
                    <span>
                        <i className="caret down icon"style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "responsible")}></i>
                        <i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "responsible")}></i>
                    </span>,
                key: "responsible"
            },
            {
                title: "Diligenciar Observaciones",
                key: "actions"
            }
        ];
        return headersTable;
    }

    _renderCellView(data) {
        return mapDataGrid(data);
    }

    render() {
        const {alertPortfolioExpiration} = this.props;
        const data = alertPortfolioExpiration.get('responseClients');
        return (
            <div className="horizontal-scroll-wrapper" style={{overflow: 'scroll', background: '#fff'}}>
                <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle="Diligenciar Observaciones" origin={ALERT_PORTFOLIO_EXPIRATION_LIST}/>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        redirectUrl,
        clearClientOrder,
        clearClientPagination,
        orderColumnClientPortfolioExpiration,
        clientsPortfolioExpirationFindServer,
        getMasterDataFields,
        showLoading
    }, dispatch);
}

function mapStateToProps({alertPortfolioExpiration, reducerGlobal}, ownerProps) {
    return {
        alertPortfolioExpiration,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListClientsPortfolioExpiration);

