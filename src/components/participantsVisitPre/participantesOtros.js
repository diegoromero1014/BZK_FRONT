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
        showEmptyParticipant: false,
        showParticipantExist: false
      }
      this._addParticipantClient = this._addParticipantClient.bind(this);
      this._submitValores = this._submitValores.bind(this);
  }

  _addParticipantClient() {
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
    }, error, handleSubmit, participants, contactsByClient, addParticipant} = this.props;
    if( participants.size === 10 ){
      disabledButtonCreate = 'disabled';
    }
    return(
      <div>
        <Row style={{padding: "0px 10px 0px 20px"}}>
          <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
            <dt>
              <span>Nombre</span>
            </dt>
            <dt>
              <div className="InputAddOn">
                <input type="text" style={{padding: '0px 11px !important'}} placeholder="Ingrese el nombre de las persona" className="input-lg input InputAddOn-field"/>
              </div>
            </dt>
          </Col>
          <Col xs={12} md={4} lg={4}>
            <dt><span>Cargo</span></dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                name="txtCargo"
                type="text"
                max="120"
                placeholder="Ingrese el cargo de la persona"
              />
            </dt>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <dt><span>Empresa</span></dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                name="txtCargo"
                type="text"
                max="120"
                placeholder="Ingrese la empresa"
              />
            </dt>
          </Col>
          <Col xs={1} md={1} lg={1}>
            <button className="btn btn-primary" onClick={this._addParticipantClient} disabled={disabledButtonCreate}
              type="button" title="Adicionar participante" style={{marginLeft:"17px", marginTop: "20px"}}>
              <i className="add user icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
            </button>
          </Col>
        </Row>
        {participants.size > 0 ?
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs>
              <ListParticipantesOtros />
            </Col>
          </Row> :
          <div style={{textAlign:"center", marginTop:"20px", marginBottom:"20px"}}>
            <h4 className="form-item">Señor usuario, no se han adicionado participantes por parte del cliente.</h4>
          </div>
        }
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
