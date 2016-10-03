import React, {Component} from 'react';
import ListParticipantesOtros from './listParticipantesOtros';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../ui/input/inputComponent';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Textarea from '../../ui/textarea/textareaComponent';
import {addParticipant, clearParticipants} from './actions';
import SweetAlert from 'sweetalert';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import _ from 'lodash';


const validate = values => {
    const errors = {}
    return errors
};

var disabledButtonCreate= '';
class ParticipantesOtros extends Component{

  constructor(props) {
      super(props);
      this.state = {
        showEmptyParticipantOtro: false
      }
      this._addParticipantOther = this._addParticipantOther.bind(this);
      this._submitValores = this._submitValores.bind(this);
  }

  _addParticipantOther() {
    const {fields: { nombrePersona, cargoPersona, empresaPersona }, participants, addParticipant} = this.props;
    if( nombrePersona.value !== "" && nombrePersona.value !== null && nombrePersona.value !== undefined ){
        const uuid = _.uniqueId('participanOther_');
        var otherParticipant = {
          tipoParticipante: 'other',
          idParticipante: '',
          nombreParticipante: nombrePersona.value,
          cargo: cargoPersona.value === null || cargoPersona.value === undefined || cargoPersona.value === '' ?
                  '' : ' - ' + cargoPersona.value,
          empresa: empresaPersona.value === null || empresaPersona.value === undefined || empresaPersona.value === '' ?
                  '' : ' - ' + empresaPersona.value,
          estiloSocial: '',
          actitudBanco: '',
          fecha: Date.now(),
          uuid,
        }
        addParticipant(otherParticipant);
        nombrePersona.onChange('');
        cargoPersona.onChange('');
        empresaPersona.onChange('');
    } else {
      this.setState({
        showEmptyParticipantOtro: true
      });
    }
  }

  componentWillMount(){
    const{clearParticipants} = this.props;
    clearParticipants();
    this.props.resetForm();
  }

  _submitValores(){

  }

  render(){
    const {fields: {
      nombrePersona, cargoPersona, empresaPersona
    }, error, handleSubmit, participants, contactsByClient, addParticipant, disabled} = this.props;
    var numColumnList = 6;
    var data = _.chain(participants.toArray()).map(participant => {
      return participant;
    })
    .filter(participant => _.isEqual(participant.tipoParticipante, 'other'))
    .value();
    if( data.length === 10 ){
      disabledButtonCreate = 'disabled';
    } else {
      disabledButtonCreate = '';
    }
    if(disabled === "disabled"){
      numColumnList = 12;
    }
    return(
      <div>
        <Row style={{padding: "0px 10px 0px 20px"}}>
        { disabled === '' || disabled === undefined ?
          <Col xs={12} md={6} lg={6} style={{paddingRight: "0px"}}>
            <Col xs={12} md={12} lg={12}>
              <dt><span>Nombre (<span style={{color: "red"}}>*</span>)</span></dt>
              <dt style={{marginRight:"17px"}}>
                  <Input
                  name="Nombre"
                  type="text"
                  {...nombrePersona}
                  max="100"
                  />
              </dt>
            </Col>
            <Row style={{padding: "5px 10px 0px 10px"}}>
              <Col xs={12} md={6} lg={6} style={{paddingTop: "5px"}}>
                <dt><span>Cargo</span></dt>
                <dt style={{marginRight:"17px"}}>
                  <Input
                    name="txtCargo"
                    type="text"
                    {...cargoPersona}
                    max="100"
                  />
                </dt>
              </Col>
              <Col xs={12} md={6} lg={6} style={{paddingTop: "5px"}}>
                <dt><span>Empresa</span></dt>
                <dt style={{marginRight:"17px"}}>
                  <Input
                    name="txtCargo"
                    type="text"
                    {...empresaPersona}
                    max="100"
                  />
                </dt>
              </Col>
            </Row>
          <Row style={{paddingLeft: "10px"}}>
            <Col xs={12} md={5} lg={5}>
              <button className="btn btn-primary" onClick={this._addParticipantOther} disabled={disabledButtonCreate}
              type="button" title="Adicionar participante, máximo 10" style={{marginTop: "20px"}}>
                <i className="white plus icon"/> Agregar participante
              </button>
            </Col>
          </Row>
        </Col>
        : ''}
        {data.length > 0 ?
          <Col xs={12} md={numColumnList} lg={numColumnList} style={{paddingLeft: "5px", paddingTop: "10px"}}>
            <ListParticipantesOtros disabled={disabled}/>
          </Col> :
          <Col xs={12} md={numColumnList} lg={numColumnList}>
            <div style={{textAlign:"center", marginTop:"20px", marginBottom:"20px"}}>
              <span className="form-item">Aún no se han adicionado participantes</span>
            </div>
          </Col>
        }
      </Row>
      <SweetAlert
       type="error"
       show={this.state.showEmptyParticipantOtro}
       title="Error participante"
       text="Señor usuario, para agregar un participante debe ingresar por lo menos el nombre"
       onConfirm={() => this.setState({showEmptyParticipantOtro:false})}
       />
     </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addParticipant,
        clearParticipants
    }, dispatch);
}

function mapStateToProps({participants}) {
    return {
        participants
    };
}

export default reduxForm({
  form: 'submitValidation',
  fields: ["nombrePersona", "cargoPersona", "empresaPersona"],
  validate
}, mapStateToProps, mapDispatchToProps)(ParticipantesOtros);
