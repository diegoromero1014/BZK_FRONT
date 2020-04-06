import React, { Component, PropTypes } from 'react';
import { redirectUrl } from '../globalComponents/actions';
import SweetAlert from '../sweetalertFocus';
import { MODULE_CUSTOMER_STORY } from '../../constantsGlobal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateTabSeleted } from '../clientDetailsInfo/actions';
import {
  TAB_CUSTOMER_STORY, MESSAGE_LOAD_DATA, TITLE_ERROR_SWEET_ALERT,
  MESSAGE_ERROR_SWEET_ALERT
} from '../../constantsGlobal';
import Tooltip from '../toolTip/toolTipComponent';
import { deleteRecentClient, getRecentClients } from './actions';
import { changeStateSaveData } from '../main/actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { validateResponse, shorterStringValue } from '../../actionsGlobal';
import { MAX_LENGTH_NAME_CLIENT, MAX_LENGTH_DOCUMENT, MAX_LENGTH_ECONOMIC_GROUP } from './constants';

class ClientListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEr: false
    }
    this._handleClickClientItem = this._handleClickClientItem.bind(this);
    this._deleteRecentClient = this._deleteRecentClient.bind(this);
    this._closeError = this._closeError.bind(this);
  }

  _handleClickClientItem(e) {
    const { navBar, dataId, dataIsAccess, dataDeleveryClient } = this.props;
    if (dataIsAccess) {
      window.sessionStorage.setItem('idClientSelected', dataId);
      redirectUrl("/dashboard/clientInformation");
    } else {
      if (_.get(navBar.get('mapModulesAccess'), MODULE_CUSTOMER_STORY) && dataDeleveryClient) {
        window.sessionStorage.setItem('idClientSelected', dataId);
        const { updateTabSeleted } = this.props;
        updateTabSeleted(TAB_CUSTOMER_STORY);
        redirectUrl("/dashboard/clientInformation");
      } else {
        this.setState({ showEr: true });
      }
    }
  }

  _closeError() {
    this.setState({ showEr: false });
  }

  _deleteRecentClient() {
    const { deleteRecentClient, swtShowMessage, dataId, getRecentClients } = this.props;
    changeStateSaveData(true, MESSAGE_LOAD_DATA);
    deleteRecentClient(dataId).then((data) => {
      changeStateSaveData(false, "");
      if (!validateResponse(data)) {
        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
      } else {
        getRecentClients().then((data) => {
          changeStateSaveData(false, "");
          if (!validateResponse(data)) {
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
          }
        });
      }
    });
  }

  render() {
    const { dataId, dataName, dataDocumentType, dataDocument, dataAccountManager, dataEconomicGroup,
      dataIsProspect, dataIsAccess, dataDeleveryClient, navBar, clientR } = this.props;
    return (
      <div>
        <div className="client-card" style={{ float: "left" }}>
          <div className="celula-card-top" onClick={this._handleClickClientItem}>
            <div className="celula-card-top-left">
              <div className="celula-title">{shorterStringValue(dataName, MAX_LENGTH_NAME_CLIENT)}</div>
              <div className="celula-name">{dataDocumentType}: {shorterStringValue(dataDocument, MAX_LENGTH_DOCUMENT)}</div>
              <div className="celula-title">{shorterStringValue(dataEconomicGroup, MAX_LENGTH_ECONOMIC_GROUP)}</div>
              <div className="celula-name" style={{ marginTop: "5px", fontStyle: "italic" }}>{dataAccountManager}</div>
            </div>
          </div>
          <div className="celula-card-bottom"
            style={{
              backgroundColor: dataIsAccess ? "#B0E0E6" : _.get(navBar.get('mapModulesAccess'), MODULE_CUSTOMER_STORY) && dataDeleveryClient ? "#FAB87D" : "#DCDCDC",
              cursor: "initial"
            }}>
            {dataIsAccess ?
              <i className="chevron circle right icon blue" style={{ marginTop: "-15px", cursor: "pointer" }}
                onClick={this._handleClickClientItem} />
              :
              _.get(navBar.get('mapModulesAccess'), MODULE_CUSTOMER_STORY) && dataDeleveryClient ?
                <i className="chevron circle right icon orange" style={{ marginTop: "-15px", cursor: "pointer" }} /> : ''
            }
            {clientR.get('showingRecentClients') &&
              <Tooltip text="Quitar de recientes">
                <i className="delete icon" style={{ marginTop: "-1px", float: "right", color: "#616060", cursor: "pointer" }}
                  onClick={this._deleteRecentClient} />
              </Tooltip>
            }
          </div>
          {dataIsProspect &&
            <div className="prospect-corner prospect badge badge-important animated bounceIn" style={{ borderRadius: "10px" }}>P</div>
          }
        </div>
        <SweetAlert
          type="warning"
          show={this.state.showEr}
          title="Acceso denegado"
          text="Señor usuario, usted no cuenta con los permisos para visualizar este cliente."
          onConfirm={() => this._closeError()}
        />
      </div>
    )
  }
}

ClientListItem.PropTypes = {
  dataId: PropTypes.string.isRequired,
  dataName: PropTypes.string.isRequired,
  dataDocumentType: PropTypes.string.isRequired,
  dataDocument: PropTypes.string.isRequired,
  dataAccountManager: PropTypes.string.isRequired,
  dataEconomicGroup: PropTypes.string.isRequired,
  dataIsProspect: PropTypes.bool.isRequired,
  dataIsAccess: PropTypes.bool.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateTabSeleted,
    deleteRecentClient,
    swtShowMessage,
    getRecentClients
  }, dispatch);
}

function mapStateToProps({ navBar, clientR }, ownerProps) {
  return {
    navBar,
    clientR
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientListItem);
