import React from 'react';
import { isEmpty } from 'lodash';
import { Row, Col } from 'react-flexbox-grid';

import Input from '../../ui/input/inputComponent';

const styles = {
    buttonsDiv: {
        marginTop: "auto"
    }
}

export function renderFields(fields, onChange, onAddElement, onCancel) {
    return (
        <div>
            <Row>
                <Col md={8} sm={12}>
                    <dt><span>Estrategia</span></dt>
                    <Input
                        onChangeEvent={onChange}
                        nameInput="value"
                        value={fields["value"] || ""}
                    />
                </Col>
                <Col md={4} sm={12} style={styles.buttonsDiv}>
                    <div style={styles.buttonsDiv}>
                        <button style={{ marginRight: "15px" }} className="btn btn-secondary" type="button" onClick={onAddElement}>Agregar</button>
                        <button className="btn btn-primary" type="button" onClick={onCancel}>Cancelar</button>
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
                    <div className="section-list-divider" style={{padding: "10px"}}>
                    <Row>
                        <Col md={1}>
                            <i
                                className="zoom icon"
                                title="Editar Objetivo"
                                style={{ cursor: "pointer" }}
                                onClick={() => editElement(element)}
                            />
                        </Col>
                        <Col md={10}>
                            {element.value}
                        </Col>
                        <Col md={1}>
                            <i
                                className="trash icon"
                                title="Eliminar Objetivo"
                                style={{ cursor: "pointer" }}
                                onClick={() => removeElement(element)}
                            />
                        </Col>
                    </Row>
                    </div>
                </Col>
                
            ))}
            </Row>
        </div >
    )
}