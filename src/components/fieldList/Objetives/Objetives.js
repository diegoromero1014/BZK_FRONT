import React from "react";
import Modal from 'react-modal';
import { Row, Col } from 'react-flexbox-grid';

import Title from '../../clientEdit/sections/title';
import TextArea from '../../../ui/textarea/textareaComponent'
import makeFieldList from '../makeFieldList';
import ObjetiveSchema from './ObjetiveSchema';
import StrategySchema from '../Strategies/schema';

import {
    renderFields as renderStrategyFields,
    renderElements as renderStrategyElements
} from '../Strategies/Strategies';

const ListaObjetivos = makeFieldList("objectives", [{ name: "strategies", alias: "strategies", initialValues: {value: ""} }]);
const ListaEstrategias = makeFieldList("strategies");

const styles = {
    main: {
        padding: "0px 10px 10px 20px",
        marginTop: "15px"
    },
    buttonsDiv: {
        margin: "20px 0 20px 0"
    }
}

const helpText = "¿A donde quiere llegar el cliente? ¿Como se visualiza en algunos años?";

const objectivesInitialValues = {
    value: ""
}

const strategiesInitialValues = {
    value: ""
}

export default class Objetivos extends React.Component {
    render() {
        return (
            <div style={styles.main} id="objetivos">
                <ListaObjetivos
                    renderTitle={
                        <Title
                            text="Objetivos del cliente"
                            icon={<i className="users icon" style={{ fontSize: "25px" }} />}
                            helpText={helpText}
                        />
                    }
                    initialValues={objectivesInitialValues}
                    schema={ObjetiveSchema}
                    title={"Objetivos"}
                    maxLength={3}
                    renderAddSection={({fields, onChange, onAddElement, onCancel, isEditing, errors}) => (
                        <Row>
                            <Modal isOpen={true} className="modalBt3-fade modal fade contact-detail-modal in">
                                <div className="modalBt4-dialog modalBt4-lg">
                                    <div className="modalBt4-content modal-content">
                                        <div className="modalBt4-header modal-header">
                                            <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Objetivos del cliente</h4>
                                            <button type="button" onClick={onCancel} className="close" data-dismiss="modal" role="close">
                                                <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                                <span className="sr-only">Close</span>
                                            </button>
                                        </div>
                                        <div style={{ padding: "15px" }}>
                                            <Col md={12} sm={9} >
                                                <div>
                                                    <dt><span>{helpText} (<span style={{color: 'red'}}>*</span>)</span></dt>
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
                                                            <Title
                                                                text="Estrategias"
                                                                icon={<i className="users icon" style={{ fontSize: "25px" }} />}
                                                                isSection={false}
                                                            />
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
                                                    <button style={{ marginRight: "15px" }} className="btn btn-secondary save-btn" type="button" onClick={onAddElement}>{isEditing ? "Guardar" : "Agregar"}</button>
                                                    <button className="btn btn-primary cancel-btn" type="button" onClick={onCancel}>Cancelar</button>
                                                </div>
                                            </Col>
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        </Row>
                    )}
                    listenAddSection={this.listenAddSection}
                    renderElement={renderElements}
                    shouldRenderAddCancelButton={false}
                />
            </div>
        )
    }
}

export function renderElements(elements, removeElement, editElement) {
    return (
        <div >
            {elements.map((objetivo) => (
                <Row className="row-element" style={{margin: "5px"}}>
                    <Col xs={12} style={{}}>
                        <div className="element-buttons" style={{
                            height: "100%",
                            width: "50px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            alignItems: "center",
                            backgroundColor: "#E6E6E6",
                            borderRadius: "3px",
                            float: "left"
                        }}>
                            <i
                                className="zoom icon"
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

                        </div><div style={{display: "block"}}>
                            <Row>
                                <Col md={12} sm={12}>
                                    <Row>
                                        <Col md={6} sm={12} style={{ display: "flex" }}>
                                            <Title
                                                text="Objetivo"
                                                isSection={false}
                                                helpText={helpText}
                                            />
                                        </Col>
                                        <Col md={6} sm={12}>
                                            <Title
                                                text="Estrategias"
                                                isSection={false}
                                                helpText="¿Que estrategias esta implementando el cliente para cumplir sus objetivos?"
                                            />
                                        </Col>
                                        <Col md={12}>
                                            <div className="section-list-divider" style={{}} >
                                                <Row>
                                                    <Col md={6} sm={12} style={{ display: "flex", padding: "10px", marginTop: "10px" }} >
                                                        <div style={{}}>

                                                        </div>
                                                        <div style={{}}>
                                                            <Row>

                                                                <Col md={12}>
                                                                    {objetivo.value}
                                                                </Col>

                                                            </Row>
                                                        </div>
                                                    </Col>
                                                    <Col md={6} sm={12}>
                                                        <div style={{ padding: "10px" }} className="section-list-parent">
                                                            {objetivo["strategies"] && objetivo["strategies"].map((strategy) => (
                                                                <Row className="section-list-divider">
                                                                    <div style={{ margin: "10px 0 10px 0" }}>
                                                                        <Col md={12}>
                                                                            {strategy.value}
                                                                        </Col>
                                                                    </div>
                                                                </Row>
                                                            ))}
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center" }}>

                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>

                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            ))}
        </div>
    )
}