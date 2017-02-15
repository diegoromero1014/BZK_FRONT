/**
 * Created by ahurtado on 11/28/2016.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    clearClientOrder,
    clearClientPagination,
    orderColumnCovenants,
    covenantsFindServer
} from './actions';
import GridComponent from '../grid/component';
import {redirectUrl} from '../globalComponents/actions'
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {mapDataGrid} from './covenantsUtilities';
import {get,indexOf,has} from 'lodash';
import {showLoading} from '../loading/actions';
import {NUMBER_RECORDS} from './constants';

class ListCovenants extends Component {

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
        const {alertCovenant, covenantsFindServer,showLoading} = this.props;
        const keyWordNameNit = alertCovenant.get('keywordNameNit');
        const statusCovenant = alertCovenant.get('statusCovenant');
        const page = alertCovenant.get('pageNum');
        showLoading(true, 'Cargando..');
        covenantsFindServer(keyWordNameNit, statusCovenant, page, NUMBER_RECORDS, orderClients, columnClients).then((data) => {
            if (has(data, 'payload.data.data')) {
                showLoading(false, null);
            }
        });
    }

    _renderHeaders() {

        const headersTable = [
            {
                title: "Id covenant",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "idCovenant")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "idCovenant")}></i></span>,
                key: "idCovenant"
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
            },
            {
                title: "Acta o contrato",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "contractOrRecord")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "contractOrRecord")}></i></span>,
                key: "agreement"
            },
            {
                title: "Entidad/Línea de negocio",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "lineOfBusiness")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "lineOfBusiness")}></i></span>,
                key: "lineOfBusiness"
            },
            {
                title: "Gerente responsable",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "manager")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "manager")}></i></span>,
                key: "manager"
            },
            {
                title: "Fecha de vencimiento",
                orderColumn: <span><i className="caret down icon"style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "expirationDate")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "expirationDate")}></i></span>,
                key: "expirationDate"
            }, {
                title: "Estado",
                orderColumn: <span><i className="caret down icon"style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "statusCovenant")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "statusCovenant")}></i></span>,
                key: "statusCovenant"
            },
            {
                title: "Seguimiento",
                key: "tracing"
            }
        ];

        return headersTable;
    }

    _renderCellView(data) {
        return mapDataGrid(data);
    }

    render() {
        const {alertCovenant} = this.props;
        const data = alertCovenant.get('responseCovenants');
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
        orderColumnCovenants,
        covenantsFindServer,
        showLoading
    }, dispatch);
}

function mapStateToProps({alertCovenant}, ownerProps) {
    return {
        alertCovenant
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCovenants);

