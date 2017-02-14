import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import GridComponent from '../../grid/component';
import {redirectUrl} from '../../globalComponents/actions'
import {mapDataGrid} from './covenantsUtilities';
import {get, indexOf, has} from 'lodash';
import {showLoading} from '../../loading/actions';
import {clientCovenants} from './actions';
import {} from './constants';


class ListCovenantsComponent extends Component {

    constructor(props) {
        super(props);
        this._renderHeaders = this._renderHeaders.bind(this);
    }


    componentWillMount() {
        const {clientCovenants} = this.props;
        clientCovenants();
    }


    _renderHeaders() {

        const headersTable = [
            {
                title: "",
                key:"actions"
            },
            {
                title: "Id covenant",
                key: "typeDocument"
            },
            {
                title: "Negocio/Producto",
                key: "idNumberClient"
            },
            {
                title: "Descripción de acta",
                key: "team"
            },
            {
                title: "Frecuencia de revisión",
                key: "region"
            },
            {
                title: "Acta o contrato",
                key: "zone"
            },
            {
                title: "Fecha próximo seguimiento",
                key: "lastUpdateDate"
            }
        ];

        return headersTable;
    }

    _renderCellView(data) {
        return mapDataGrid(data);
    }

    render() {
        const {covenant} = this.props;
        const data = covenant.get('responseCovenant');

        return (
            <div className="horizontal-scroll-wrapper" style={{overflow: 'scroll', background: '#fff'}}>
                <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)}/>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clientCovenants,
        redirectUrl,
        showLoading
    }, dispatch);
}

function mapStateToProps({covenant,reducerGlobal}, ownerProps) {
    return {
        covenant,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCovenantsComponent);
