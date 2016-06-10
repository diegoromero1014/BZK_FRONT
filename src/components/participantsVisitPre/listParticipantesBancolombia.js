import React, {Component,PropTypes} from 'react';
import GridComponent from '../grid/component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {DELETE_PARTICIPANT_VIEW} from './constants';
import _ from 'lodash';

let v1 = "";
let v2 = "";


class ListParticipantesBancolombia extends Component {

  constructor(props){
      super(props);
      this._mapValueParticipantes = this._mapValueParticipantes.bind(this);
      this._renderHeaders = this._renderHeaders.bind(this);
      this.state = {
        column : "",
        order : "",
        orderA: 'none',
        orderD: 'inline-block'
      }
  }

  componentWillMount(){
    this.state = {
      orderA: 'none',
      orderD: 'inline-block'
    }
  }

  componentWillReceiveProps(nextProps){
      const {
          value1,
          value2
      } = nextProps;
      if ((v1 !== nextProps.value1) || (v2 !== nextProps.value2)){
      v1 = nextProps.value1;
      v2 = nextProps.value2;
      const {clearShareholderOrder} = this.props;
    }
  }


  _orderColumn(orderShareholder,columnShareholder){
    if(orderShareholder === 1){
      this.setState({orderA :'none',orderD:'inline-block'});
    }else{
      this.setState({orderA :'inline-block',orderD :'none'});
    }
  }

  _renderHeaders(){
    const {disabled} = this.props;
    if(disabled === '' || disabled === undefined){
      return [
        {
          title: "Nombre",
          key:"name"
        },
        {
          title: "Cargo",
          key:"cargo"
        },
        {
          title: "",
          key:"delete"
        },
      ]
    }else{
      return [
        {
          title: "Nombre",
          key:"name"
        },
        {
          title: "Cargo",
          key:"cargo"
        }
      ]
    }
  }

  _mapValueParticipantes(){
    const {participants} = this.props;
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

      return data;
    } else {
      return [];
    }
  }

  render() {
    this._mapValueParticipantes();
    const {participants} = this.props;
    return (
      <div className = "horizontal-scroll-wrapper" style={{overflow: 'scroll', height: "200px", marginTop: "15px"}}>
        <GridComponent headers={this._renderHeaders} data={this._mapValueParticipantes()}/>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

function mapStateToProps({participants}) {
    return {
        participants: participants.sort(function(valueA, valueB){
          return valueA.fecha < valueB.fecha;
        })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListParticipantesBancolombia);
