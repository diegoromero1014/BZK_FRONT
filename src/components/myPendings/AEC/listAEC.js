import React, { Component, PropTypes } from 'react';
import { shorterStringValue } from '../../../actionsGlobal';
import GridComponent from '../../grid/component';
import { VIEW_AEC_PENDING } from '../../modal/constants';

class listAEC extends Component {

  constructor(props) {
    super(props);
    this.state = {
      actions: {},
      modalIsOpen: false
    };
    
    this.closeModal = this.closeModal.bind(this);
    this._renderHeaders = this._renderHeaders.bind(this);
    this._renderCellView = this._renderCellView.bind(this);
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
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

export default listAEC;
