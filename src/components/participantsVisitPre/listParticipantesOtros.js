import React, {Component,PropTypes} from 'react';
import GridComponent from '../grid/component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {DELETE_PARTICIPANT_VIEW} from './constants';
import {deleteParticipant} from './actions';
import SweetAlert from 'sweetalert-react';
import _ from 'lodash';

var arrayValueOther = [];
var idParticipantSelect = null;

class ListParticipantesOtros extends Component {

  constructor(props){
      super(props);
      this.state = {
        showConfirmDeleteParticiOther: false
      };
      this._mapValuesData = this._mapValuesData.bind(this);
      this._getValuesParticipantOther = this._getValuesParticipantOther.bind(this);
      this._clickButtonDelete = this._clickButtonDelete.bind(this);
  }

  _getValuesParticipantOther(){
    var {participants, disabled} = this.props;
    participants = participants.sort(function(valueA, valueB){
      return valueA.fecha < valueB.fecha;
    })
    if( participants.size > 0 ){
      var data = _.chain(participants.toArray()).map(participant => {
        const {tipoParticipante, idParticipante, nombreParticipante, cargo, empresa, estiloSocial,
          actitudBanco, uuid} = participant;
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
              tipo: 'other',
              mensaje: "¿Señor usuario, está seguro que desea eliminar el participante?"
            }
          });
        }
      })
      .filter(participant => _.isEqual(participant.tipo, 'other'))
      .value();

      arrayValueOther= data;
    } else {
      arrayValueOther= [];
    }
  }

  _confirmDeleteParticipant(idData){
    idParticipantSelect = idData;
    this.setState({
      showConfirmDeleteParticiOther: true
    });
  }

  _clickButtonDelete(){
    this.setState({
      showConfirmDeleteParticiOther: false
    });
    const {participants, deleteParticipant} = this.props;
    var indexDelete = participants.findIndex(function(item){
      if( item.tipoParticipante === 'other' ){
        return item.nombreParticipante === idParticipantSelect;
      }
    });
    deleteParticipant(indexDelete);
    idParticipantSelect = null;
  }

  _mapValuesData(otherData, idx){
    var {disabled} = this.props;
    return <div className="item" key={idx}>
              <span  style={{ paddingRight: '10px',fontWeight: 'bold',color: 'black'}} >{otherData.name}</span>
              {otherData.cargo} {otherData.empresa}
              <i className="remove icon"
                onClick={this._confirmDeleteParticipant.bind(this, otherData.name)}
                style={disabled === 'disabled' ? {display:'none'} : {float: 'right',margin:'0em', fontSize : '1.2em'}}
                title="Eliminar participante"
                ></i>
            </div>
  }

  render() {
    this._getValuesParticipantOther();
    return (
      <div className="ui divided selection list" style={{paddingRight: '23px', height: "240px", overflow: 'scroll'}}>
        {arrayValueOther.map(this._mapValuesData)}
        <SweetAlert
          type= "warning"
          show={this.state.showConfirmDeleteParticiOther}
          title="Eliminación participante"
          text="¿Señor usuario, está seguro que desea eliminar el participante?"
          confirmButtonColor= '#DD6B55'
          confirmButtonText= 'Sí, estoy seguro!'
          cancelButtonText = "Cancelar"
          showCancelButton= {true}
          onCancel= {() => this.setState({showConfirmDeleteParticiOther: false })}
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

export default connect(mapStateToProps, mapDispatchToProps)(ListParticipantesOtros);
