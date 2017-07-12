import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import RichText from '../richText/richTextComponent';
import {redirectUrl} from '../globalComponents/actions';
import $ from 'jquery';
import _ from "lodash";
import ToolTip from "../toolTip/toolTipComponent";

const titleAcondicionamiento = 'Describir el entorno y el negocio del cliente, tendencias y situación actual de la industria.';
const titleReplanteamiento = 'Evidenciar problemas, riesgos u oportunidades que la industria tiene y que afectan la manera óptima de llevar los negocios. Puede usar también riesgos y oportunidades que el cliente no ha visto. Tenga en cuenta los objetivos estratégicos de la empresa.';
const titleAhogamiento = 'Cuantificar el impacto del problema o de la oportunidad no aprovechada y relacionarla con alguna cuantía que le sea familiar al cliente.';
const titleImpacto = 'Mostrar cómo la situación que estamos exponiendo impacta tanto a la función corporativa como a la persona que la ejerce.';
const titleNuevoModo = 'Actuar en un rol de consultor para acordar conjuntamente con el cliente cuáles serían los pasos próximos para resolver el problema, mitigar el riesgo o aprovechar la oportunidad, invitando a que el cliente visualice ese escenario como posible y deseable.';
const titleNuestraSolucion = 'Mostrar cómo Bancolombia con sus atributos únicos es el indicado para permitir la implementación del plan acordado en el punto anterior. Este es el momento para hablar de los productos y servicios que ofrecemos.';


class Challenger extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {clientInformacion} = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        if (_.isEmpty(infoClient)) {
            redirectUrl("/dashboard/clientInformation");
        }
    }

    _seletedTabActive(tabSelect, e) {
        switch (tabSelect) {
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

    render() {
        const {
            acondicionamiento, acondicionamientoTouch, acondicionamientoError, onChangeAcondicionamiento,
            replanteamiento, replanteamientoTouch, replanteamientoError, onChangeReplanteamiento,
            ahogamiento, ahogamientoTouch, ahogamientoError, onChangeAhogamiento,
            impacto, impactoTouch, impactoError, onChangeImpacto,
            nuevoModo, nuevoModoTouch, nuevoModoError, onChangeNuevoModo,
            nuestraSolucion, nuestraSolucionTouch, nuestraSolucionError, onChangeNuestraSolucion,
            disabled
        } = this.props;
        const readOnly = !_.isEmpty(disabled);
        return (
            <div className="ui styled accordion" style={{width: "100%"}}>
                <div className="title acondicionamiento active"
                     style={acondicionamientoError !== null && acondicionamientoTouch ? {backgroundColor: '#FFEAEA'} : {}}
                     onClick={this._seletedTabActive.bind(this, 1)}>
                    <i className="dropdown icon"></i> Acondicionamiento (<span style={{color: "red"}}>*</span>)
                    <ToolTip text={titleAcondicionamiento}>
                        <i className="help circle icon blue" style={{cursor: "pointer", marginLeft: "5px"}}/>
                    </ToolTip>
                </div>
                <div className="content acondicionamiento active">
                    <RichText
                        value={acondicionamiento}
                        touched={acondicionamientoTouch}
                        error={acondicionamientoError}
                        onChange={onChangeAcondicionamiento}
                        name="targetPrevisit"
                        style={{width: '100%', height: '130pt', marginBottom: '10pt'}}
                        placeholder="Ingrese un valor..."
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
                <div className="title replanteamiento"
                     style={replanteamientoError !== null && replanteamientoTouch ? {backgroundColor: '#FFEAEA'} : {}}
                     onClick={this._seletedTabActive.bind(this, 2)}>
                    <i className="dropdown icon"></i> Replanteamiento (<span style={{color: "red"}}>*</span>)
                    <ToolTip text={titleReplanteamiento}>
                        <i className="help circle icon blue" style={{cursor: "pointer", marginLeft: "5px"}}/>
                    </ToolTip>
                </div>
                <div className="content replanteamiento">
                    <RichText
                        value={replanteamiento}
                        touched={replanteamientoTouch}
                        error={replanteamientoError}
                        onChange={onChangeReplanteamiento}
                        name="replanteamiento"
                        style={{width: '100%', height: '130pt', marginBottom: '10pt'}}
                        placeholder="Ingrese un valor..."
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
                <div className="title ahogamiento"
                     style={ahogamientoError !== null && ahogamientoTouch ? {backgroundColor: '#FFEAEA'} : {}}
                     onClick={this._seletedTabActive.bind(this, 3)}>
                    <i className="dropdown icon"></i> Ahogamiento racional (<span style={{color: "red"}}>*</span>)
                    <ToolTip text={titleAhogamiento}>
                        <i className="help circle icon blue" style={{cursor: "pointer", marginLeft: "5px"}}
                           title={titleAhogamiento}/>
                    </ToolTip>
                </div>
                <div className="content ahogamiento">
                    <RichText
                        value={ahogamiento}
                        touched={ahogamientoTouch}
                        error={ahogamientoError}
                        onChange={onChangeAhogamiento}
                        name="ahogamiento"
                        style={{width: '100%', height: '130pt', marginBottom: '10pt'}}
                        placeholder="Ingrese un valor..."
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
                <div className="title impacto"
                     style={impactoError !== null && impactoTouch ? {backgroundColor: '#FFEAEA'} : {}}
                     onClick={this._seletedTabActive.bind(this, 4)}>
                    <i className="dropdown icon"></i> Impacto emocional (<span style={{color: "red"}}>*</span>)
                    <ToolTip text={titleImpacto}>
                        <i className="help circle icon blue" style={{cursor: "pointer", marginLeft: "5px"}}/>
                    </ToolTip>
                </div>
                <div className="content impacto">
                    <RichText
                        value={impacto}
                        touched={impactoTouch}
                        error={impactoError}
                        onChange={onChangeImpacto}
                        name="impacto"
                        style={{width: '100%', height: '130pt', marginBottom: '10pt'}}
                        placeholder="Ingrese un valor..."
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
                <div className="title nuevoModo"
                     style={nuevoModoError !== null && nuevoModoTouch ? {backgroundColor: '#FFEAEA'} : {}}
                     onClick={this._seletedTabActive.bind(this, 5)}>
                    <i className="dropdown icon"></i> Nuevo modo (<span style={{color: "red"}}>*</span>)
                    <ToolTip text={titleNuevoModo}>
                        <i className="help circle icon blue" style={{cursor: "pointer", marginLeft: "5px"}}/>
                    </ToolTip>
                </div>
                <div className="content nuevoModo">
                    <RichText
                        value={nuevoModo}
                        touched={nuevoModoTouch}
                        error={nuevoModoError}
                        onChange={onChangeNuevoModo}
                        name="nuevoModo"
                        title="La longitud máxima de caracteres es de 3500"
                        style={{width: '100%', height: '130pt', marginBottom: '10pt'}}
                        placeholder="Ingrese un valor..."
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
                <div className="title solucion"
                     style={nuestraSolucionError !== null && nuestraSolucionTouch ? {backgroundColor: '#FFEAEA'} : {}}
                     onClick={this._seletedTabActive.bind(this, 6)}>
                    <i className="dropdown icon"></i> Nuestra solución (<span style={{color: "red"}}>*</span>)
                    <ToolTip text={titleNuestraSolucion}>
                        <i className="help circle icon blue" style={{cursor: "pointer", marginLeft: "5px"}}/>
                    </ToolTip>
                </div>
                <div className="content solucion">
                    <RichText
                        value={nuestraSolucion}
                        touched={nuestraSolucionTouch}
                        error={nuestraSolucionError}
                        onChange={onChangeNuestraSolucion}
                        name="nuestraSolucion"
                        style={{width: '100%', height: '130pt', marginBottom: '10pt'}}
                        placeholder="Ingrese un valor..."
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

function mapStateToProps({clientInformacion}, ownerProps) {
    return {
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Challenger);
