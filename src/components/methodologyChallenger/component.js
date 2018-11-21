import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';
import _ from "lodash";

import RichText from '../richText/richTextComponent';
import ToolTip from "../toolTip/toolTipComponent";

import { redirectUrl } from '../globalComponents/actions';

const titleClientTeach = 'Desarrolle la Investigación Mesurada: Construye el 333  y la DOFA. Luego, construya y valide su Insight Comercial Challenger y utilice la Coreografía Challenger para llevar un hilo conductor en el diálogo.';
const titleAdaptMessage = 'Considere las 4 esferas de la adaptación (Sector, Empresa, Cargo, Individuo) y trabaje ante los diferentes estilos sociales (Amable, Orientado a la acción, Analítico, Expresivo).';
const titleControlConversation = 'Conozca el Proceso de compra del cliente y use los verificadores (Binarios o tangibles) para entender si el cliente está tomando una decisión, enfatice las consecuencias negativas de mantenerse en el Status quo, aborde los asuntos relacionados con el dinero y enfrenta las objeciones.';
const titleConstructiveTension = 'Cree, observe, aumente y relaje la tensión, desarrolle la Investigación acotada: Preguntas y peticiones poderosas, analice los supuestos incorrectos y use de forma estratégica de silencio.';

class Challenger extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const { clientInformacion } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        if (_.isEmpty(infoClient)) {
            redirectUrl("/dashboard/clientInformation");
        }
    }

    _seletedTabActive(tabSelect, e) {
        switch (tabSelect) {
            case 2:
            $('.title.adaptMessage').toggleClass('active');
            $('.content.adaptMessage').toggleClass('active');
            break;
            case 3:
            $('.title.controlConversation').toggleClass('active');
            $('.content.controlConversation').toggleClass('active');
            break;
            case 4:
            $('.title.constructiveTension').toggleClass('active');
            $('.content.constructiveTension').toggleClass('active');
            break;
            case 5:
            $('.title.nuevoModo').toggleClass('active');
            $('.content.nuevoModo').toggleClass('active');
            break;
            case 6:
            $('.title.solucion').toggleClass('active');
            $('.content.solucion').toggleClass('active');
            break;
            case 1:
            default:
                $('.title.clientTeach').toggleClass('active');
                $('.content.clientTeach').toggleClass('active');
                break;
        }
    }

    render() {
        const {
            clientTeach, clientTeachTouch, clientTeachError, onChangeClientTeach, adaptMessage, adaptMessageTouch,
            adaptMessageError, onChangeAdaptMessage, controlConversation, controlConversationTouch,
            controlConversationError, onChangeControlConversation, constructiveTension, constructiveTensionTouch,
            constructiveTensionError, onChangeConstructiveTension, disabled
        } = this.props;

        const readOnly = !_.isEmpty(disabled);
        return (
            <div className="ui styled accordion" style={{ width: "100%" }}>
                <div className="title clientTeach active"
                    style={clientTeachError !== null && clientTeachTouch ? { backgroundColor: '#FFEAEA' } : {}}
                    onClick={this._seletedTabActive.bind(this, 1)}>
                    <i className="dropdown icon"></i>  ¿Qué le enseñará al cliente? (<span style={{ color: "red" }}>*</span>)
                    <ToolTip text={titleClientTeach}>
                        <i className="help circle icon blue" style={{ cursor: "pointer", marginLeft: "5px" }} />
                    </ToolTip>
                </div>
                <div className="content clientTeach active">
                    <RichText
                        value={clientTeach}
                        touched={clientTeachTouch}
                        error={clientTeachError}
                        onChange={onChangeClientTeach}
                        name="clientTeach"
                        style={{ width: '100%', height: '130pt', marginBottom: '10pt' }}
                        placeholder="Ingrese un valor..."
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
                <div className="title adaptMessage"
                    style={adaptMessageError !== null && adaptMessageTouch ? { backgroundColor: '#FFEAEA' } : {}}
                    onClick={this._seletedTabActive.bind(this, 2)}>
                    <i className="dropdown icon"></i> ¿Cómo adaptará el mensaje? (<span style={{ color: "red" }}>*</span>)
                    <ToolTip text={titleAdaptMessage}>
                        <i className="help circle icon blue" style={{ cursor: "pointer", marginLeft: "5px" }} />
                    </ToolTip>
                </div>
                <div className="content adaptMessage">
                    <RichText
                        value={adaptMessage}
                        touched={adaptMessageTouch}
                        error={adaptMessageError}
                        onChange={onChangeAdaptMessage}
                        name="adaptMessage"
                        style={{ width: '100%', height: '130pt', marginBottom: '10pt' }}
                        placeholder="Ingrese un valor..."
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
                <div className="title controlConversation"
                    style={controlConversationError !== null && controlConversationTouch ? { backgroundColor: '#FFEAEA' } : {}}
                    onClick={this._seletedTabActive.bind(this, 3)}>
                    <i className="dropdown icon"></i> ¿Cómo tomará el control de la conversación? (<span style={{ color: "red" }}>*</span>)
                    <ToolTip text={titleControlConversation}>
                        <i className="help circle icon blue" style={{ cursor: "pointer", marginLeft: "5px" }} />
                    </ToolTip>
                </div>
                <div className="content controlConversation">
                    <RichText
                        value={controlConversation}
                        touched={controlConversationTouch}
                        error={controlConversationError}
                        onChange={onChangeControlConversation}
                        name="controlConversation"
                        style={{ width: '100%', height: '130pt', marginBottom: '10pt' }}
                        placeholder="Ingrese un valor..."
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
                <div className="title constructiveTension"
                    style={constructiveTensionError !== null && constructiveTensionTouch ? { backgroundColor: '#FFEAEA' } : {}}
                    onClick={this._seletedTabActive.bind(this, 4)}>
                    <i className="dropdown icon"></i> ¿Cómo generará tensión constructiva? (<span style={{ color: "red" }}>*</span>)
                    <ToolTip text={titleConstructiveTension}>
                        <i className="help circle icon blue" style={{ cursor: "pointer", marginLeft: "5px" }} />
                    </ToolTip>
                </div>
                <div className="content constructiveTension">
                    <RichText
                        value={constructiveTension}
                        touched={constructiveTensionTouch}
                        error={constructiveTensionError}
                        onChange={onChangeConstructiveTension}
                        name="constructiveTension"
                        style={{ width: '100%', height: '130pt', marginBottom: '10pt' }}
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

function mapStateToProps({ clientInformacion }, ownerProps) {
    return {
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Challenger);