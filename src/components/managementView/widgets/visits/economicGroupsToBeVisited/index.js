import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import Table from "../../../../table";
import TableBuilder from "../../../../table/TableBuilder";
import { COLUMNS_ECONOMIC_GROUPS_TO_BE_VISITED, MAX_ROWS } from '../constants';
import { getEconomicGroupsToBeVisited } from '../actions';
import { mapData } from './mapData';

export class EconomicGroupsToBeVisited extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
    }

    handleOnPageChange = async page => {
        const { dispatchGetEconomicGroupsToBeVisited } = this.props;
        await this.setState({ loading: true});
        await dispatchGetEconomicGroupsToBeVisited((page - 1), MAX_ROWS);
        await this.setState({ loading: false });
    }

    render() {
        const { data, total } = this.props;

        return (
            <div>
                <Table
                    tableSettings={
                        new TableBuilder(mapData(data), COLUMNS_ECONOMIC_GROUPS_TO_BE_VISITED)
                            .setNoRowMessage("No existen registros.")
                            .setRecordsPerPage(MAX_ROWS)
                            .setStriped(true)
                            .setTotalRecords(total)
                            .setOnPageChange(this.handleOnPageChange)
                            .setLoading(this.state.loading)
                            .setMaximumVisiblePages(7)
                            .build()
                    }
                />
            </div>
        );
    }
}

const mapStateToProps = ({ economicGroupsToBeVisited: { rows, rowCount } }) => ({
    data: rows,
    total: rowCount
});

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchGetEconomicGroupsToBeVisited: getEconomicGroupsToBeVisited
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EconomicGroupsToBeVisited);