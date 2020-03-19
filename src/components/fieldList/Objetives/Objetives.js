import React from "react";

import { Row, Col } from 'react-flexbox-grid';

import BiztrackModal from './BiztrackModal';
import TextArea from '../../../ui/textarea/textareaComponent'
import ObjetiveSchema from './ObjetiveSchema';
import StrategySchema from '../Strategies/schema';
import TemplateObjectiveAndStrategies from './templateObjectiveAndStrategies';

import {
    renderFields as renderStrategyFields,
    renderElements as renderStrategyElements
} from '../Strategies/Strategies';

import {
    ListaEstrategias,
    ListaObjetivos,
    helpText,
    objectivesInitialValues,
    strategiesInitialValues,
    makeObjectiveSectionTitle,
    StrategieSectionTitle,
    styles
} from './utils'


const ObjectiveSectionTitle = makeObjectiveSectionTitle();


export default class Objetivos extends React.Component {
    render() {
        return (
            <div style={styles.main} id="objetivos">
                <ListaObjetivos
                    renderTitle={
                        ObjectiveSectionTitle
                    }
                    initialValues={objectivesInitialValues}
                    schema={ObjetiveSchema}
                    title={"Objetivos del cliente"}
                    maxLength={3}
                    renderAddSection={({ fields, onChange, onAddElement, onCancel, isEditing, errors }) => (
                        <BiztrackModal
                            onCancel={onCancel}
                            title={"Objetivos del cliente"}
                            body={
                                addObjectiveBody({ fields, onChange, onAddElement, onCancel, isEditing, errors })
                            }
                        />
                    )}
                    listenAddSection={this.listenAddSection}
                    renderElement={renderElements}
                    shouldRenderAddCancelButton={false}
                />
            </div>
        )
    }
}

export function addObjectiveBody({ fields, onChange, onAddElement, onCancel, isEditing, errors }) {
    return (
        <Row>
            <Col md={12} sm={9} >
                <div>
                    <dt><span>{helpText} (<span style={{ color: 'red' }}>*</span>)</span></dt>
                    <TextArea
                        placeholder=""
                        onChangeEvent={onChange}
                        nameInput="value"
                        value={fields["value"] || ""}
                        rows={7}
                        max="700"
                        error={errors["value"]}
                        touched={true}
                    />
                </div>
            </Col>

            <Col md={12}>
                <div style={styles.main} className="section-list-container" id="estrategias">
                    <ListaEstrategias
                        renderTitle={
                            StrategieSectionTitle
                        }
                        schema={StrategySchema}
                        initialValues={strategiesInitialValues}
                        title="Estrategias"
                        renderAddSection={renderStrategyFields}
                        renderElement={renderStrategyElements}
                        shouldRenderAddCancelButton={false}
                        maxLength={3}
                    />
                </div>
            </Col>
            <Col md={12} style={styles.buttonsDiv}>
                <div style={styles.buttonsDiv}>
                    <button style={{ marginRight: "15px" }} className="btn btn-secondary save-btn" type="button" onClick={onAddElement}>{isEditing ? "Modificar" : "Agregar"}</button>
                    <button className="btn btn-primary cancel-btn" type="button" onClick={onCancel}>Cancelar</button>
                </div>
            </Col>
        </Row>
    )
}

export function renderElements(elements, removeElement, editElement) {
    return (
        <div >
            {elements.map((objetivo) => (
                <TemplateObjectiveAndStrategies
                    buttons={
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            alignItems: "center"
                        }}>
                            <i
                                className="edit icon"
                                title="Editar Objetivo"
                                style={{ cursor: "pointer" }}
                                onClick={() => editElement(objetivo)}

                            />
                            <i
                                className="trash icon"
                                title="Eliminar Objetivo"
                                style={{ cursor: "pointer" }}
                                onClick={() => removeElement(objetivo)}

                            />
                        </div>
                    }
                    objetivo={objetivo}
                    strategies={objetivo["strategies"]}
                />
            ))}
        </div>
    )
}