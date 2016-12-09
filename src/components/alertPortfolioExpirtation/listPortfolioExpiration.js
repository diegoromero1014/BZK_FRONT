/**
 * Created by ahurtado on 12/06/2016.
 */
import React, {Component, PropTypes} from 'react';
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

class ListClientsPortfolioExpiration extends Component {

    constructor(props) {
        super(props);
        momentLocalizer(moment);
        this._renderHeaders = this._renderHeaders.bind(this);
        this._orderColumn = this._orderColumn.bind(this);
        this.state = {
            orderA: 'none',
            orderD: 'inline-block'
        }
    }

    componentWillMount() {
        this.state = {
            orderA: 'none',
            orderD: 'inline-block'
        }
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
            if (has(data, 'payload.data.data')) {
                showLoading(false, null);
            }
        });
    }

    _renderHeaders() {
        const headersTable = [
            {
                title: "Tipo documento",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "typeDocument")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "typeDocument")}></i></span>,
                key: "typeDocument"
            },
            {
                title: "Número documento",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "idNumberClient")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "idNumberClient")}></i></span>,
                key: "idNumberClient"
            },
            {
                title: "Nombre/Razón social",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "clientName")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "clientName")}></i></span>,
                key: "clientName",
                showLink :has(this.props.reducerGlobal.get('permissionsClients'), indexOf(this.props.reducerGlobal.get('permissionsClients'), VISUALIZAR), false)
            },
            {
                title: "Saldo",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "balance")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "balance")}></i></span>,
                key: "balance"
            },
            {
                title: "Días vencidos",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "daysOverdue")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "daysOverdue")}></i></span>,
                key: "daysOverdue"
            },
            {
                title: "Entidad",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "entity")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "entity")}></i></span>,
                key: "entity"
            },
            {
                title: "Responsable",
                orderColumn: <span><i className="caret down icon"style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "responsible")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "responsible")}></i></span>,
                key: "responsible"
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
                <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)}/>
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

