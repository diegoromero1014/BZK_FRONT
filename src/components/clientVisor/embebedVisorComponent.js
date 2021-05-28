import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Modal from "react-modal";
import { consultParameterServer } from "../../actionsGlobal";
import { GREEN_COLOR } from "../../constantsGlobal";
import {
  URL_VISOR_PARAMETER,
  URL_VISOR_DOCUMENT_PARAMETER,
  URL_VISOR_DOCUMENT_TYPE_PARAMETER,
} from "./constants";
import {
  nombreflujoAnalytics,
  BIZTRACK_MY_CLIENTS,
  _CLIENT_VISOR,
} from "../../constantsAnalytics";
import {
  executeFunctionIfInternetExplorer,
  showSweetAlertErrorMessage,
} from "../../utils/browserValidation";
import { swtShowMessage } from "../sweetAlertMessages/actions";

class EmbebedClientVisorComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      visor_url: "",
    };
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  openModal() {
    this.setState({
      modalIsOpen: true,
    });
    window.dataLayer.push({
      nombreflujo: nombreflujoAnalytics,
      event: BIZTRACK_MY_CLIENTS + _CLIENT_VISOR,
      pagina: _CLIENT_VISOR,
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  componentWillMount() {
    const { consultParameterServer } = this.props;

    consultParameterServer(URL_VISOR_PARAMETER).then((data) => {
      if (
        data.payload.data.data !== null &&
        data.payload.data.data !== "" &&
        data.payload.data.data !== undefined
      ) {
        let parameter = data.payload.data.data.value;

        this.setState({
          visor_url: parameter,
        });
      }
    });
  }
  render() {
    const { clientdIdNumber, clientNameType, swtShowMessage } = this.props;
    return (
      <div
      className="tab-pane quickZoomIn animated"
                style={{ width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px", height: "100vh" }}
             >
        {
            <iframe
              style={{ width: "100%", border: "0", flexGrow: "1", height:"97%" }}
              src={this.state.visor_url
                .replace(URL_VISOR_DOCUMENT_PARAMETER, clientdIdNumber)
                .replace(URL_VISOR_DOCUMENT_TYPE_PARAMETER, clientNameType)}
            ></iframe>
          }
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      consultParameterServer,
      swtShowMessage,
    },
    dispatch
  );
}

function mapStateToProps({ clientInformacion }, ownerProps) {
  return {
    clientInformacion,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmbebedClientVisorComponent);
