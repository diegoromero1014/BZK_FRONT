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
import { NAME_FILTER_CLIENTS, NAME_FILTER_RELATION } from '../searchClient/constants';

export class BlackListAlertsComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        this.handleOnPageChange(1);
    }
   
    componentDidUpdate(prevProps) {
        if (prevProps.idFilter !== this.props.idFilter) {
            this.handleOnPageChange(1);
        }
    }

    handleOnPageChange = async page => {
        const { dispatchBlackListAlerts, idFilter, filterType } = this.props;
        const filterClient = filterType == NAME_FILTER_CLIENTS ? idFilter : null;
        const filterEconomicGroup = filterType == NAME_FILTER_RELATION ? idFilter : null;
        await this.setState({ loading: true });
        await dispatchBlackListAlerts((page - 1), MAX_ROWS, filterClient, filterEconomicGroup);
        await this.setState({ loading: false });
    }

    reditectToBlackListAlerts = () => {
        const { dispatchChangeActiveItemMenu } = this.props;
        dispatchChangeActiveItemMenu(MODULE_ALERTS);
        redirectUrl("/dashboard/alertBlackList");
    }

    render() {
        const { data, total } = this.props;
        const { loading } = this.state;

        return (
            <div>
                <Table
                    tableSettings={
                        new TableBuilder(data, COLUMNS_BLACK_LIST_ALERTS)
                            .setNoRowMessage("No existen registros.")
                            .setRecordsPerPage(MAX_ROWS)
                            .setStriped(true)
                            .setTotalRecords(total)
                            .setOnPageChange(this.handleOnPageChange)
                            .setLoading(loading)
                            .setMaximumVisiblePages(7)
                            .build()
                    }
                />
                <Button
                    fluid
                    style={{ background: 'transparent', color: '#00448c', fontSize: '16px' }}
                    onClick={this.reditectToBlackListAlerts}
                >
                    Ver detalle
                </Button>
            </div>
        );
    }
}

const mapStateToProps = ({ alertBlackList, filterDashboard: { id, criterio} }) => ({
    alertBlackList,
    data: alertBlackList.get('responseBlackList'),
    total: alertBlackList.get('totalBlackListFiltered'),
    idFilter: id,
    filterType: criterio
});

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchBlackListAlerts: blackListAlerts,
    dispatchChangeActiveItemMenu : changeActiveItemMenu
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BlackListAlertsComponent);