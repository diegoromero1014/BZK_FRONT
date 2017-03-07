/**
 * Created by Andres Hurtado on 01/03/2017.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    clearClientOrder,
    clearClientPagination,
    orderColumnBlackList,
    blackListFindServer
} from './actions';
import GridComponent from '../grid/component';
import {redirectUrl} from '../globalComponents/actions'
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {mapDataGrid} from './alertBlackListUtilities';
import {get,indexOf,has} from 'lodash';
import {showLoading} from '../loading/actions';
import {NUMBER_RECORDS} from './constants';

class ListAlertBlackLists extends Component {

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
        const {alertBlackList, blackListFindServer,showLoading} = this.props;
        const keyWordNameNit = alertBlackList.get('keywordNameNit');
        const keywordNameNitClient = alertBlackList.get('keywordNameNitClient');
        const typeEntity = alertBlackList.get('typeEntity');
        const page = alertBlackList.get('pageNum');
        showLoading(true, 'Cargando..');
        blackListFindServer(keyWordNameNit, keywordNameNitClient, typeEntity, page, NUMBER_RECORDS, orderClients, columnClients).then((data) => {
            if (has(data, 'payload.data.data')) {
                showLoading(false, null);
            }
        });
    }

    _renderHeaders() {

        const headersTable = [
            {
                title: "Número documento cliente",
                key: "documentClient"
            },
            {
                title: "Nombre/Razón social",
                key: "nameClient",
            },
            {
                title: "Tipo identificación",
                key: "documentTypeEntity"
            },
            {
                title: "Número Documento",
                key: "documentEntity"
            },
            {
                title: "Nombre",
                key: "nameEntity"
            },
            {
                title: "Tipo entidad",
                key: "typeEntity"
            },
            {
                title: "Mensaje",
                key: "message"
            },
            {
                title: "Nivel",
                key: "level"
            }
        ];

        return headersTable;
    }

    _renderCellView(data) {
        return mapDataGrid(data);
    }

    render() {
        const {alertBlackList} = this.props;
        const data = alertBlackList.get('responseBlackList');
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
        orderColumnBlackList,
        blackListFindServer,
        showLoading
    }, dispatch);
}

function mapStateToProps({alertBlackList}, ownerProps) {
    return {
        alertBlackList
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListAlertBlackLists);

