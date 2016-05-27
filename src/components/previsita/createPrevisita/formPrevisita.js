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
import ParticipantesCliente from './participantesCliente';
import ParticipantesBancolombia from './ParticipantesBancolombia';
import ParticipantesOtros from './ParticipantesOtros';
import NegociosPendientes from './negociosPendientes';

const fields = [];

const validate = values => {
    const errors = {}
    return errors;
};

class FormPrevisita extends Component{

  constructor(props) {
    super(props);
    this._submitCreatePrevisita = this._submitCreatePrevisita.bind(this);
  }

  _submitCreatePrevisita(){
  }

  componentWillMount(){
    const {clientInformacion} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
    }
  }

  render(){
    const {clientInformacion, handleSubmit} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    return(
      <form onSubmit={handleSubmit(this._submitCreatePrevisita)} className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF", marginTop: "2px", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>
        <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="browser icon" style={{fontSize: "25px"}}/>
              <span className="title-middle"> Datos de la visita</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
            <dt>
              <span>Fecha - DD/MM/YYYY (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt>
              <DateTimePickerUi culture='es' format={"DD/MM/YYYY"}/>
            </dt>
          </Col>
          <Col xs={12} md={4} lg={4}>
            <dt><span>Lugar (</span><span style={{color: "red"}}>*</span>)</dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                name="txtLugar"
                type="text"
                max="120"
                placeholder="Ingrese el lugar"
              />
            </dt>
          </Col>
          <Col xs={12} md={4} lg={4}>
            <div style={{paddingRight: "15px"}}>
              <dt><span>Tipo de la visita (</span><span style={{color: "red"}}>*</span>)</dt>
              <ComboBox
                name="tipoVisita"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                parentId="dashboardComponentScroll"
              />
            </div>
          </Col>
        </Row>
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="users icon" style={{fontSize: "25px"}}/>
              <span className="title-middle"> Participantes en la reunión por parte del cliente  </span>
              <i className="help circle icon blue" style={{fontSize: "25px"}}
                title="Cartilla de Estilo Social: Si la reunión será atendida por varias personas por parte del cliente ¿tienes adaptada tu conversación a los intereses y preocupaciones principales de cada uno? ¿Conoces cuáles son esos intereses y preocupaciones?"
              />
              <i className="file pdf outline icon red" style={{fontSize: "25px"}}
                title="Cartilla estilo social"
              />
            </div>
          </Col>
        </Row>
        <ParticipantesCliente />
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="users icon" style={{fontSize: "25px"}}/>
              <span className="title-middle"> Participantes por parte del Grupo Bancolombia</span>
            </div>
          </Col>
        </Row>
        <ParticipantesBancolombia />
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="users icon" style={{fontSize: "25px"}}/>
              <span className="title-middle"> Otros participantes</span>
            </div>
          </Col>
        </Row>
        <ParticipantesOtros />
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="send icon" style={{fontSize: "25px"}}/>
              <span className="title-middle"> 1. ¿Cuál es el objetivo que perseguimos de la reunión?</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={12} lg={12} >
            <dt>
              <Textarea
                name="objetivo"
                type="text"
                style={{width: '100%', height: '100%'}}
                max="1000"
                rows={4}
              />
            </dt>
          </Col>
        </Row>
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="suitcase icon" style={{fontSize: "25px"}}/>
              <span className="title-middle"> 2. Asuntos, negocios y oportunidades de negocio pendientes (clasificados dentro de las 6 necesidades del cliente)</span>
            </div>
          </Col>
        </Row>
        <NegociosPendientes />
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="edit icon" style={{fontSize: "25px"}}/>
              <span className="title-middle"> 3. Si el cliente nos calificara en servicio, ¿qué nos haría falta para que nos diera un 10?</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={12} lg={12} >
            <dt>
              <Textarea
                name="servicio"
                type="text"
                style={{width: '100%', height: '100%'}}
                max="1000"
                rows={4}
              />
            </dt>
          </Col>
        </Row>
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="write icon" style={{fontSize: "25px"}}/>
              <span className="title-middle"> 4. Observaciones</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={12} lg={12} >
            <dt>
              <Textarea
                name="observaciones"
                type="text"
                style={{width: '100%', height: '100%'}}
                max="1000"
                rows={4}
              />
            </dt>
          </Col>
        </Row>
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="payment icon" style={{fontSize: "25px"}}/>
              <span className="title-middle"> 5. Cifras de la relación consolidada</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div className="field">
              <input type="file" name="fileToUpload" id="fileToUpload"/>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="archive icon" style={{fontSize: "25px"}}/>
              <span className="title-middle"> 5. Anexos</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <input type="file" name="fileToUpload" id="fileToUpload"/>
          </Col>
        </Row>
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="idea icon" style={{fontSize: "25px"}}/>
              <span className="title-middle"> 7. Idea que llevamos</span>
              <i className="help circle icon blue" style={{fontSize: "25px"}}
                title=" Antes de responder, hazte las siguientes preguntas y/o reflexiones:
												a)¿Cuál es el insight (enseñanza) que deseas llevarle al cliente?
												b)¿Por qué esta enseñanza hará pensar de manera distinta al cliente?
												c)¿Cómo crees que esta enseñanza llevará al cliente a la acción?
												d)¿Cómo esta enseñanza conduce hacia una solución que tiene el Grupo Bancolombia?"
                />
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={12} lg={12} >
            <dt><span>¿Cuáles son los resultados esperados y en cuánto tiempo se verán materializados?</span></dt>
            <dt>
              <Textarea
                name="resultados"
                type="text"
                style={{width: '100%', height: '100%'}}
                max="1000"
                rows={4}
              />
            </dt>
          </Col>
        </Row>
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="history icon" style={{fontSize: "25px"}}/>
              <span className="title-middle"> 8. Metodología Challenger: Enseñanza, toma de control, adaptación, generación de tensión constructiva</span>
              <i className="help circle icon blue" style={{fontSize: "25px"}}
                title="Enseñanza (Oportunidades – Retos): Diligencie de manera resumida los siguientes campos. Recuerde que lo importante es la necesidad del cliente, por lo cual no debe hablar de Bancolombia hasta cuando se expone la solución a la situación del cliente. •No es necesario haber asistido previamente a la formación Challenger, el formato entrega las herramientas necesarias para su construcción. "
              />
              <i className="file pdf outline icon red" style={{fontSize: "25px"}}
                title="Caso de estudio"
              />
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={12} lg={12} >
            <dt>
              <span>Acondicionamiento  </span>
              <i className="help circle icon blue" style={{fontSize: "15px"}}
                title="Evidenciar problemas, riesgos u oportunidades que la industria tiene y que afectan la manera óptima de llevar los negocios. Puede usar también riesgos y oportunidades que el cliente no ha visto. Tenga en cuenta los objetivos estratégicos de la empresa."
              />
              </dt>
            <dt>
              <Textarea
                name="acondicionamiento"
                type="text"
                style={{width: '100%', height: '100%'}}
                max="1000"
                rows={4}
              />
            </dt>
          </Col>
        </Row>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={12} lg={12} >
            <dt>
              <span>Replanteamiento</span>
              <i className="help circle icon blue" style={{fontSize: "15px"}}
                title="Evidenciar problemas, riesgos u oportunidades que la industria tiene y que afectan la manera óptima de llevar los negocios. Puede usar también riesgos y oportunidades que el cliente no ha visto. Tenga en cuenta los objetivos estratégicos de la empresa."
              />
            </dt>
            <dt>
              <Textarea
                name="replanteamiento"
                type="text"
                style={{width: '100%', height: '100%'}}
                max="1000"
                rows={4}
              />
            </dt>
          </Col>
        </Row>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={12} lg={12} >
            <dt>
              <span>Ahogamiento racional</span>
              <i className="help circle icon blue" style={{fontSize: "15px"}}
                title="Cuantificar el impacto del problema o de la oportunidad no aprovechada y relacionarla con alguna cuantía que le sea familiar al cliente. "
              />
            </dt>
            <dt>
              <Textarea
                name="ahogamientoRacional"
                type="text"
                style={{width: '100%', height: '100%'}}
                max="1000"
                rows={4}
              />
            </dt>
          </Col>
        </Row>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={12} lg={12} >
            <dt>
              <span>Impacto emocional</span>
              <i className="help circle icon blue" style={{fontSize: "15px"}}
                title="Mostrar cómo la situación que estamos exponiendo impacta tanto a la función corporativa como a la persona que la ejerce."
              />
            </dt>
            <dt>
              <Textarea
                name="impactoEmocional"
                type="text"
                style={{width: '100%', height: '100%'}}
                max="1000"
                rows={4}
              />
            </dt>
          </Col>
        </Row>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={12} lg={12} >
            <dt>
              <span>Nuevo modo</span>
              <i className="help circle icon blue" style={{fontSize: "15px"}}
                title="Actuar en un rol de consultor para acordar conjuntamente con el cliente cuáles serían los pasos próximos para resolver el problema, mitigar el riesgo o aprovechar la oportunidad, invitando a que el cliente visualice ese escenario como posible y deseable."
              />
            </dt>
            <dt>
              <Textarea
                name="nuevoModo"
                type="text"
                style={{width: '100%', height: '100%'}}
                max="1000"
                rows={4}
              />
            </dt>
          </Col>
        </Row>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={12} lg={12} >
            <dt>
              <span>Nuestra solución  </span>
              <i className="help circle icon blue" style={{fontSize: "15px"}}
                title="Mostrar cómo Bancolombia con sus atributos únicos es el indicado para permitir la implementación del plan acordado en el punto anterior. Este es el momento para hablar de los productos y servicios que ofrecemos."
              />
            </dt>
            <dt>
              <Textarea
                name="nuestraSolucion"
                type="text"
                style={{width: '100%', height: '100%'}}
                max="1000"
                rows={4}
              />
            </dt>
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
            <span style={{color: "#FFFFFF", padding:"10px"}}>Borrar</span>
          </button>
        </div>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps({clientInformacion}, ownerProps){
    return {
      clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormPrevisita);

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormPrevisita);
