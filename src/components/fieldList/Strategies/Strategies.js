import React from 'react';
import { isEmpty } from 'lodash';
import { Row, Col } from 'react-flexbox-grid';

import TextArea from '../../../ui/textarea/textareaComponent';

const styles = {
    buttonsDiv: {
        marginTop: "auto"
    }
}

const helpText = "¿Que estrategias esta implementando el cliente para cumplir sus objetivos?"

export function renderFields({ fields, onChange, onAddElement, onCancel, isEditing, errors }) {
    return (
        <div>
            <Row>
                <Col md={8} sm={12}>
                    <dt><span>{helpText}</span></dt>
                    <TextArea
                        onChangeEvent={onChange}
                        nameInput="value"
                        value={fields["value"] || ""}
                        placeholder=""
                        rows={7}
                        max="700"
                        error={errors["value"]}
                        touched={true}
                    />
                </Col>
                <Col md={4} sm={12} style={styles.buttonsDiv}>
                    <div style={styles.buttonsDiv}>
                        <button style={{ marginRight: "5px" }} className="btn btn-secondary" type="button" onClick={onAddElement}>{isEditing ? "Modificar Estrategia" : "Agregar Estrategia"}</button>
                        <button className="btn cancel-btn" type="button" onClick={onCancel}>Cancelar</button>
                    </div>

                </Col>
            </Row>
        </div>
    )
}

export function renderElements(elements, removeElement, editElement) {

    if (isEmpty(elements)) {
        return (
            <div>
                Sin estrategias
            </div>
        )
    }

    return (
        <div>
            <Row>
                {elements.map((element) => (
                    <Col md={12} >
                        <div className="section-list-divider" style={{ padding: "10px" }}>
                            <Row>
                                <Col md={1}>
                                    {element.status !== -1 && <i
                                        className="edit icon"
                                        title="Editar Objetivo"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => editElement(element)}
                                    />}
                                </Col>
                                <Col md={10} className="add-line-break">
                                    {element.value}
                                </Col>
                                <Col md={1}>
                                    {element.status !== -1 && <i
                                        className="trash icon"
                                        title="Eliminar Objetivo"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => removeElement(element)}
                                    />}
                                </Col>
                            </Row>
                        </div>
                    </Col>
                ))}
            </Row>
        </div >
    )
}