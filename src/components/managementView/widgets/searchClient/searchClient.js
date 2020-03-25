import React, { Component } from "react";
import { connect } from "react-redux";
import noop from "lodash";
import Tooltip from "../../../toolTip/toolTipComponent";
import SweetAlert from "../../../sweetalertFocus";
import { redirectCreatePropspect } from "./utils";
import { clientsFindServer } from "../../../clients/actions";
import { PLACEHOLDER_SEARCH_CLIENT, MESSAGE_TOOLTIP, TITLE_SEARCH_CLIENT, STYLE_ICON_PROSPECT } from "./constants";
import { bindActionCreators } from "redux";

class searchClient extends Component {
  state = {
    keyword: "",
    swError: false,
    clients: [],
    rowCount: 0,
    page : 0
  };

  handleInput = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleKeyword = event => {
    if (event.keyCode === 13 || event.which === 13) {
      this.handelSearchClient();
    }
  };

  handleSearchClient = async () => {
    const { keyword } = this.state;
    const {  dispatchClientsFindServer, saveData } = this.props;

    if (!keyword) {
      this.setState({
        swError: true
      });
    } else {
      const { payload } = await dispatchClientsFindServer(keyword, 0, 10);
      const { rows, rowCount } = payload.data.data;
      const newRows = rows.map(element => {
          if(element.prospect){
              element.prospect =  <div className="prospect" style={STYLE_ICON_PROSPECT}>P</div> 
          }else{
              element.prospect = " "
          }
          return element
      })
      this.setState({
        clients: newRows,
        rowCount,
        page : 0
      });
      saveData(this.state);
    }

    this.setState({
        keyword : ""
    })
  };

  render() {
    const { swError , keyword} = this.state;

    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div style={{ width: "70%" }}>
          <input
            className="input-lg input InputAddOn-field"
            name="keyword"
            type="text"
            autoComplete="off"
            style={{ padding: "0px 11px !important", width: "80%" }}
            placeholder={PLACEHOLDER_SEARCH_CLIENT}
            onChange={event => this.handleInput(event)}
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
                <i
                className="search icon"
                style={{ margin: "0em", fontSize: "1.2em" }}
                />
            </button>
          </Tooltip>
        </div>
        <Tooltip text={MESSAGE_TOOLTIP}>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginRight : "30px"}}
            onClick={redirectCreatePropspect}
          >
            <i
              className="add user icon"
              style={{ color: "white", margin: "0em", fontSize: "1.2em" }}
            ></i>
          </button>
        </Tooltip>
        <SweetAlert
          type="error"
          show={swError}
          title="Error de búsqueda"
          text="Señor usuario, por favor ingrese un criterio de búsqueda."
          onConfirm={() => this.setState({ swError: false })}
        />
      </div>
    );
  }
}

const mapStateToProps = noop;

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      dispatchClientsFindServer: clientsFindServer
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(searchClient);
