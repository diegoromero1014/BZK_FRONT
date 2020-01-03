import React from "react";
import Modal from 'react-modal';
import { Row, Col } from 'react-flexbox-grid';

import Title from '../clientEdit/sections/title';
import Input from '../../ui/input/inputComponent';
import TextArea from '../../ui/textarea/textareaComponent'
import makeFieldList from './makeFieldList';

import {
    renderFields as renderStrategyFields,
    renderElements as renderStrategyElements
} from './Estrategias';

const ListaObjetivos = makeFieldList("Objetivos", [{ name: "Estrategias", alias: "strategies" }]);
const ListaEstrategias = makeFieldList("Estrategias");

const styles = {
    main: {
        padding: "0px 10px 10px 20px",
        marginTop: "15px"
    },
    buttonsDiv: {
        margin: "20px 0 20px 0"
    }
}


export default class Objetivos extends React.Component {
    render() {
        return (
            <div style={styles.main}>
                <ListaObjetivos
                    renderTitle={
                        <Title
                            text="Objetivos del cliente"
                            icon={<i className="users icon" style={{ fontSize: "25px" }} />}
                        />
                    }
                    title={"Objetivos"}
                    renderAddSection={(fields, onChange, onAddElement, onCancel) => (
                        <Row>
                            <Modal isOpen={true} className="modalBt3-fade modal fade contact-detail-modal in">
                                <div className="modalBt4-dialog modalBt4-lg">
                                    <div className="modalBt4-content modal-content">
                                        <div className="modalBt4-header modal-header">
                                            <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Objetivos del cliente</h4>
                                        </div>
                                        <div style={{ padding: "10px" }}>
                                            <Col md={12} sm={9} >
                                                <div>
                                                    {/* <dt><span>Objetivo</span></dt> */}
                                                    <TextArea
                                                        placeholder="Objetivo"
                                                        onChangeEvent={onChange}
                                                        nameInput="nombre"
                                                        value={fields["nombre"] || ""}
                                                    />
                                                </div>
                                            </Col>

                                            <Col md={12}>
                                                <div style={styles.main} className="section-list-container" >
                                                    <ListaEstrategias
                                                        renderTitle={
                                                            <Title
                                                                text="Estrategias"
                                                                icon={<i className="users icon" style={{ fontSize: "25px" }} />}
                                                                isSection={false}
                                                            />
                                                        }
                                                        title="Estrategias"
                                                        renderAddSection={renderStrategyFields}
                                                        renderElement={renderStrategyElements}
                                                        shouldRenderAddCancelButton={false}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={12} style={styles.buttonsDiv}>
                                                <div style={styles.buttonsDiv}>
                                                    <button style={{ marginRight: "15px" }} className="btn btn-secondary" type="button" onClick={onAddElement}>Agregar</button>
                                                    <button className="btn btn-primary" type="button" onClick={onCancel}>Cancelar</button>
                                                </div>
                                            </Col>
                                        </div>
                                    </div>
                                </div>
                            </Modal></Row>
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
        <div>
            <Row>
                <Col md={6} sm={12}>
                    <Title
                        text="Objetivo"
                        isSection={false}
                    />
                </Col>
                <Col md={6} sm={12}>
                    <Title
                        text="Estrategias"
                        isSection={false}
                    />
                </Col>
            </Row>
            {elements.map((objetivo) => (
                <Row>
                    <Col md={12}>
                        <div className="section-list-divider" style={{ marginBottom: "1px solid bottom" }} >
                            <Row>
                                <Col md={1} sm={12} style={{ padding: "10px", marginTop: "10px" }}>
                                    <i
                                        className="zoom icon"
                                        title="Editar Objetivo"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => editElement(objetivo)}
                                    />
                                </Col>
                                <Col md={5} sm={12} >
                                    <div style={{ padding: "10px", marginTop: "10px" }}>
                                        <Row>

                                            <Col md={12}>
                                                {objetivo.nombre}
                                            </Col>

                                        </Row>
                                    </div>
                                </Col>
                                <Col md={5} sm={12}>
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
                                </Col>
                                <Col md={1} sm={12} style={{ padding: "10px", marginTop: "10px" }}>
                                    <i
                                        className="trash icon"
                                        title="Eliminar Objetivo"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => removeElement(objetivo)}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            ))}
        </div>
    )
}