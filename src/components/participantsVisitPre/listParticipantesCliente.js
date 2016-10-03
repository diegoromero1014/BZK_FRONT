import React, {Component,PropTypes} from 'react';
import GridComponent from '../grid/component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {DELETE_PARTICIPANT_VIEW} from './constants';
import {deleteParticipant} from './actions';
import SweetAlert from 'sweetalert';
import _ from 'lodash';

var arrayValueClient = [];
var idParticipantSelect = null;

class ListParticipantesCliente extends Component {

  constructor(props){
    super(props);
    this.state = {
      showConfirmDeleteParticiClient: false
    };
    this._mapValuesData = this._mapValuesData.bind(this);
    this._getValuesParticipantClient = this._getValuesParticipantClient.bind(this);
    this._clickButtonDelete = this._clickButtonDelete.bind(this);
  }

  _getValuesParticipantClient(){
    var {participants, disabled} = this.props;
    participants = participants.sort(function(valueA, valueB){
      return valueA.fecha < valueB.fecha;
    })
    if( participants.size > 0 ){
      var data = _.chain(participants.toArray()).map(participant => {
        const {tipoParticipante, idParticipante, nombreParticipante, cargo, empresa, estiloSocial, actitudBanco, uuid} = participant;
        if(disabled === 'disabled'){
          return _.assign({}, {name: nombreParticipante, cargo: cargo, tipo: tipoParticipante, id: idParticipante,
            empresa: empresa, estiloSocial: estiloSocial, actitudBanco: actitudBanco, uuid: uuid
          });
        }else{
          return _.assign({}, {name: nombreParticipante, cargo: cargo, tipo: tipoParticipante, id: idParticipante,
            empresa: empresa, estiloSocial: estiloSocial, actitudBanco: actitudBanco, uuid: uuid,
            'delete':  {
              typeDelete : DELETE_PARTICIPANT_VIEW,
              id: idParticipante,
              tipo: 'client',
              mensaje: "¿Señor usuario, está seguro que desea eliminar el participante?"
            }
          });
        }
      })
      .filter(participant => _.isEqual(participant.tipo, 'client'))
      .value();
      arrayValueClient= data;
    } else {
      arrayValueClient= [];
    }
  }

  _confirmDeleteParticipant(idData){
    idParticipantSelect = idData;
    this.setState({
      showConfirmDeleteParticiClient: true
    });
  }

  _clickButtonDelete(){
    this.setState({
      showConfirmDeleteParticiClient: false
    });
    const {participants, deleteParticipant} = this.props;
    var indexDelete = participants.findIndex(function(item){
      return item.idParticipante === idParticipantSelect;
    });
    deleteParticipant(indexDelete);
    idParticipantSelect = null;
  }

  _mapValuesData(clientData, idx){
    var {disabled} = this.props;
    return <div className="item" key={idx}>
              <span  style={{ paddingRight: '10px',fontWeight: 'bold',color: 'black'}} >{clientData.name}</span>
              {clientData.cargo} {clientData.estiloSocial} {clientData.actitudBanco}
              <i className="remove icon"
                onClick={this._confirmDeleteParticipant.bind(this, clientData.id)}
                style={disabled === 'disabled' ? {display:'none'} : {float: 'right',margin:'0em', fontSize : '1.2em'}}
                title="Eliminar participante"
                ></i>
            </div>
  }

  render() {
    this._getValuesParticipantClient();
    return (
      <div className="ui divided selection list" style={{paddingRight: '23px', height: "160px", overflow: 'scroll'}}>
        {arrayValueClient.map(this._mapValuesData)}
        <SweetAlert
          type= "warning"
          show={this.state.showConfirmDeleteParticiClient}
          title="Eliminación participante"
          text="¿Señor usuario, está seguro que desea eliminar el participante?"
          confirmButtonColor= '#DD6B55'
          confirmButtonText= 'Sí, estoy seguro!'
          cancelButtonText = "Cancelar"
          showCancelButton= {true}
          onCancel= {() => this.setState({showConfirmDeleteParticiClient: false })}
          onConfirm={this._clickButtonDelete}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ListParticipantesCliente);
