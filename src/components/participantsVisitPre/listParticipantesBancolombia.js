import React, {Component,PropTypes} from 'react';
import GridComponent from '../grid/component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {DELETE_PARTICIPANT_VIEW} from './constants';
import {deleteParticipant} from './actions';
import _ from 'lodash';

var arrayValueBanc = [];

class ListParticipantesBancolombia extends Component {

  constructor(props){
      super(props);
      this._mapValuesData = this._mapValuesData.bind(this);
      this._getValuesParticipantBanc = this._getValuesParticipantBanc.bind(this);
  }

  _getValuesParticipantBanc(){
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
            tipo: 'banco',
            mensaje: "¿Señor usuario, está seguro que desea eliminar el participante?"
          }
        });
      })
      .filter(participant => _.isEqual(participant.tipo, 'banco'))
      .value();

      arrayValueBanc= data;
    } else {
      arrayValueBanc= [];
    }
  }

  _clickButtonDelete(idData){
    const {participants, deleteParticipant} = this.props;
    var indexDelete = participants.findIndex(function(item){
      return item.idParticipante === idData;
    });
    console.log("indexDelete", indexDelete);
    deleteParticipant(indexDelete);
  }

  _mapValuesData(userData){
    return <div className="item">
              <span  style={{ paddingRight: '10px',fontWeight: 'bold',color: 'black'}} >{userData.name}</span>
              {userData.cargo} {userData.empresa}
              <i className="remove icon"
                onClick={this._clickButtonDelete.bind(this, userData.id)}
                style={{float: 'right',margin:'0em', fontSize : '1.2em'}}
                title="Eliminar participante"
                ></i>
            </div>
  }

  render() {
    this._getValuesParticipantBanc();
    return (
      <div className="ui divided selection list" style={{paddingRight: '23px', height: "240px", overflow: 'scroll'}}>
        {arrayValueBanc.map(this._mapValuesData)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ListParticipantesBancolombia);
