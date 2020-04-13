import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TabComponent from "../../../../ui/Tab";
import PendingVisits from './pendingVisits';
import EconomicGroupsToBeVisited from './economicGroupsToBeVisited';

import {
    MAX_ROWS,
    ECONOMIC_GROUPS_TO_BE_VISITED,
    PENDING_VIEWS_TAB
} from "./constants";

import { getEconomicGroupsToBeVisited } from './actions';
import { requestPendingVisits } from './pendingVisits/actions';

import '../../../../../styles/board/widgets/visits/main.scss';

export class VisitsSection extends Component {

    async componentDidMount() {
        await Promise.all([
            this.handlePendingVisits(),
            this.handleDispatchGetEconomicGroupsToBeVisited()
        ]);
    }

    handlePendingVisits = () => {
        const { dispatchRequestPendingVisits } = this.props;
        dispatchRequestPendingVisits(0, MAX_ROWS);
    }

    handleDispatchGetEconomicGroupsToBeVisited = async () => {
        const { dispatchGetEconomicGroupsToBeVisited } = this.props;
        return await dispatchGetEconomicGroupsToBeVisited(0, MAX_ROWS);
    }

    countVisits = () => {
        const { pendingVisits: { rowCount }, totalEconomicGroupsToBeVisited } = this.props;

        const tabs = [
            {
                name: ECONOMIC_GROUPS_TO_BE_VISITED,
                content: <EconomicGroupsToBeVisited />,
                disable: false,
                className: 'economic-groups-tab',
                number: totalEconomicGroupsToBeVisited || 0,
                callback: this.handleDispatchGetEconomicGroupsToBeVisited
            },
            {
                name: PENDING_VIEWS_TAB,
                content: <PendingVisits />,
                disable: false,
                className: 'economic-groups-tab',
                number: rowCount || 0,
                callback: () => this.handlePendingVisits
            }
        ];
        return (
            <div className="ui segment alert-content" style={{ padding: '0px !important' }}>
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

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchRequestPendingVisits: requestPendingVisits,
    dispatchGetEconomicGroupsToBeVisited: getEconomicGroupsToBeVisited
}, dispatch)

const mapStateToProps = ({ pendingVisits, economicGroupsToBeVisited }) => ({
    pendingVisits,
    totalEconomicGroupsToBeVisited: economicGroupsToBeVisited.rowCount
})

export default connect(mapStateToProps, mapDispatchToProps)(VisitsSection);