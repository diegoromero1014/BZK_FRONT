import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  TITLE_IMPORTANT_DATES,
  TITLE_TAB_DATES,
  STYLE_CONTAINER_TABS,
  ACTION_IMPORTANT_DATES
} from "./constants";
import TabComponent from "../../../../ui/Tab";
import { getImportantDates } from "./actions";
import "../../../../../styles/importantDates/main.scss";
import SubTabsBirthdays from './subTabsBirthdays';

class SectionImportantDates extends Component {

  async componentDidMount() {
      await Promise.all([
        this.handleImportantDates()
      ])
  }

  handleImportantDates = () => {
      const { dispatchGetImportantDates } = this.props ;
      dispatchGetImportantDates(ACTION_IMPORTANT_DATES, "", 0, 0);
  }

  main = () => {
    const { all } = this.props;

    const tabs = [
      {
        name: TITLE_TAB_DATES,
        className: "mainImportantDates",
        content: <SubTabsBirthdays />,
        disable: false,
        number: all || 0,
        callback : () => this.handleImportantDates()
      }
    ];
    
    return (
      <div style={{ width : "48%", height : "100%"}}>
        <h3>{TITLE_IMPORTANT_DATES}</h3>
        <div style={STYLE_CONTAINER_TABS}>
          <TabComponent tabs={tabs} />
        </div>
      </div>
    );
  };

  render() {
    return this.main();
  }
}

const mapStateToProps = ({ importantDates }) => ({
    all: importantDates.allRecords
})

const mapDispatchToProps = dispatch => bindActionCreators({
  dispatchGetImportantDates: getImportantDates
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SectionImportantDates);
