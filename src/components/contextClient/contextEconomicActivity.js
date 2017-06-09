import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Textarea from '../../ui/textarea/textareaComponent';
import _ from 'lodash';
import ToolTipComponent from '../toolTip/toolTipComponent';
import { VALUE_REQUIERED } from '../../constantsGlobal';
import { stringValidate } from '../../actionsGlobal';

class ContextEconomicActivity extends Component {
    constructor(props) {
        super(props);
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
        const { contextClientField, data, isCheckbox, fieldRequiered } = this.props;
        return (
            <Col xs={12} md={12} lg={12}>
                <div style={{ marginTop: "15px", marginLeft: '20px', marginRight: '20px' }}>
                    <dt>
                        <span>Contexto</span>
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
                                error={!stringValidate(contextClientField.value) && fieldRequiered ? VALUE_REQUIERED : ''}
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

export default ContextEconomicActivity;