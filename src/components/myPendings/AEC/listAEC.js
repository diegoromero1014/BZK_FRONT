import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { DELETE_NEED_VIEW } from './constants';
import { deleteNeed } from './actions';
import SweetAlert from 'sweetalert-react';
import Modal from 'react-modal';
import _ from 'lodash';
import moment from 'moment';
import { shorterStringValue } from '../../../actionsGlobal';
import GridComponent from '../../grid/component';
import { VIEW_AEC_PENDING } from '../../modal/constants';

var arrayValueNeed = [];
var idNeedSeleted = null;

class listAEC extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showConfirmDeleteNeed: false,
      actions: {},
      modalIsOpen: false
    };
    this._mapValuesAEC = this._mapValuesAEC.bind(this);
    this._getValuesNeed = this._getValuesNeed.bind(this);
    this._deleteNeed = this._deleteNeed.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this._renderHeaders = this._renderHeaders.bind(this);
    this._renderCellView = this._renderCellView.bind(this);
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  _getValuesNeed() {
    var { needs } = this.props;
    if (needs.size > 0) {
      var data = _.chain(needs.toArray()).map(need => {
        const { uuid, needType, needIdType, needFormat, descriptionNeed, needProduct, needIdProduct, needImplementation,
          statusNeed, needIdImplementation, needTask, needBenefits, needIdResponsable, needResponsable, needDate, statusIdNeed } = need;
        var descripcionNecesidad = descriptionNeed.length > 120 ? descriptionNeed.substring(0, 120) + "..." : descriptionNeed;
        return _.assign({}, {
          'actions': {
            actionView: true,
            need: need,
            urlServer: "./component",
            component: "VIEW_NEED"
          },
          uuid: uuid, needType: needType, needIdType: needIdType, descriptionNeed: descriptionNeed,
          needProduct: needProduct, needIdProduct: needIdProduct, needImplementation: needImplementation,
          statusNeed: statusNeed, needIdImplementation: needIdImplementation, needTask: needTask, needBenefits: needBenefits,
          needIdResponsable: needIdResponsable, needResponsable: needResponsable, needDate: needDate, needFormat: needFormat,
          statusIdNeed: statusIdNeed,
          descripcionNecesidad: descripcionNecesidad,
          'delete': {
            typeDelete: DELETE_NEED_VIEW,
            id: uuid,
            mensaje: "¿Señor usuario, está seguro que desea eliminar la necesidad?"
          }
        });
      })
        .value();
      arrayValueNeed = data;
    } else {
      arrayValueNeed = [];
    }
  }

  _confirmDeleteNeed(idNeed) {
    idNeedSeleted = idNeed;
    this.setState({
      showConfirmDeleteNeed: true
    });
  }

  _deleteNeed() {
    const { deleteNeed, needs } = this.props;
    var indexDelete = needs.findIndex(function (item) {
      return item.uuid === idNeedSeleted;
    });
    deleteNeed(indexDelete);
    this.setState({
      showConfirmDeleteNeed: false
    });
    idNeedSeleted = null;
  }

  _viewDetailsNeed(needDetails) {
    var actions = {
      actionView: true,
      need: needDetails,
      urlServer: "./component",
      component: "VIEW_NEED"
    }
    this.setState({
      actions,
      modalIsOpen: true
    });
  }

  _mapValuesAEC(dataAEC, idx) {
    return <tr key={idx}>
      <td className="collapsing">
        <i className="zoom icon" title="Ver detalle"
          onClick={this._viewDetailsNeed.bind(this, dataAEC)}
          style={{ cursor: "pointer" }} />
      </td>
      <td>{dataAEC.numberClient}</td>
      <td>{dataAEC.nameClient}</td>
      <td>{shorterStringValue(dataAEC.actionPlan, 40)}</td>
    </tr>
  }

  _renderHeaders() {
    return [
      {
        title: "",
        key: "actions",
        width: '20px'
      },
      {
        title: "Número documento",
        key: "numberClient",
        width: '80px'
      },
      {
        title: "Nombre/Razón social",
        key: "nameClient",
        width: '80px'
      },
      {
        title: "Plan de acción",
        key: "actionPlan",
        width: '80px'
      }
    ]
  }

  _renderCellView(data = []) {
    const { reducerGlobal } = this.props;
    return data.map(item => ({
      actions: {
        actionView: true,
        aec: item,
        urlServer: "./component",
        component: VIEW_AEC_PENDING
      },
      numberClient: item.numberClient,
      nameClient: item.nameClient,
      actionPlan: shorterStringValue(item.actionPlan, 40),
    }));
  }

  render() {
    const { listAEC } = this.props;
    const modalTitle = 'Detalle AEC';
    return (
      <div className="horizontal-scroll-wrapper" style={{ overflow: 'scroll', overflowX: 'hidden' }}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(listAEC)} modalTitle={modalTitle} />
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteNeed
  }, dispatch);
}

function mapStateToProps({ needs }) {
  return {
    needs
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(listAEC);
