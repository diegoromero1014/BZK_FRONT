import React, { Component } from "react";
import { connect } from "react-redux";
import Tooltip from "../../../toolTip/toolTipComponent";
import { redirectCreatePropspect } from "./utils";
import { clientsFindServer } from "../../../clients/actions";
import { PLACEHOLDER_SEARCH_CLIENT, MESSAGE_TOOLTIP, TITLE_SEARCH_CLIENT } from "./constants";
import { bindActionCreators } from "redux";
import { swtShowMessage } from '../../../sweetAlertMessages/actions';

class searchClient extends Component {
	constructor(props) {
		super(props);

		this.state = {
			keyword: "",
		};
	}

	handleInput = ({ target: { name, value } }) => this.setState({ [name]: value });

	handleKeyword = event => {
		if (event.keyCode === 13 || event.which === 13) {
			this.handleSearchClient();
		}
	};

	handleSearchClient = async () => {
		const { keyword } = this.state;
		const { dispatchClientsFindServer, dispatchSwtShowMessage, setKeyword, restartPage, handleSetSearched } = this.props;

		if (!keyword) {
			dispatchSwtShowMessage("error", "Error en la búsqueda", `Señor usuario, por favor ingrese un criterio de búsqueda.`);
		} else {
			await dispatchClientsFindServer(keyword, 0, 10);
			setKeyword(keyword);
		}

		restartPage();
		handleSetSearched(true);
	};

	render() {
		const { keyword } = this.state;

		return (
			<div style={{ width: "100%", display: "flex", justifyContent: "space-between" , marginBottom: "40px"}} >
				<div style={{ width: "70%" }}>
					<input
						className="input-lg input InputAddOn-field"
						name="keyword"
						type="text"
						autoComplete="off"
						style={{ padding: "0px 11px !important", width: "80%" }}
						placeholder={PLACEHOLDER_SEARCH_CLIENT}
						onChange={this.handleInput}
						onKeyPress={this.handleKeyword}
						value={keyword}
					/>
					<Tooltip text={TITLE_SEARCH_CLIENT}>
						<button
							id="searchClients"
							className="btn"
							style={{ backgroundColor: "#E0E2E2" }}
							title={TITLE_SEARCH_CLIENT}
							type="button"
							onClick={this.handleSearchClient}
						>
							<i className="search icon" style={{ margin: "0em", fontSize: "1.2em" }} />
						</button>
					</Tooltip>
				</div>
				<Tooltip text={MESSAGE_TOOLTIP}>
					<button
						type="button"
						className="btn btn-primary"
						onClick={redirectCreatePropspect}
					>
						<i
							className="add user icon"
							style={{ color: "white", margin: "0em", fontSize: "1.2em" }}
						></i>
					</button>
				</Tooltip>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => bindActionCreators({
	dispatchClientsFindServer: clientsFindServer,
	dispatchSwtShowMessage: swtShowMessage
}, dispatch);

export default connect(null, mapDispatchToProps)(searchClient);
