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
import {mapDataGrid} from './alertCovenantsUtilities';
import {get,indexOf,has} from 'lodash';
import {showLoading} from '../loading/actions';
import {NUMBER_RECORDS} from './constants';

const data2 = [
    {
        idCovenant: "232332",
        idNumberClient:"2433243",
        clientName:"dssdsdsdsd",
        agreement:"sadsadssd",
        lineOfBusiness:"sadsadssd",
        manager:"Andres hurtado",
        expirationDate: '01 01 2018',
    }
];

class ListAlertCovenants extends Component {

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
                key: "idCovenant"
            },
            {
                title: "Número documento",
                key: "documentClient"
            },
            {
                title: "Nombre/Razón social",
                key: "nameClient",
            },
            {
                title: "Acta o contrato",
                key: "agreement"
            },
            {
                title: "Entidad/Línea de negocio",
                key: "lineOfBusiness"
            },
            {
                title: "Gerente responsable",
                key: "managerAccount"
            },
            {
                title: "Fecha de vencimiento",
                key: "nextExpirationTimestamp"
            }, {
                title: "Estado",
                key: "trafficLight"
            },
            {
                title: "Seguimiento",
                key: "actions"
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

export default connect(mapStateToProps, mapDispatchToProps)(ListAlertCovenants);

