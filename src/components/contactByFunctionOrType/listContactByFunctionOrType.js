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
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {mapDataGrid} from './contactByFunctionOrTypeUtilities';
import {get,indexOf,has} from 'lodash';
import {showLoading} from '../loading/actions';
import {NUMBER_RECORDS} from './constants';

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
        const idType = contactsByFunctionOrType.get('idType');
        const page = contactsByFunctionOrType.get('pageNum');
        console.log(orderContacts, columnContact, page)
        showLoading(true, 'Cargando..');
        contactsByFunctionOrTypeFindServer(idFunction, idType, page, NUMBER_RECORDS, orderContacts, columnContact).then((data) => {
            if (has(data, 'payload.data')) {
            showLoading(false, null);
        }
    });
    }

    _renderHeaders() {

        const headersTable = [
            {
                title: "Número documento del cliente",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "D09_CLIENT_ID_NUMBER")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(0, "D09_CLIENT_ID_NUMBER")}></i></span>,
                key: "clientIdNumber"
            },
            {
                title: "Nombre/Razón social del cliente",
                orderColumn: <span><i className="caret down icon" style={{cursor: 'pointer', display: this.state.orderD}} onClick={() => this._orderColumn(1, "D09_CLIENT_NAME")}></i><i className="caret up icon" style={{cursor: 'pointer', display: this.state.orderA}} onClick={() => this._orderColumn(1, "D09_CLIENT_NAME")}></i></span>,
                key: "clientName"
            },
            {
                title: "Número documento del contacto",
                key: "contactIdNumber"
            },
            {
                title: "Nombre del contacto",
                key: "modalNameLink",
                showLink : true
            },
            {
                title: "Tipo de contacto",
                key: "contactType"
            },
            {
                title: "Email del contacto",
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
        console.log('este es el data',data)
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
