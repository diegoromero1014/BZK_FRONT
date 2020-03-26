import React, { Component } from "react";
import { connect } from "react-redux";
import Tooltip from "../../../toolTip/toolTipComponent";
import { redirectCreatePropspect } from "./utils";
import { clientsFindServer } from "../../../clients/actions";
import { PLACEHOLDER_SEARCH_CLIENT, MESSAGE_TOOLTIP, TITLE_SEARCH_CLIENT, STYLE_BUTTON_SEARCH, CLOSE_BUSQUEDA, STYLE_BUTTON_SEARCH_FOCUS} from "./constants";
import { bindActionCreators } from "redux";
import { swtShowMessage } from '../../../sweetAlertMessages/actions';

export class SearchClient extends Component {
	constructor(props) {
		super(props);

		this.state = {
            keyword: "",
			closeIcon : false,
			background : true 
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
            this.setState({
                closeIcon : true
            })
		}

		restartPage();
		handleSetSearched(true);
	};

    handleCloseButton = () => {
        const { handleSetSearched } = this.props;
        handleSetSearched(false)
        this.setState({
            keyword : "",
            closeIcon : false,
        })
    }

	render() {
        const { keyword, closeIcon, background} = this.state;
		const functionButton = closeIcon ? this.handleCloseButton : this.handleSearchClient ;
		const styleButton = !background ? STYLE_BUTTON_SEARCH_FOCUS : STYLE_BUTTON_SEARCH ;

		return (
			<div style={{ width: "100%", display: "flex", justifyContent: "space-between" , marginBottom: "40px"}} >
				<div style={{ width: "70%" }}>
					<input
						className="input-lg input InputAddOn-field"
						name="keyword"
						type="text"
						autoComplete="off"
						style={{ padding: "0px 11px !important", width: "80%"}}
						placeholder={PLACEHOLDER_SEARCH_CLIENT}
						onChange={this.handleInput}
						onKeyPress={this.handleKeyword}
						onFocus={() => this.setState({background : false})}
						onBlur={() => this.setState({background : true})}
						value={keyword}
					/>
					<Tooltip text={`${ closeIcon ? CLOSE_BUSQUEDA : TITLE_SEARCH_CLIENT }`}>
						<button
							id="searchClients"
							className="btn"
							style={styleButton}
							type="button"
							onClick={functionButton}
						>
							<i className={`${closeIcon ? 'times': 'search'} icon`} style={{ margin: "0em", fontSize: "1.5em" }} />
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

export default connect(null, mapDispatchToProps)(SearchClient);
