import React, {Component,PropTypes} from 'react';
import GridComponent from '../grid/component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {DELETE_PARTICIPANT_VIEW} from './constants';
import {deleteParticipant} from './actions';
import _ from 'lodash';

var arrayValueOther = [];

class ListParticipantesOtros extends Component {

  constructor(props){
      super(props);
      this._mapValuesData = this._mapValuesData.bind(this);
      this._getValuesParticipantOther = this._getValuesParticipantOther.bind(this);
  }

  _getValuesParticipantOther(){
    var {participants} = this.props;
    participants = participants.sort(function(valueA, valueB){
      return valueA.fecha < valueB.fecha;
    })
    if( participants.size > 0 ){
      var data = _.chain(participants.toArray()).map(participant => {
        const {tipoParticipante, idParticipante, nombreParticipante, cargo, empresa, estiloSocial,
          actitudBanco, uuid} = participant;
        return _.assign({}, {name: nombreParticipante, cargo: cargo, tipo: tipoParticipante, id: idParticipante,
          empresa: empresa, estiloSocial: estiloSocial, actitudBanco: actitudBanco, uuid: uuid,
          'delete':  {
            typeDelete : DELETE_PARTICIPANT_VIEW,
            id: idParticipante,
            tipo: 'other',
            mensaje: "¿Señor usuario, está seguro que desea eliminar el participante?"
          }
        });
      })
      .filter(participant => _.isEqual(participant.tipo, 'other'))
      .value();

      arrayValueOther= data;
    } else {
      arrayValueOther= [];
    }
  }

  _clickButtonDelete(idData){
    const {participants, deleteParticipant} = this.props;
    var indexDelete = participants.findIndex(function(item){
      if( item.tipoParticipante === 'other' ){
        return item.nombreParticipante === actionsDelete.nombre;
      }
    });
    deleteParticipant(indexDelete);
  }

  _mapValuesData(otherData){
    return <div className="item">
              <span  style={{ paddingRight: '10px',fontWeight: 'bold',color: 'black'}} >{otherData.name}</span>
              {otherData.cargo} {otherData.empresa}
              <i className="remove icon"
                onClick={this._clickButtonDelete.bind(this, otherData.id)}
                style={{float: 'right',margin:'0em', fontSize : '1.2em'}}
                title="Eliminar participante"
                ></i>
            </div>
  }

  render() {
    this._getValuesParticipantOther();
    return (
      <div className="ui divided selection list" style={{paddingRight: '23px', height: "240px", overflow: 'scroll'}}>
        {arrayValueOther.map(this._mapValuesData)}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      deleteParticipant
    }, dispatch);
}

function mapStateToProps({participants}) {
    return {
        participants
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListParticipantesOtros);
