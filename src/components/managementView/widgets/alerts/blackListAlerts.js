import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { blackListAlerts } from '../../../alertBlackList/actions';
import Table from "../../../table";
import TableBuilder from "../../../table/TableBuilder";
import { COLUMNS_BLACK_LIST_ALERTS, MAX_ROWS } from './constants';
import { redirectUrl } from "../../../globalComponents/actions";
import { changeActiveItemMenu } from '../../../menu/actions';
import { Button } from 'semantic-ui-react';
import { MODULE_ALERTS } from '../../../../constantsGlobal';

export class BlackListAlertsComponent extends Component {

    handleOnPageChange = page => {
        const { dispatchBlackListAlerts } = this.props;
        
        dispatchBlackListAlerts((page - 1), MAX_ROWS);
    }

    reditectToBlackListAlerts = () => {
        const { dispatchChangeActiveItemMenu } = this.props;
        dispatchChangeActiveItemMenu(MODULE_ALERTS);
        redirectUrl("/dashboard/alertBlackList");
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
                    onClick={this.reditectToBlackListAlerts}
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
    dispatchBlackListAlerts: blackListAlerts,
    dispatchChangeActiveItemMenu : changeActiveItemMenu
    
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BlackListAlertsComponent);