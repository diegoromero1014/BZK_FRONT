import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { covenantsAlerts } from '../../../alertCovenants/actions';
import Table from "../../../table";
import TableBuilder from "../../../table/TableBuilder";
import { COLUMNS_COVENANTS_ALERTS, MAX_ROWS } from './constants';

export class CovenantsAlertsComponent extends Component {

    handleOnPageChange = page => {
        const { dispatchCovenantsAlerts } = this.props;
        
        dispatchCovenantsAlerts(page, MAX_ROWS);
    }

    handleOnClick = data => {
        console.log(data);
    }

    render() {
        const { data, total } = this.props;

        return (
            <div>
                <Table
                    tableSettings={
                        new TableBuilder(data, COLUMNS_COVENANTS_ALERTS)
                            .setNoRowMessage("Aún no se han creado registros.")
                            .setRecordsPerPage(MAX_ROWS)
                            .setStriped(true)
                            .setTotalRecords(total)
                            .setOnPageChange(this.handleOnPageChange)
                            .setOnClick(this.handleOnClick)
                            .build()
                    }
                />
            </div>
        );
    }
}

const mapStateToProps = ({ alertCovenant }) => ({
    alertCovenant,
    data: alertCovenant.get('responseCovenants'),
    total: alertCovenant.get('totalCovenantsByFiltered')
});

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchCovenantsAlerts: covenantsAlerts
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CovenantsAlertsComponent);