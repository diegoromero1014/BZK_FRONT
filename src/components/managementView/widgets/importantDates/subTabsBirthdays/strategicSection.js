import React, { Component } from "react";
import { connect } from "react-redux";
import Table from "../../../../table";
import TableBuilder from "../../../../table/TableBuilder";
import { bindActionCreators } from 'redux';
import { getImportantDates } from '../actions';
import { 
    COLUMNS_CONTACTS, 
    MAX_ROWS,
    STRATEGIC_CONTACTS, 
    ACTION_STRATEGIC_CONTACTS, 
} from "./constants";
import "../../../../../../styles/importantDates/main.scss";
import { mapData } from "./mapData";

export class StrategicSection extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
    }

    setLoading = async loading => await this.setState({ loading })

    handleOnPageChange = async page => {
        const { dispatchGetImportantDates } = this.props;
        this.setLoading(true);
        await dispatchGetImportantDates(ACTION_STRATEGIC_CONTACTS, STRATEGIC_CONTACTS, page, MAX_ROWS);
        this.setLoading(false);
    }

    render() {
        const { data } = this.props;
 
        const tableSettings = new TableBuilder(mapData(data), COLUMNS_CONTACTS)
            .setNoRowMessage("No existen registros.")
            .setRecordsPerPage(5)
            .setStriped(true)
            .setTotalRecords(data.length)
            .setOnPageChange(this.handleOnPageChange)
            .setLoading(this.state.loading)
            .setMaximumVisiblePages(7)
            .build();

        return (
            <div>
                <Table tableSettings={tableSettings} />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchGetImportantDates: getImportantDates
}, dispatch);

const mapStateToProps = ({ importantDates }) => ({
    data: importantDates.strategics
})


export default connect(mapStateToProps, mapDispatchToProps)(StrategicSection);
