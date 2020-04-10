import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  TITLE_IMPORTANT_DATES,
  TITLE_TAB_DATES,
  STYLE_CONTAINER_TABS,
  TITLE_STRATEGIC_CONTACTS,
  TITLE_TACTIC_CONTACTS,
  TITLE_OPERATIVE_CONTACTS
} from "./constants";
import TabComponent from "../../../../ui/Tab";
import { getImportantDates } from "../../actions";
import "../../../../../styles/importantDates/main.scss";
import StrategicSection from "./strategicSection";

class SectionImportantDates extends Component {

  async componentDidMount() {
      await Promise.all([
        this.handleImportantDates()
      ])
  }

  handleImportantDates = () => {
      const { dispatchGetImportantDates } = this.props ;
      dispatchGetImportantDates("",0,0);
  }

  countImportantDates = () => {
    const { data  } = this.props;

    const tabs = [
      {
        name: TITLE_TAB_DATES,
        className: "mainImportantDates",
        disable: false,
        number: data.length || 0,
        callback : () => this.handleImportantDates()
      }
    ];

    const subTabs = [
      {
        name: TITLE_STRATEGIC_CONTACTS,
        className: "importantDatesStyle",
        content: <StrategicSection />,
        disable: false,
        number: 0,
        callback: () => {}
      },
      {
        name: TITLE_TACTIC_CONTACTS,
        className: "importantDatesStyle",
        content: <div>Contáctos tácticos</div>,
        disable: false,
        number: 0,
        callback: () => {}
      },
      {
        name: TITLE_OPERATIVE_CONTACTS,
        className: "importantDatesStyle",
        content: <div>Contáctos operativos</div>,
        disable: false,
        number: 0,
        callback: () => {}
      }
    ];
    return (
      <div
        style={{ width : "48%", height : "100%"}}
      >
        <h3>{TITLE_IMPORTANT_DATES}</h3>
        <div style={STYLE_CONTAINER_TABS}>
          <TabComponent tabs={tabs} />
            <TabComponent tabs={subTabs} />
        </div>
      </div>
    );
  };

  render() {
    return this.countImportantDates();
  }
}

const mapStateToProps = ({ importantDates }) => ({
    data : importantDates.rows
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      dispatchGetImportantDates: getImportantDates
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionImportantDates);
