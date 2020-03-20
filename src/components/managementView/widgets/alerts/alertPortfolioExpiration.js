import React, { Component } from "react";
import { connect } from "react-redux";
import Table from "../../../table";
import { COLUMNS_VENCIMIENTO_CARTERA } from './constants';
import TableBuilder from "../../../table/TableBuilder";
import { bindActionCreators } from 'redux';
import { getAlertPortfolioExpirationDashboard } from '../../../alertPortfolioExpirtation/actions';
import { Button } from 'semantic-ui-react'
import { redirectUrl } from "../../../globalComponents/actions";

export class AlertPortfolioExpiration extends Component {

  componentDidMount() {
    this.forceUpdate();
  }

  render() {
    const { alertPortfolioExpiration, dispatchGetAlertPortfolioExpirationDashboard, total } = this.props;

    const data = alertPortfolioExpiration.get("responseClients");

    const tableSettings = new TableBuilder(data, COLUMNS_VENCIMIENTO_CARTERA)
      .setNoRowMessage("Aún no se han creado registros.")
      .setRecordsPerPage(5)
      .setStriped(true)
      .setTotalRecords(total)
      .setOnPageChange(async page => await dispatchGetAlertPortfolioExpirationDashboard(page))
      .build();

    return (
      <div>
        <Table tableSettings={tableSettings} />
        <Button
          fluid
          style={{ background: 'transparent' }}
          onClick={() => redirectUrl("/dashboard/alertClientsPortfolioExpiration")}
        >
          Ver detalle
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    dispatchGetAlertPortfolioExpirationDashboard: getAlertPortfolioExpirationDashboard
  }, dispatch)
};

const mapStateToProps = ({ alertPortfolioExpiration }) => {
  return {
    alertPortfolioExpiration
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertPortfolioExpiration);
