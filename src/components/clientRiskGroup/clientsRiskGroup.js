import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import { reduxForm } from 'redux-form';
import SweetAlert from 'sweetalert-react';
import { } from './actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { validateResponse } from '../../actionsGlobal';
import { MESSAGE_SAVE_DATA } from '../../constantsGlobal';

class clientsRiskGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmDelete: false
    };
  }

  render() {
    const { dataName, dataDocumentType, dataDocument, key } = this.props;
    return (
      <div key={key} className="client-card" style={{ width: "100%", marginBottom:"15px", cursor: 'auto', height: "auto" }}>
        <div className="celula-card-top" style={{ height: "auto" }}>
          <div className="celula-card-top-left">
            <div className="celula-title">{dataName.length > 60 ? dataName.substring(0, 60) + "..." : dataName}</div>
            <div className="celula-name">{dataDocumentType}: {dataDocument.length > 20 ? dataDocument.substring(0, 20) + "..." : dataDocument}</div>
          </div>
        </div>
        <div className="celula-card-bottom" style={{ backgroundColor: "#B0E0E6" }}>
          <i className="trash outline icon delete-tab" style={{ marginTop: "-14px", fontSize: '13pt' }}
            onClick={() => this.setState({ showConfirmDelete: true })}
            title="Eliminar cliente del grupo económico" />
        </div>

        <SweetAlert
          type="warning"
          show={this.state.showConfirmDelete}
          title="Grupo económico"
          confirmButtonColor='#2671d7'
          confirmButtonText='Sí'
          cancelButtonText="No"
          text="¿Señor usuario, está seguro que desea eliminar el cliente del grupo económico?"
          showCancelButton={true}
          onCancel={() => this.setState({ showConfirmDelete: false })}
          onConfirm={() => console.log("removing")} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    swtShowMessage
  }, dispatch);
}

function mapStateToProps({ riskGroupReducer }, ownerProps) {
  return {
    riskGroupReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(clientsRiskGroup);