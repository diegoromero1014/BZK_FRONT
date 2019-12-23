
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';


import GridComponent from '../grid/component';

import { businessPlanByClientFindServer, orderColumnBusinessPlan, clearBusinessPlanOrder, clearBusinessPlanPaginator } from './actions';

import { NUMBER_RECORDS, DELETE_TYPE_BUSINESS_PLAN } from './constants';
import { ELIMINAR } from '../../constantsGlobal';
import { MODULE_BUSINESS_PLAN } from '../grid/constants';

let v1 = "";

class ListBusinessPlanComponent extends Component {

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
    const { value1 } = nextProps;
    if (v1 !== nextProps.value1) {
      v1 = nextProps.value1;
      const { clearBusinessPlanOrder } = this.props;
      clearBusinessPlanOrder();
      this._orderColumn(1, "BP.D31_INITIAL_VALIDITY_DATE");
    }
  }


  _orderColumn(orderBusinessPlan, columnBusinessPlan) {
    if (orderBusinessPlan === 1) {
      this.setState({ orderA: 'none', orderD: 'inline-block' });
    } else {
      this.setState({ orderA: 'inline-block', orderD: 'none' });
    }
    const { businessPlanByClientFindServer, orderColumnBusinessPlan, clearBusinessPlanPaginator } = this.props;
    clearBusinessPlanPaginator();
    orderColumnBusinessPlan(orderBusinessPlan, columnBusinessPlan);
    businessPlanByClientFindServer(window.sessionStorage.getItem('idClientSelected'), 0, NUMBER_RECORDS, columnBusinessPlan, orderBusinessPlan, v1, "");
  }

  _renderHeaders() {
    return [
      {
        title: "",
        key: "actionsRedirect"
      },
      {
        title: "Objetivo del plan",
        key: "objective"
      },
      {
        title: "Fecha inicial",
        orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderD }} onClick={() => this._orderColumn(0, "BP.D31_INITIAL_VALIDITY_DATE")}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }} onClick={() => this._orderColumn(1, "BP.D31_INITIAL_VALIDITY_DATE")}></i></span>,
        key: "initialValidityDate"
      },
      {
        title: "Fecha final",
        orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderD }} onClick={() => this._orderColumn(0, "BP.D31_FINAL_VALIDITY_DATE")}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }} onClick={() => this._orderColumn(1, "BP.D31_FINAL_VALIDITY_DATE")}></i></span>,
        key: "finalValidityDate"
      },
      {
        title: "Estado del documento",
        key: "statusDocument"
      },
      {
        title: "",
        key: "commercialReport.isConfidential"
      },
      {
        title: "",
        key: "delete"
      },
    ]
  }

  _renderCellView(data) {
    const mensaje = "Señor usuario ¿está seguro que desea eliminar el informe de plan de negocio?";
    const { reducerGlobal } = this.props;
    var permissionsBussinessPlan = reducerGlobal.get('permissionsBussinessPlan');
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
          "entity": "BUSINESS_PLAN",
          "id": value.id
        }
      }
      _.set(value, 'actionsRedirect', {
        actionView: true,
        id: value.id,
        typeClickDetail: MODULE_BUSINESS_PLAN,
        ownerDraft: value.idStatusDocument,
        urlRedirect: "/dashboard/businessPlanEdit",
        component: "VIEW_BUSINESS_PLAN"
      });
      var dateBusinessInitialPlanStartFormat = "";
      if (moment(value.initialValidityDate, ['DD MMM YYYY'], 'es', true).isValid()) {
        dateBusinessInitialPlanStartFormat = value.initialValidityDate;
      } else {
        dateBusinessInitialPlanStartFormat = moment(value.initialValidityDate).locale('es').format('DD MMM YYYY');
      }

      var dateBusinessFinalPlanStartFormat = "";
      if (moment(value.finalValidityDate, ['DD MMM YYYY'], 'es', true).isValid()) {
        dateBusinessFinalPlanStartFormat = value.finalValidityDate;
      } else {
        dateBusinessFinalPlanStartFormat = moment(value.finalValidityDate).locale('es').format('DD MMM YYYY');
      }

      _.set(value, 'initialValidityDate', dateBusinessInitialPlanStartFormat);
      _.set(value, 'finalValidityDate', dateBusinessFinalPlanStartFormat);

      if (_.get(permissionsBussinessPlan, _.indexOf(permissionsBussinessPlan, ELIMINAR), false)) {
        if (value.idStatusDocument === 0) {
          _.set(value, 'delete', {
            actionDelete: true,
            urlServer: "/deleteEntity",
            typeDelete: DELETE_TYPE_BUSINESS_PLAN,
            mensaje: mensaje,
            json: json1
          });
        }
      }
    });
  }

  render() {
    const modalTitle = 'Plan de negocios Detalle';
    const { businessPlanReducer } = this.props;
    const data = businessPlanReducer.get('businessPlanList');
    return (
      <div className="horizontal-scroll-wrapper" style={{ overflow: 'scroll' }}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    businessPlanByClientFindServer, orderColumnBusinessPlan, clearBusinessPlanOrder, clearBusinessPlanPaginator
  }, dispatch);
}

function mapStateToProps({ businessPlanReducer, reducerGlobal }, ownerProps) {
  return {
    businessPlanReducer,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListBusinessPlanComponent);