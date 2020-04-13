import React, { Component } from "react";
import { connect } from "react-redux";
import Table from "../../../../table";
import TableBuilder from "../../../../table/TableBuilder";
import { bindActionCreators } from "redux";
import { getImportantDates } from "../actions";
import {
  COLUMNS_CONTACTS,
  MAX_ROWS,
  STRATEGIC_CONTACTS,
  ACTION_STRATEGIC_CONTACTS
} from "./constants";
import "../../../../../../styles/importantDates/main.scss";
import { mapData } from "./mapData";

export class StrategicSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  setLoading = async loading => await this.setState({ loading });

  handleOnPageChange = async page => {
    const { dispatchGetImportantDates } = this.props;
    this.setLoading(true);
    await dispatchGetImportantDates(
      ACTION_STRATEGIC_CONTACTS,
      STRATEGIC_CONTACTS,
      page - 1,
      MAX_ROWS
    );
    this.setLoading(false);
  };

  render() {
    const { data, total } = this.props;

    const tableSettings = new TableBuilder(mapData(data), COLUMNS_CONTACTS)
      .setNoRowMessage("No existen registros.")
      .setRecordsPerPage(5)
      .setStriped(true)
      .setTotalRecords(total || 0)
      .setOnPageChange(this.handleOnPageChange)
      .setLoading(this.state.loading)
      .build();

    return (
      <div
        style={{
          overflowY: "auto",
          height: "400px",
          maxHeight: "400px",
          paddingBottom: "20px"
        }}
      >
        <Table tableSettings={tableSettings} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      dispatchGetImportantDates: getImportantDates
    },
    dispatch
  );

const mapStateToProps = ({ importantDates }) => ({
  data: importantDates.strategics.rows,
  total: importantDates.strategics.rowCount
});

export default connect(mapStateToProps, mapDispatchToProps)(StrategicSection);
