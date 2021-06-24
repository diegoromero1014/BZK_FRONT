import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {  consultURLServer } from "../../actionsGlobal";

class EmbebedClientVisorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visor_url: "",
    };
  }
  componentWillMount() {
    const { consultURLServer, infoClient } = this.props;

    const paramenters = {
      clientNameType: infoClient.clientNameType,
      clientdIdNumber: infoClient.clientIdNumber,
    };
    consultURLServer(paramenters).then(data => {
      if (
        data.payload.data.data !== null &&
        data.payload.data.data !== "" &&
        data.payload.data.data !== undefined
      ) {
        const parameter = data.payload.data.data.value;
        this.setState({
          visor_url: parameter,
        });
      }
    });
  }
  render() {
    return (
      <div
        className="tab-pane quickZoomIn animated"
        style={{
          width: "100%",
          marginTop: "10px",
          marginBottom: "70px",
          paddingTop: "0px",
          height: "100vh",
        }}
      >
        {
          <iframe
            style={{ width: "100%", border: "0", flexGrow: "1", height: "100%" }}
            src={this.state.visor_url}
          ></iframe>
        }
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      consultURLServer,
    },
    dispatch
  );
}

function mapStateToProps({ clientInformacion }) {
  return {
    clientInformacion,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmbebedClientVisorComponent);
