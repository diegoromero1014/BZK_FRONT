import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import TabComponent from "../../../../ui/Tab";
import EconomicGroupsToBeVisited from './economicGroupsToBeVisited';

import {
    ECONOMIC_GROUPS_TO_BE_VISITED
} from "./constants";

import { getEconomicGroupsToBeVisited } from './actions';
import { MAX_ROWS } from './constants';

export class VisitsSection extends Component {

    async componentDidMount() {
        await Promise.all([
            this.handleDispatchGetEconomicGroupsToBeVisited()
        ]);
    }

    handleDispatchGetEconomicGroupsToBeVisited = async () => {
        const { dispatchGetEconomicGroupsToBeVisited } = this.props;
        return await dispatchGetEconomicGroupsToBeVisited(0, MAX_ROWS);
    }

    countVisits = () => {
        const { totalEconomicGroupsToBeVisited } = this.props;

        const tabs = [
            {
                name: ECONOMIC_GROUPS_TO_BE_VISITED,
                content: <EconomicGroupsToBeVisited />,
                disable: false,
                number: totalEconomicGroupsToBeVisited || 0,
                callback: this.handleDispatchGetEconomicGroupsToBeVisited
            }
        ];
        return (
            <div class="ui segment alert-content" style={{ padding: '0px !important' }}>
                <h3>VISITAS</h3>
                <div style={{
                    position: 'relative',
                    background: '#FFFFFF',
                    boxShadow: '0px 1px 2px 0 rgba(34, 36, 38, 0.15)',
                    margin: '1rem 0em',
                    padding: '0px !important',
                    borderRadius: '0.28571429rem',
                    border: '1px solid rgba(34, 36, 38, 0.15)'
                }}>
                    <TabComponent tabs={tabs} />
                </div>

            </div >
        );
    }

    render() {
        return this.countVisits();
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchGetEconomicGroupsToBeVisited: getEconomicGroupsToBeVisited
    }, dispatch)
};

const mapStateToProps = ({ economicGroupsToBeVisited }) => ({
    totalEconomicGroupsToBeVisited: economicGroupsToBeVisited.rowCount
});

export default connect(mapStateToProps, mapDispatchToProps)(VisitsSection);