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
import {get,indexOf} from 'lodash';

let v1 = "";
class ListDraftDocuments extends Component {

    constructor(props) {
        super(props);
        momentLocalizer(moment);
        // this._renderCellView = this._renderCellView.bind(this);
        this._renderHeaders = this._renderHeaders.bind(this);
        this.state = {
            column: "",
            order: "",
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
        // const {draftsDocumentsByUser, orderColumnDraftDocument, clearDraftDocumentPaginator} = this.props;
        // clearDraftDocumentPaginator();
        // orderColumnDraftDocument(orderClients, columnClients);
        // draftsDocumentsByUser(0, NUMBER_RECORDS, v1, orderClients, columnClients);
    }

    _renderHeaders() {

        const headersTable = [
            {
                title: "Tipo de documento",
                orderColumn: <span><i className="caret down icon"
                                      style={{cursor: 'pointer', display: this.state.orderD}}
                                      onClick={() => this._orderColumn(0, "results.typeDocument")}></i><i
                    className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}
                    onClick={() => this._orderColumn(1, "results.typeDocument")}></i></span>,
                key: "typeDocument"
            },
            {
                title: "Número de documento",
                orderColumn: <span><i className="caret down icon"
                                      style={{cursor: 'pointer', display: this.state.orderD}}
                                      onClick={() => this._orderColumn(0, "results.idNumberClient")}></i><i
                    className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}
                    onClick={() => this._orderColumn(1, "results.idNumberClient")}></i></span>,
                key: "idNumberClient"
            },
            {
                title: "Nombre/Razón social",
                orderColumn: <span><i className="caret down icon"
                                      style={{cursor: 'pointer', display: this.state.orderD}}
                                      onClick={() => this._orderColumn(0, "results.clientName")}></i><i
                    className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}
                    onClick={() => this._orderColumn(1, "results.clientName")}></i></span>,
                key: "clientName"
            },
            {
                title: "Célula",
                orderColumn: <span><i className="caret down icon"
                                      style={{cursor: 'pointer', display: this.state.orderD}}
                                      onClick={() => this._orderColumn(0, "results.team")}></i><i
                    className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}
                    onClick={() => this._orderColumn(1, "results.team")}></i></span>,
                key: "team"
            },
            {
                title: "Region",
                orderColumn: <span><i className="caret down icon"
                                      style={{cursor: 'pointer', display: this.state.orderD}}
                                      onClick={() => this._orderColumn(0, "results.region")}></i><i
                    className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}
                    onClick={() => this._orderColumn(1, "results.region")}></i></span>,
                key: "region"
            },
            {
                title: "Zona",
                orderColumn: <span><i className="caret down icon"
                                      style={{cursor: 'pointer', display: this.state.orderD}}
                                      onClick={() => this._orderColumn(1, "results.zone")}></i><i
                    className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}
                    onClick={() => this._orderColumn(0, "results.zone")}></i></span>,
                key: "zone"
            },
            {
                title: "Última fecha de modificación",
                orderColumn: <span><i className="caret down icon"
                                      style={{cursor: 'pointer', display: this.state.orderD}}
                                      onClick={() => this._orderColumn(1, "results.lastUpdateDate")}></i><i
                    className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}
                    onClick={() => this._orderColumn(0, "results.lastUpdateDate")}></i></span>,
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
        orderColumnClientPendingUpdate
    }, dispatch);
}

function mapStateToProps({alertPendingUpdateClient, reducerGlobal}, ownerProps) {
    return {
        alertPendingUpdateClient,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListDraftDocuments);

