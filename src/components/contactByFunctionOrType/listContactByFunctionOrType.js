/**
 * Created by ahurtado on 12/06/2016.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    clearContactsOrder,
    clearContactsByFunctionPagination,
    orderColumnContactsByFunctionOrType,
    contactsByFunctionOrTypeFindServer
} from './actions';
import GridComponent from '../grid/component';
import {redirectUrl} from '../globalComponents/actions'
import {VISUALIZAR} from '../../constantsGlobal';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {mapDataGrid} from './contactByFunctionOrTypeUtilities';
import {get,indexOf,has} from 'lodash';
import {showLoading} from '../loading/actions';

class ListContactsByFunctionOrType extends Component {

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

    _orderColumn(orderContacts, columnContact) {
        if (orderContacts === 1) {
            this.setState({orderD: 'none', orderA: 'inline-block'});
        } else {
            this.setState({orderD: 'inline-block', orderA: 'none'});
        }

        const {contactsByFunctionOrTypeFindServer,contactsByFunctionOrType,showLoading} = this.props;

        const idFunction = contactsByFunctionOrType.get('idFunction');
        const idType = contactsByFunctionOrType.get('idContactType');
        const page = contactsByFunctionOrType.get('pageNum');
        showLoading(true, 'Cargando..');
        contactsByFunctionOrTypeFindServer(idFunction, idType, page, NUMBER_RECORDS, orderContacts, columnContact).then((data) => {
            if (has(data, 'payload.data.data')) {
            showLoading(false, null);
        }
    });
    }

    _renderHeaders() {

        const headersTable = [
            {
                title: "Número documento del cliente",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "clientIdNumber")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "clientIdNumber")}></i></span>,
                key: "clientIdNumber"
            },
            {
                title: "Nombre/Razón social del cliente",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "clientName")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "clientName")}></i></span>,
                key: "clientName"
            },
            {
                title: "Número documento del contacto",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "contactIdNumber")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "contactIdNumber")}></i></span>,
                key: "contactIdNumber"
            },
            {
                title: "Nombre del contacto",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "contactNameLink")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "contactNameLink")}></i></span>,
                key: "contactNameLink",
                showLink : true
            },
            {
                title: "Tipo de contacto",
                orderColumn: <span><i className="caret down icon"style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "contactType")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "contactType")}></i></span>,
                key: "contactType"
            },
            {
                title: "Email del contacto",
                orderColumn: <span><i className="caret down icon"style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "contactEmail")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}}onClick={() => this._orderColumn(0, "contactEmail")}></i></span>,
                key: "contactEmail"
            },
            {
                title: "",
                key: "delete"
            },
        ];
        return headersTable;
    }

    _renderCellView(data) {
        return mapDataGrid(data);
    }

    render() {
        const {contactsByFunctionOrType} = this.props;
        const data = contactsByFunctionOrType.get('responseContacts');
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
        clearContactsOrder,
        clearContactsByFunctionPagination,
        orderColumnContactsByFunctionOrType,
        contactsByFunctionOrTypeFindServer,
        showLoading
    }, dispatch);
}

function mapStateToProps({contactsByFunctionOrType, reducerGlobal}, ownerProps) {
    return {
        contactsByFunctionOrType,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListContactsByFunctionOrType);

