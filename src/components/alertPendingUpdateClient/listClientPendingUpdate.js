/**
 * Created by ahurtado on 11/28/2016.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    clearClientOrder,
    clearClientPagination,
    orderColumnClientPendingUpdate
} from './actions';
import GridComponent from '../grid/component';
import {redirectUrl} from '../globalComponents/actions'
import {EDITAR} from '../../constantsGlobal';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {mapDataGrid} from './clientPendingUpdateUtilities';
import {get,indexOf,has} from 'lodash';
import {showLoading} from '../loading/actions';
import {clientsPendingUpdateFindServer} from './actions';
import {NUMBER_RECORDS} from './constants';

let v1 = "";
class ListDraftDocuments extends Component {

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

    componentWillReceiveProps(nextProps) {
        const {value1} = nextProps;
        if ((v1 !== nextProps.value1)) {
            v1 = nextProps.value1;
        }
    }

    _orderColumn(orderClients, columnClients) {
        if (orderClients === 1) {
            this.setState({orderD: 'none', orderA: 'inline-block'});
        } else {
            this.setState({orderD: 'inline-block', orderA: 'none'});
        }
        const {clientsPendingUpdateFindServer,alertPendingUpdateClient,showLoading} = this.props;
        const keyWordNameNit = alertPendingUpdateClient.get('keywordNameNit');
        const idTeam = alertPendingUpdateClient.get('idTeam');
        const idRegion = alertPendingUpdateClient.get('idRegion');
        const idZone = alertPendingUpdateClient.get('idZone');
        const page = alertPendingUpdateClient.get('pageNum');
        showLoading(true, 'Cargando..');
        clientsPendingUpdateFindServer(keyWordNameNit, idTeam, idRegion, idZone, page, NUMBER_RECORDS, orderClients, columnClients).then((data) => {
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
                key: "clientName"
            },
            {
                title: "Célula",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "team")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "team")}></i></span>,
                key: "team"
            },
            {
                title: "Region",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "region")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "region")}></i></span>,
                key: "region"
            },
            {
                title: "Zona",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "zone")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "zone")}></i></span>,
                key: "zone"
            },
            {
                title: "Última modificación",
                orderColumn: <span><i className="caret down icon"style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "lastUpdateDate")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "lastUpdateDate")}></i></span>,
                key: "lastUpdateDate"
            }
        ];

        const buttonEdit = {
            title: "",
            key: "actionsRedirect",
            icon: "edit icon"
        };
        const {reducerGlobal} = this.props;
        if(get(reducerGlobal.get('permissionsClients'), indexOf(reducerGlobal.get('permissionsClients'), EDITAR), false)){
            headersTable.push(buttonEdit);
        }
        return headersTable;
    }

    _renderCellView(data) {
        return mapDataGrid(data);
    }

    render() {
        const {alertPendingUpdateClient} = this.props;
        const data = alertPendingUpdateClient.get('responseClients');
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
        orderColumnClientPendingUpdate,
        clientsPendingUpdateFindServer,
        showLoading
    }, dispatch);
}

function mapStateToProps({alertPendingUpdateClient, reducerGlobal}, ownerProps) {
    return {
        alertPendingUpdateClient,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListDraftDocuments);

