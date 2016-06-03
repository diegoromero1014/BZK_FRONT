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
import BotonCreateContactComponent from '../../contact/createContact/botonCreateContactComponent';

const fields = ["desarrolloGeneral"];

const validate = values => {
    const errors = {}
    return errors;
};

class FormVisita extends Component{

  constructor(props) {
    super(props);
    this._submitCreateVisita = this._submitCreateVisita.bind(this);
  }

  _submitCreateVisita(){
  }

  componentWillMount(){
    const {clientInformacion, getMasterDataFields} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
    } else {
      getMasterDataFields([VISIT_TYPE]);
    }
  }

  render(){
    const {fields: {desarrolloGeneral}, clientInformacion, selectsReducer, handleSubmit} = this.props;
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

        <Row style={{padding: "10px 42px 20px 20px"}}>
          <Col xs={10} md={10} lg={10}>
            <dl style={{fontSize: "20px", color: "#505050", marginTop: "5px", marginBottom: "5px"}}>
              <span className="section-title">Participantes en la reunión por parte del cliente </span>
              <i className="help circle icon blue"
              style={{fontSize: "18px", cursor: "pointer"}} title="Mensaje"/>
              <div className="tab-content-row" style={{borderTop: "1px solid #505050", width:"99%", marginTop: "5px"}}></div>
            </dl>
            <dl style={{fontSize: "20px", color: "#505050", marginTop: "5px", marginBottom: "5px"}}>
            </dl>
          </Col>
          <BotonCreateContactComponent typeButton={1} />
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
        <div className="" style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width:"100%", marginBottom: "0px", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
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
      </form>
    );
  }

}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    consultDataSelect,
    consultList,
    getMasterDataFields
  }, dispatch);
}

function mapStateToProps({clientInformacion, selectsReducer}, ownerProps){
    return {
      clientInformacion,
      selectsReducer
    };
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormVisita);
