import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
	COLUMNS_PENDING_VISITS, 
	MESSAGE_NO_RESULTS_VISITS, 
	MAX_ROWS 
} from '../constants';
import { bindActionCreators } from 'redux';
import TableBuilder from "../../../../table/TableBuilder";
import TableComponent from "../../../../table";
import { requestPendingVisits } from '../pendingVisits/actions';
import { redirectUrl } from "../../../../globalComponents/actions";
import { changeActiveItemMenu } from '../../../../menu/actions';
import { updateTitleNavBar } from '../../../../navBar/actions';
import { consultInfoClient } from '../../../../clientInformation/actions';
import { MODULE_MY_CLIENTS, MODULE_PREVISIT_REPORT } from "../../../../../constantsGlobal";

export class PendingVisits extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false
		}
	}

	currentPage = async (page) => {
		const { dispatchRequestPendingVisits } = this.props;
		await this.setState({ loading: true });
		await dispatchRequestPendingVisits((page - 1), MAX_ROWS);
		await this.setState({ loading: false });
	}

	handelClickClient = async element => {
		const { previsitId, previsitClientId } = element;
		const { dispatchChangeActiveItemMenu, dispatchUpdateTitleNavBar, dispatchConsultInfoClient } = this.props;
		dispatchChangeActiveItemMenu(MODULE_MY_CLIENTS);
		await dispatchConsultInfoClient(previsitClientId);
		dispatchUpdateTitleNavBar(MODULE_PREVISIT_REPORT);
		redirectUrl(`/dashboard/previsita/${previsitId}`);
	}

	render() {
		const { data, totalRecords } = this.props;

		return (
			<div>
				<TableComponent tableSettings={
					new TableBuilder(data, COLUMNS_PENDING_VISITS)
						.setNoRowMessage(MESSAGE_NO_RESULTS_VISITS)
						.setRecordsPerPage(MAX_ROWS)
						.setStriped(true)
						.setOnClick(this.handelClickClient)
						.setTotalRecords(totalRecords)
						.setOnPageChange(this.currentPage)
						.setLoading(this.state.loading)
						.setMaximumVisiblePages(7)
						.build()
				}
				/>
			</div>
		)
	}
}

const mapStateToProps = ({ pendingVisits }) => ({
	data: pendingVisits.rows,
	totalRecords: pendingVisits.rowCount
});

const mapDispatchToProps = dispatch => bindActionCreators({
	dispatchRequestPendingVisits: requestPendingVisits,
	dispatchChangeActiveItemMenu: changeActiveItemMenu,
	dispatchUpdateTitleNavBar: updateTitleNavBar,
	dispatchConsultInfoClient: consultInfoClient
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PendingVisits);