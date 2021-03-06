import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { indexOf, has } from 'lodash';
import GridComponent from '../grid/component';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import { mapDataGrid } from './clientPendingUpdateUtilities';
import { redirectUrl } from '../globalComponents/actions'
import { validatePermissionsByModule } from "../../actionsGlobal";
import { showLoading } from '../loading/actions';
import { clientsPendingUpdateFindServer } from './actions';
import {
    clearClientOrder,
    clearClientPagination,
    orderColumnClientPendingUpdate
} from './actions';
import { VISUALIZAR, EDITAR, MODULE_CLIENTS } from '../../constantsGlobal';
import { NUMBER_RECORDS } from './constants';

class ListClientsPendingUpdate extends Component {

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

        const { validatePermissionsByModule } = this.props;
        let globalResponse = this.props.reducerGlobal.get('permissionsClients');
        if (globalResponse && globalResponse.length > 0) {
            validatePermissionsByModule(MODULE_CLIENTS);
        }

    }

    _orderColumn(orderClients, columnClients) {
        if (orderClients === 1) {
            this.setState({ orderD: 'none', orderA: 'inline-block' });
        } else {
            this.setState({ orderD: 'inline-block', orderA: 'none' });
        }

        const { clientsPendingUpdateFindServer, alertPendingUpdateClient, showLoading } = this.props;
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
        let hasPermissionView = has(this.props.reducerGlobal.get('permissionsClients'), indexOf(this.props.reducerGlobal.get('permissionsClients'), VISUALIZAR), false);
        let hasPermissionEdit = has(this.props.reducerGlobal.get('permissionsClients'), indexOf(this.props.reducerGlobal.get('permissionsClients'), EDITAR), false);

        const headersTable = [
            {
                title: "Tipo documento",
                orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderD }} onClick={() => this._orderColumn(1, "typeDocument")}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }} onClick={() => this._orderColumn(0, "typeDocument")}></i></span>,
                key: "typeDocument"
            },
            {
                title: "Número documento",
                orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderD }} onClick={() => this._orderColumn(1, "idNumberClient")}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }} onClick={() => this._orderColumn(0, "idNumberClient")}></i></span>,
                key: "idNumberClient"
            },
            {
                title: "Nombre/Razón social",
                orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderD }} onClick={() => this._orderColumn(1, "clientName")}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }} onClick={() => this._orderColumn(0, "clientName")}></i></span>,
                key: "clientNameLink",
                showLink: hasPermissionView && hasPermissionEdit
            },
            {
                title: "Célula",
                orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderD }} onClick={() => this._orderColumn(1, "team")}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }} onClick={() => this._orderColumn(0, "team")}></i></span>,
                key: "team"
            },
            {
                title: "Región",
                orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderD }} onClick={() => this._orderColumn(1, "region")}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }} onClick={() => this._orderColumn(0, "region")}></i></span>,
                key: "region"
            },
            {
                title: "Zona",
                orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderD }} onClick={() => this._orderColumn(1, "zone")}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }} onClick={() => this._orderColumn(0, "zone")}></i></span>,
                key: "zone"
            },
            {
                title: "Última modificación",
                orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderD }} onClick={() => this._orderColumn(1, "lastUpdateDate")}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }} onClick={() => this._orderColumn(0, "lastUpdateDate")}></i></span>,
                key: "lastUpdateDate"
            }
        ];

        return headersTable;
    }

    _renderCellView(data) {
        return mapDataGrid(data);
    }

    render() {
        const { alertPendingUpdateClient } = this.props;
        const data = alertPendingUpdateClient.get('responseClients');
        return (
            <div className="horizontal-scroll-wrapper" style={{ overflow: 'scroll', background: '#fff' }}>
                <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} />
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
        showLoading,
        validatePermissionsByModule
    }, dispatch);
}

function mapStateToProps({ alertPendingUpdateClient, reducerGlobal }, ownerProps) {
    return {
        alertPendingUpdateClient,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListClientsPendingUpdate);