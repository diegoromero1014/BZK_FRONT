import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../../globalComponents/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Textarea from '../../../ui/textarea/textareaComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import {consultDataSelect, consultList, getMasterDataFields} from '../../selectsComponent/actions';
import {VISIT_TYPE} from '../../selectsComponent/constants';
import ParticipantesCliente from '../../participantsVisitPre/participantesCliente';
import ParticipantesBancolombia from '../../participantsVisitPre/participantesBancolombia';
import ParticipantesOtros from '../../participantsVisitPre/participantesOtros';
import TaskVisit from './tasks/taskVisit';
import BotonCreateContactComponent from '../../contact/createContact/botonCreateContactComponent';
import {LAST_VISIT_REVIEW} from '../constants';
import {consultParameterServer} from '../actions';
import SweetAlert from 'sweetalert-react';

const fields = ["tipoVisita","fechaVisita","desarrolloGeneral"];
var dateVisitLastReview;
const validate = values => {
  var errors = {};
    if(!values.tipoVisita){
      errors.tipoVisita = "Debe seleccionar una opción";
    }else{
      errors.tipoVisita = null;
    }
    if(!values.fechaVisita){
      errors.fechaVisita = "Debe seleccionar una fecha";
    }else{
      errors.fechaVisita = null;
    }
    return errors;
};

class FormVisita extends Component{

  constructor(props) {
    super(props);
    this.state = {
      showErrorSaveVisit: false,
    }
    this._submitCreateVisita = this._submitCreateVisita.bind(this);
  }

  _submitCreateVisita(){
    const {participants} = this.props;
    var data = _.filter(participants, participant => _.isEqual(participant.tipo, 'banco'));
    console.log("Participants banco", data.size);
  }

  componentWillMount(){
    const {clientInformacion, getMasterDataFields, consultParameterServer} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
    } else {
      getMasterDataFields([VISIT_TYPE]);
      consultParameterServer(LAST_VISIT_REVIEW).then((data)=> {
        console.log("data.payload.data",data.payload.data);
        if( data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
          data.payload.data.parameter !== undefined ){
            console.log("JSON.parse(data.payload.data.parameter)", JSON.parse(data.payload.data.parameter));
          dateVisitLastReview = JSON.parse(data.payload.data.parameter).value;
        }
      }, (reason) =>{
      });
    }
  }

  render(){
    const {fields: {tipoVisita, fechaVisita, desarrolloGeneral},
      clientInformacion, selectsReducer, handleSubmit} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    return(
      <form onSubmit={handleSubmit(this._submitCreateVisita)} className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF", marginTop: "2px", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>
        <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
        <Row style={{padding: "10px 10px 10px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="browser icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "22px"}}> Información general</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs={12} md={6} lg={6} style={{paddingRight: "20px"}}>
            <dt>
              <span>Tipo de reunión (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt>
              <ComboBox
                name="tipoVisita"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                parentId="dashboardComponentScroll"
                data={selectsReducer.get(VISIT_TYPE) || []}
              />
            </dt>
          </Col>
          <Col xs={12} md={6} lg={6} style={{paddingRight: "20px"}}>
            <dt>
              <span>Fecha de reunión - DD/MM/YYYY (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt>
              <DateTimePickerUi
                culture='es'
                format={"DD/MM/YYYY"}
                time={false}
                placeholder="Seleccione la fecha de reunión"
                max={new Date()}
              />
            </dt>
          </Col>
        </Row>
        <Row style={{padding: "10px 42px 0px 20px"}}>
          <Col xs={10} md={10} lg={10}>
            <dl style={{fontSize: "20px", color: "#505050", marginTop: "15px", marginBottom: "0px"}}>
              <span className="section-title">Participantes en la reunión por parte del cliente </span>
              <i className="help circle icon blue"
              style={{fontSize: "18px", cursor: "pointer"}} title="Mensaje"/>
            </dl>
          </Col>
          <BotonCreateContactComponent typeButton={1} />
        </Row>
        <Row style={{padding: "0px 10px 10px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px solid #505050", width:"99%", marginTop: "5px"}}></div>
            </div>
          </Col>
        </Row>
        <ParticipantesCliente />

        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <dl style={{fontSize: "20px", color: "#505050", marginTop: "5px", marginBottom: "5px"}}>
              <span className="section-title">Participantes en la reunión por parte del Grupo Bancolombia </span>
              <i className="help circle icon blue"
              style={{fontSize: "18px", cursor: "pointer"}} title="Mensaje"/>
              <div className="tab-content-row" style={{borderTop: "1px solid #505050", width:"99%", marginTop: "5px"}}></div>
            </dl>
          </Col>
        </Row>
        <ParticipantesBancolombia />

        <Row style={{padding: "20px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <dl style={{fontSize: "20px", color: "#505050", marginTop: "5px", marginBottom: "5px"}}>
              <span className="section-title">Otros participantes en la reunión </span>
              <i className="help circle icon blue"
              style={{fontSize: "18px", cursor: "pointer"}} title="Mensaje"/>
              <div className="tab-content-row" style={{borderTop: "1px solid #505050", width:"99%", marginTop: "5px"}}></div>
            </dl>
          </Col>
        </Row>
        <ParticipantesOtros />
        <TaskVisit />
        <Row style={{padding: "30px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="book icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "22px"}}> Desarrollo general de la reunión  </span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 10px 20px"}}>
        <Col xs={12} md={12} lg={12}>
          <Textarea
            {...desarrolloGeneral}
            name="desarrolloGeneral"
            type="text"
            max="3500"
            title="La longitud máxima de caracteres es de 3500"
            style={{width: '100%', height: '250px'}}
          />
        </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div style={{textAlign:"left", marginTop:"20px", marginBottom:"20px", marginLeft:"20px"}}>
            <h4 className="form-item">Fecha última revisión formato visita(YYY/DD/MM): <span>{dateVisitLastReview}</span></h4>
            </div>
          </Col>
        </Row>
        <div className="" style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width:"100%", marginBottom: "0px", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
          <div style={{width: "580px", height: "100%", position: "fixed", right: "0px"}}>
            <button className="btn" style={{float:"right", margin:"8px 0px 0px 8px", position:"fixed"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Guardar definitivo</span>
            </button>
            <button className="btn" style={{float:"right", margin:"8px 0px 0px 210px", position:"fixed", backgroundColor:"#00B5AD"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Guardar como borrador</span>
            </button>
            <button className="btn" style={{float:"right", margin:"8px 0px 0px 450px", position:"fixed", backgroundColor:"red"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Cancelar</span>
            </button>
          </div>
        </div>
        <SweetAlert
         type="error"
         show={this.state.showErrorSaveVisit}
         title="Error participantes"
         text="Señor usuario, para guardar una visita como mínimo debe agregar un participante por parte del Grupo Bancolombia."
         onConfirm={() => this.setState({showErrorSaveVisit:false})}
         />
      </form>
    );
  }

}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    consultDataSelect,
    consultList,
    getMasterDataFields,
    consultParameterServer
  }, dispatch);
}

function mapStateToProps({clientInformacion, selectsReducer, visitReducer, participants}, ownerProps){
    return {
      clientInformacion,
      selectsReducer,
      visitReducer,
      participants
    };
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormVisita);
