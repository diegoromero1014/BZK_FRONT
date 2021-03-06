import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { shareholdersByClientFindServer, clearShareholder, orderColumnShareholder, clearShareholderPaginator, clearShareholderOrder } from './actions';
import GridComponent from '../../../grid/component';
import { NUMBER_RECORDS, DELETE_TYPE_SHAREHOLDER } from './constants';
import { ELIMINAR } from '../../../../constantsGlobal';

let v1 = "";
let v2 = "";

class ListShareholderComponent extends Component {

  constructor(props) {
    super(props);
    this._renderCellView = this._renderCellView.bind(this);
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
    const {
          value1,
      value2
      } = nextProps;
    if ((v1 !== nextProps.value1) || (v2 !== nextProps.value2)) {
      v1 = nextProps.value1;
      v2 = nextProps.value2;
      const { clearShareholderOrder } = this.props;
      clearShareholderOrder();
      this._orderColumn(1, "sh.sharePercentage");
    }
  }


  _orderColumn(orderShareholder, columnShareholder) {
    if (orderShareholder === 1) {
      this.setState({ orderA: 'none', orderD: 'inline-block' });
    } else {
      this.setState({ orderA: 'inline-block', orderD: 'none' });
    }
    const { shareholdersReducer, shareholdersByClientFindServer, orderColumnShareholder, clearShareholderPaginator } = this.props;
    clearShareholderPaginator();
    orderColumnShareholder(orderShareholder, columnShareholder);
    shareholdersByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, columnShareholder, orderShareholder, shareholdersReducer.get('keywordShareholder'), v1, v2);
  }

  _renderHeaders() {
    return [
      {
        title: "",
        key: "actions"
      },
      {
        title: "Tipo de documento",
        key: "shareHolderIdType"
      },
      {
        title: "Número de documento",
        key: "shareHolderIdNumber"
      },
      {
        title: "Tipo de persona",
        key: "shareHolderType"
      },
      {
        title: "Nombre/Razón social",
        key: "name"
      },
      {
        title: "Participación",
        orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderD }} onClick={() => this._orderColumn(0, "sh.sharePercentage")}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }} onClick={() => this._orderColumn(1, "sh.sharePercentage")}></i></span>,
        key: "percentageS",
        style: { textAlign: 'right' }
      },
      {
        title: "Tipo de accionista",
        key: "shareHolderKind"
      },
      {
        title: "",
        key: "delete"
      }
    ]
  }

  _renderCellView(data) {
    const mensaje = "Señor usuario ¿está seguro que desea eliminar el accionista ";
    const { reducerGlobal } = this.props;
    var permissionsShareholders = reducerGlobal.get('permissionsShareholders');
    return _.forOwn(data, function (value, key) {
      
      var json1 = {
        "messageHeader": {
          "sessionToken": window.localStorage.getItem('sessionTokenFront'),
          "timestamp": new Date().getTime(),
          "service": "",
          "status": "0",
          "language": "es",
          "displayErrorMessage": "",
          "technicalErrorMessage": "",
          "applicationVersion": "",
          "debug": true,
          "isSuccessful": true
        },
        "messageBody": {
          "entity": "SHAREHOLDER",
          "id": value.id
        }
      }
      _.set(value, 'actions', {
        actionView: true,
        id: value.id,
        urlServer: "./component",
        component: "VIEW_SHAREHOLDER"
      });
      _.set(value, 'percentageS', value.percentage + "%");
      if (_.get(permissionsShareholders, _.indexOf(permissionsShareholders, ELIMINAR), false)) {
        _.set(value, 'delete', {
          actionDelete: true,
          urlServer: "/deleteEntity",
          typeDelete: DELETE_TYPE_SHAREHOLDER,
          mensaje: mensaje + value.name + "?",
          json: json1
        });
      }
    });
  }

  render() {
    const modalTitle = 'Detalle del accionista';
    const { shareholdersReducer } = this.props;
    const data = shareholdersReducer.get('shareholders');
    return (
      <div className="horizontal-scroll-wrapper" style={{ overflow: 'scroll' }}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    shareholdersByClientFindServer, clearShareholder, orderColumnShareholder, clearShareholderPaginator, clearShareholderOrder
  }, dispatch);
}

function mapStateToProps({ shareholdersReducer, reducerGlobal }, ownerProps) {
  return {
    shareholdersReducer,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListShareholderComponent);
