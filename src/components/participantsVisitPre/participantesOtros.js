import React, {Component} from 'react';
import ListParticipantesOtros from './listParticipantesOtros';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../ui/input/inputComponent';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Textarea from '../../ui/textarea/textareaComponent';
import {addParticipant, clearParticipants} from './actions';
import SweetAlert from 'sweetalert-react';
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
      this._addParticipantClient = this._addParticipantClient.bind(this);
      this._submitValores = this._submitValores.bind(this);
  }

  _addParticipantClient() {
    const {fields: { nombrePersona, cargoPersona, empresaPersona }, participants, addParticipant} = this.props;
    if( nombrePersona.value !== "" && nombrePersona.value !== null && nombrePersona.value !== undefined ){
        const uuid = _.uniqueId('participanOther_');
        var otherParticipant = {
          tipoParticipante: 'other',
          idParticipante: '',
          nombreParticipante: nombrePersona.value,
          cargo: cargoPersona.value,
          empresa: empresaPersona.value,
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

    var data = _.chain(participants.toArray()).map(participant => {
      return participant;
    })
    .filter(participant => _.isEqual(participant.tipoParticipante, 'other'))
    .value();
    if( data.length === 10 ){
      disabledButtonCreate = 'disabled';
    }
    return(
      <div>
      { disabled === '' || disabled === undefined ?
        <Row style={{padding: "0px 10px 0px 20px"}}>
          <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
            <dt>
              <span>Nombre</span>
            </dt>
            <dt style={{marginRight:"17px"}}>
                <Input
                name="Nombre"
                type="text"
                {...nombrePersona}
                placeholder="Ingrese el nombre del participante"
                max="100"
                />
            </dt>
          </Col>
          <Col xs={12} md={4} lg={4}>
            <dt><span>Cargo</span></dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                name="txtCargo"
                type="text"
                {...cargoPersona}
                max="100"
                placeholder="Ingrese el cargo del participante"
              />
            </dt>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <dt><span>Empresa</span></dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                name="txtCargo"
                type="text"
                {...empresaPersona}
                max="100"
                placeholder="Ingrese la empresa del participante"
              />
            </dt>
          </Col>
          <Col xs={1} md={1} lg={1}>
            <button className="btn btn-primary" onClick={this._addParticipantClient} disabled={disabledButtonCreate}
              type="button" title="Adicionar participante, máximo 10" style={{marginLeft:"17px", marginTop: "20px"}}>
              <i className="add user icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
            </button>
          </Col>
        </Row>
        : ''}
        {data.length > 0 &&
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs>
              <ListParticipantesOtros disabled={disabled}/>
            </Col>
          </Row>
        }
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
