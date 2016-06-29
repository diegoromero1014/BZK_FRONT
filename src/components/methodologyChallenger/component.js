import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Textarea from '../../ui/textarea/textareaComponent';
import {redirectUrl} from '../globalComponents/actions';
import $ from 'jquery';

const titleAcondicionamiento = 'Describir el entorno y el negocio del cliente, tendencias y situación actual de la industria.';
const titleReplanteamiento = 'Evidenciar problemas, riesgos u oportunidades que la industria tiene y que afectan la manera óptima de llevar los negocios. Puede usar también riesgos y oportunidades que el cliente no ha visto. Tenga en cuenta los objetivos estratégicos de la empresa.';
const titleAhogamiento = 'Cuantificar el impacto del problema o de la oportunidad no aprovechada y relacionarla con alguna cuantía que le sea familiar al cliente.';
const titleImpacto = 'Mostrar cómo la situación que estamos exponiendo impacta tanto a la función corporativa como a la persona que la ejerce.';
const titleNuevoModo = 'Actuar en un rol de consultor para acordar conjuntamente con el cliente cuáles serían los pasos próximos para resolver el problema, mitigar el riesgo o aprovechar la oportunidad, invitando a que el cliente visualice ese escenario como posible y deseable.';
const titleNuestraSolucion = 'Mostrar cómo Bancolombia con sus atributos únicos es el indicado para permitir la implementación del plan acordado en el punto anterior. Este es el momento para hablar de los productos y servicios que ofrecemos.';


class Challenger extends Component{
  constructor(props){
    super(props);
  }

  componentWillMount(){
    const {clientInformacion} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
    }
  }

  _seletedTabActive(tabSelect, e){
    switch(tabSelect){
      case 1:
        $('.title.acondicionamiento').toggleClass('active');
        $('.content.acondicionamiento').toggleClass('active');
        break;
      case 2:
        $('.title.replanteamiento').toggleClass('active');
        $('.content.replanteamiento').toggleClass('active');
        break;
      case 3:
        $('.title.ahogamiento').toggleClass('active');
        $('.content.ahogamiento').toggleClass('active');
        break;
      case 4:
        $('.title.impacto').toggleClass('active');
        $('.content.impacto').toggleClass('active');
        break;
      case 5:
        $('.title.nuevoModo').toggleClass('active');
        $('.content.nuevoModo').toggleClass('active');
        break;
      case 6:
        $('.title.solucion').toggleClass('active');
        $('.content.solucion').toggleClass('active');
        break;
      default:
        $('.title.acondicionamiento').toggleClass('active');
        $('.content.acondicionamiento').toggleClass('active');
        break;
    }
  }

  render(){
    const {acondicionamiento, acondicionamientoTouch, acondicionamientoError, onChangeAcondicionamiento,
           replanteamiento, replanteamientoTouch, replanteamientoError, onChangeReplanteamiento,
           ahogamiento, ahogamientoTouch, ahogamientoError, onChangeAhogamiento,
           impacto, impactoTouch, impactoError, onChangeImpacto,
           nuevoModo, nuevoModoTouch, nuevoModoError, onChangeNuevoModo,
           nuestraSolucion, nuestraSolucionTouch, nuestraSolucionError, onChangeNuestraSolucion,
           disabled} = this.props;
    return(
      <div className="ui styled accordion" style={{width: "100%"}}>
        <div className="title acondicionamiento active" style={acondicionamientoError !== null && acondicionamientoTouch ? {backgroundColor: '#FFEAEA'} : {}} onClick={this._seletedTabActive.bind(this, 1)}>
          <i className="dropdown icon"></i> Acondicionamiento (<span style={{color: "red"}}>*</span>)
          <i className="help circle icon blue" style={{cursor: "pointer", marginLeft: "5px"}} title={titleAcondicionamiento}/>
        </div>
        <div className="content acondicionamiento active">
          <Textarea
            value={acondicionamiento}
            touched={acondicionamientoTouch}
            error={acondicionamientoError}
            onChange={onChangeAcondicionamiento}
            name="targetPrevisit"
            type="text"
            max="3500"
            title="La longitud máxima de caracteres es de 3500"
            style={{width: '100%', height: '150px', resize: 'none', overflow: 'auto'}}
            placeholder="Ingrese un valor..."
            disabled={disabled}
          />
        </div>
        <div className="title replanteamiento" style={replanteamientoError !== null && replanteamientoTouch ? {backgroundColor: '#FFEAEA'} : {}} onClick={this._seletedTabActive.bind(this, 2)}>
          <i className="dropdown icon"></i> Replanteamiento (<span style={{color: "red"}}>*</span>)
          <i className="help circle icon blue" style={{cursor: "pointer", marginLeft: "5px"}} title={titleReplanteamiento}/>
        </div>
        <div className="content replanteamiento">
          <Textarea
            value={replanteamiento}
            touched={replanteamientoTouch}
            error={replanteamientoError}
            onChange={onChangeReplanteamiento}
            name="targetPrevisit"
            type="text"
            max="3500"
            title="La longitud máxima de caracteres es de 3500"
            style={{width: '100%', height: '150px', resize: 'none', overflow: 'auto'}}
            placeholder="Ingrese un valor..."
            disabled={disabled}
          />
        </div>
        <div className="title ahogamiento" style={ahogamientoError !== null && ahogamientoTouch ? {backgroundColor: '#FFEAEA'} : {}}  onClick={this._seletedTabActive.bind(this, 3)}>
          <i className="dropdown icon"></i> Ahogamiento racional (<span style={{color: "red"}}>*</span>)
          <i className="help circle icon blue" style={{cursor: "pointer", marginLeft: "5px"}} title={titleAhogamiento}/>
        </div>
        <div className="content ahogamiento">
          <Textarea
            value={ahogamiento}
            touched={ahogamientoTouch}
            error={ahogamientoError}
            onChange={onChangeAhogamiento}
            name="targetPrevisit"
            type="text"
            max="3500"
            title="La longitud máxima de caracteres es de 3500"
            style={{width: '100%', height: '150px', resize: 'none', overflow: 'auto'}}
            placeholder="Ingrese un valor..."
            disabled={disabled}
          />
        </div>
        <div className="title impacto" style={impactoError !== null && impactoTouch ? {backgroundColor: '#FFEAEA'} : {}}  onClick={this._seletedTabActive.bind(this, 4)}>
          <i className="dropdown icon"></i> Impacto emocional (<span style={{color: "red"}}>*</span>)
          <i className="help circle icon blue" style={{cursor: "pointer", marginLeft: "5px"}} title={titleImpacto}/>
        </div>
        <div className="content impacto">
          <Textarea
            value={impacto}
            touched={impactoTouch}
            error={impactoError}
            onChange={onChangeImpacto}
            name="targetPrevisit"
            type="text"
            max="3500"
            title="La longitud máxima de caracteres es de 3500"
            style={{width: '100%', height: '150px', resize: 'none', overflow: 'auto'}}
            placeholder="Ingrese un valor..."
            disabled={disabled}
          />
        </div>
        <div className="title nuevoModo" style={nuevoModoError !== null && nuevoModoTouch ? {backgroundColor: '#FFEAEA'} : {}}  onClick={this._seletedTabActive.bind(this, 5)}>
          <i className="dropdown icon"></i> Nuevo modo (<span style={{color: "red"}}>*</span>)
          <i className="help circle icon blue" style={{cursor: "pointer", marginLeft: "5px"}} title={titleNuevoModo}/>
        </div>
        <div className="content nuevoModo">
          <Textarea
            value={nuevoModo}
            touched={nuevoModoTouch}
            error={nuevoModoError}
            onChange={onChangeNuevoModo}
            name="targetPrevisit"
            type="text"
            max="3500"
            title="La longitud máxima de caracteres es de 3500"
            style={{width: '100%', height: '150px', resize: 'none', overflow: 'auto'}}
            placeholder="Ingrese un valor..."
            disabled={disabled}
          />
        </div>
        <div className="title solucion" style={nuestraSolucionError !== null && nuestraSolucionTouch ? {backgroundColor: '#FFEAEA'} : {}}  onClick={this._seletedTabActive.bind(this, 6)}>
          <i className="dropdown icon"></i> Nuestra solución (<span style={{color: "red"}}>*</span>)
          <i className="help circle icon blue" style={{cursor: "pointer", marginLeft: "5px"}} title={titleNuestraSolucion}/>
        </div>
        <div className="content solucion">
          <Textarea
            value={nuestraSolucion}
            touched={nuestraSolucionTouch}
            error={nuestraSolucionError}
            onChange={onChangeNuestraSolucion}
            name="targetPrevisit"
            type="text"
            max="3500"
            title="La longitud máxima de caracteres es de 3500"
            style={{width: '100%', height: '150px', resize: 'none', overflow: 'auto'}}
            placeholder="Ingrese un valor..."
            disabled={disabled}
          />
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Challenger);
