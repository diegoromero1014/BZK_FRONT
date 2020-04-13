import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import TabComponent from "../../../../../ui/Tab";
import StrategicSection from "./strategicSection";
import TacticSection from "./tacticSection";
import OperativeSection from "./operativeSection";

import { getImportantDates } from "../actions";

import {
  TITLE_STRATEGIC_CONTACTS,
  TITLE_TACTIC_CONTACTS,
  TITLE_OPERATIVE_CONTACTS,
  STRATEGIC_CONTACTS,
  TACTIC_CONTACTS,
  OPERATIVE_CONTACTS,
  ACTION_STRATEGIC_CONTACTS,
  ACTION_TACTIC_CONTACTS,
  ACTION_OPERATIVE_CONTACTS,
  MAX_ROWS
} from "./constants";

import "../../../../../../styles/importantDates/main.scss";

export class SubTabsBirthdays extends Component {

  async componentDidMount() {
      await Promise.all([
        this.handleStrategicContacts(),
        this.handleTacticContacts(),
        this.handleOperativeContacts()
      ])
  }

  handleStrategicContacts = async () => {
      const { dispatchGetImportantDates } = this.props ;
      dispatchGetImportantDates(ACTION_STRATEGIC_CONTACTS, STRATEGIC_CONTACTS, 0, MAX_ROWS);
  }

  handleTacticContacts = () => {
      const { dispatchGetImportantDates } = this.props ;
      dispatchGetImportantDates(ACTION_TACTIC_CONTACTS, TACTIC_CONTACTS, 0, MAX_ROWS);
  }

  handleOperativeContacts = () => {
      const { dispatchGetImportantDates } = this.props ;
      dispatchGetImportantDates(ACTION_OPERATIVE_CONTACTS, OPERATIVE_CONTACTS, 0, MAX_ROWS);
  }

  countImportantDates = () => {
    const { strategics, tactics, operatives } = this.props;

    const tabs = [
      {
        name: TITLE_STRATEGIC_CONTACTS,
        className: "importantDatesStyle",
        content: <StrategicSection />,
        disable: false,
        callback: () => this.handleStrategicContacts()
      },
      {
        name: TITLE_TACTIC_CONTACTS,
        className: "importantDatesStyle",
        content: <TacticSection />,
        disable: false,
        callback: () => this.handleTacticContacts()
      },
      {
        name: TITLE_OPERATIVE_CONTACTS,
        className: "importantDatesStyle",
        content: <OperativeSection />,
        disable: false,
        callback: () => this.handleOperativeContacts()
      }
    ];
    return (
      <div>
        <TabComponent tabs={tabs} />
      </div>
    );
  };

  render() {
    return this.countImportantDates();
  }
}

const mapStateToProps = ({ importantDates }) => ({
    strategics: importantDates.strategics.rowCount,
    tactics: importantDates.tactics.rowCount,
    operatives: importantDates.operatives.rowCount,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  dispatchGetImportantDates: getImportantDates
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SubTabsBirthdays);
