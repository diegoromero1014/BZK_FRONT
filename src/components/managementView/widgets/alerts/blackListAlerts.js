import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { blackListAlerts } from '../../../alertBlackList/actions';
import Table from "../../../table";
import TableBuilder from "../../../table/TableBuilder";
import { COLUMNS_BLACK_LIST_ALERTS, MAX_ROWS } from './constants';
import { redirectUrl } from "../../../globalComponents/actions";
import { Button } from 'semantic-ui-react';

export class BlackListAlertsComponent extends Component {

    handleOnPageChange = page => {
        const { dispatchBlackListAlerts } = this.props;
        
        dispatchBlackListAlerts((page - 1), MAX_ROWS);
    }

    render() {
        const { data, total } = this.props;

        return (
            <div>
                <Table
                    tableSettings={
                        new TableBuilder(data, COLUMNS_BLACK_LIST_ALERTS)
                            .setNoRowMessage("Aún no se han creado registros.")
                            .setRecordsPerPage(MAX_ROWS)
                            .setStriped(true)
                            .setTotalRecords(total)
                            .setOnPageChange(this.handleOnPageChange)
                            .build()
                    }
                />
                <Button
                    fluid
                    style={{ background: 'transparent' }}
                    onClick={() => redirectUrl("/dashboard/alertBlackList")}
                >
                    Ver detalle
                </Button>
            </div>
        );
    }
}

const mapStateToProps = ({ alertBlackList }) => ({
    alertBlackList,
    data: alertBlackList.get('responseBlackList'),
    total: alertBlackList.get('totalBlackListFiltered')
});

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchBlackListAlerts: blackListAlerts
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BlackListAlertsComponent);