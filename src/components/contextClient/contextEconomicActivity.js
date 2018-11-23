import React, { Component, PropTypes } from 'react';
import { Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import Textarea from '../../ui/textarea/textareaComponent';
import _ from 'lodash';
import ToolTipComponent from '../toolTip/toolTipComponent';
import {
    REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT
} from '../../constantsGlobal';
import { ORIGIN_CREDIT_STUDY } from '../clients/creditStudy/constants';
import { MESSAGE_CONTEXT } from './constants';


class ContextEconomicActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldUpdate: false
        }
    }

    elementMessageContext() {
        return <div style={{ textAlign: 'justify' }}>
            <span style={{ color: 'white' }}>Diligencie esta sección respondiendo a la pregunta ¿qué debería conocer el Grupo Bancolombia de este cliente? Recuerde que debe incluir puntos tales como:</span>
            <ul>
                <li>¿Quién es? - ¿Qué hace? - Trayectoria - Estrategia de la compañía - Productos - Mercado objetivo - Proyectos a desarrollar</li>
            </ul>
            <span style={{ color: 'white' }}>Igualmente hacer énfasis en el carácter de:</span>
            <ul>
                <li>Administración - Junta directiva - Línea de sucesión - Gobierno corporativo - Otros aspectos que considere relevantes</li>
            </ul>
        </div>
    }

    render() {
        const { contextClientField, origin } = this.props;
        return (
            <Col xs={12} md={12} lg={12} onBlur={() => this.setState({ shouldUpdate: !this.state.shouldUpdate })}>
                <div style={{ marginTop: "15px", marginLeft: '20px', marginRight: '20px' }}>
                    <dt>
                        <span>Contexto </span>
                        {origin === ORIGIN_CREDIT_STUDY &&
                            <div style={{ display: "inline" }}>
                                (<span style={{ color: "red" }}>*</span>)
                            </div>
                        }
                        <ToolTipComponent text={MESSAGE_CONTEXT}>
                            <i style={{ marginLeft: "5px", cursor: "pointer", fontSize: "16px" }}
                                className="help circle icon blue" />
                        </ToolTipComponent>
                    </dt>
                    <ToolTipComponent text={this.elementMessageContext()} position="right center" action="focus" size="tiny"
                        children={
                            <Textarea
                                name="contextClientField"
                                validateEnter={true}
                                type="text"
                                style={{ width: '100%' }}
                                max="5000"
                                rows={7}
                                placeholder="Ingrese el contexto del cliente"
                                {...contextClientField}
                                touched={true}
                            />
                        } />
                </div>
            </Col>
        );
    }
}

ContextEconomicActivity.PropTypes = {
    contextClientField: PropTypes.object.isRequired
}



function mapStateToProps({ clientInformacion }, ownerProps) {
    return {
        clientInformacion
    };
}

export default connect(mapStateToProps)(ContextEconomicActivity);
