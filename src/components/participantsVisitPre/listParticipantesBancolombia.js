import React, { Component, PropTypes } from 'react';
import GridComponent from '../grid/component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DELETE_PARTICIPANT_VIEW, KEY_PARTICIPANT_BANCO } from './constants';
import { deleteParticipant } from './actions';
import SweetAlert from '../sweetalertFocus';
import _ from 'lodash';


class ListParticipantesBancolombia extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showConfirmDeleteParticiBanc: false,
      idParticipantSelect: null
    };
    this._mapValuesData = this._mapValuesData.bind(this);
    this._clickButtonDelete = this._clickButtonDelete.bind(this);
  }



  _confirmDeleteParticipant(idData) {
    this.setState({
      showConfirmDeleteParticiBanc: true,
      idParticipantSelect: idData
    });
  }

  _clickButtonDelete(idData) {
    const { participants, deleteParticipant } = this.props;
    var indexDelete = participants.findIndex(item => {
      return item.idParticipante === this.state.idParticipantSelect;
    });
    this.setState({
      showConfirmDeleteParticiBanc: false,
      idParticipantSelect: null
    });
    deleteParticipant(indexDelete, KEY_PARTICIPANT_BANCO);
  }

  _mapValuesData(userData, idx) {
    var { disabled } = this.props;
    return <div className="item" key={idx}>
      <span style={{ paddingRight: '10px', fontWeight: 'bold', color: 'black' }} >{userData.name}</span>
      {userData.cargo} {userData.empresa}
      <i className="remove icon"
        onClick={this._confirmDeleteParticipant.bind(this, userData.id)}
        style={disabled === 'disabled' ? { display: 'none' } : { float: 'right', margin: '0em', fontSize: '1.2em' }}
        title="Eliminar participante"
      ></i>
    </div>
  }

  render() {
    return (
      <div className="ui divided selection list" style={{ paddingRight: '23px', height: "160px", overflow: 'scroll' }}>
        {this.props.arrayParticipants.map(this._mapValuesData)}
        <SweetAlert
          type="warning"
          show={this.state.showConfirmDeleteParticiBanc}
          title="Eliminación participante"
          text="¿Señor usuario, está seguro que desea eliminar el participante?"
          confirmButtonColor='#DD6B55'
          confirmButtonText='Sí, estoy seguro!'
          cancelButtonText="Cancelar"
          showCancelButton={true}
          onCancel={() => this.setState({ showConfirmDeleteParticiBanc: false })}
          onConfirm={this._clickButtonDelete} />
      </div>
    );
  }
}

function orderListParticipantBank(participants, disabled) {
  participants = participants.sort((valueA, valueB) => {
    return valueA.fecha > valueB.fecha;
  })
  if (participants.size > 0) {
    var data = _.chain(participants.toArray()).map(participant => {
      const { tipoParticipante, idParticipante, nombreParticipante, cargo, empresa, estiloSocial,
        actitudBanco, uuid, order } = participant;
      if (disabled === 'disabled') {
        return _.assign({}, {
          name: nombreParticipante, cargo: cargo, tipo: tipoParticipante, id: idParticipante,
          empresa: empresa, estiloSocial: estiloSocial, actitudBanco: actitudBanco, uuid: uuid, order: order
        });
      } else {
        return _.assign({}, {
          name: nombreParticipante, cargo: cargo, tipo: tipoParticipante, id: idParticipante,
          empresa: empresa, estiloSocial: estiloSocial, actitudBanco: actitudBanco, uuid: uuid, order: order,
          'delete': {
            typeDelete: DELETE_PARTICIPANT_VIEW,
            id: idParticipante,
            tipo: KEY_PARTICIPANT_BANCO,
            mensaje: "¿Señor usuario, está seguro que desea eliminar el participante?"
          }
        });
      }
    })
      .filter(participant => _.isEqual(participant.tipo, 'banco'))
      .orderBy('order', 'asc')
      .value();
    if (data != null) {
      return data;
    }
  }
  return [];
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteParticipant
  }, dispatch);
}

function mapStateToProps({ participants }, ownerProps) {
  const disabled = _.get(ownerProps, 'disabled', '');
  return {
    participants,
    disabled,
    arrayParticipants: orderListParticipantBank(participants, disabled)

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListParticipantesBancolombia);