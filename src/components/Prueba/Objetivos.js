import React from "react";
import { find } from 'lodash';
import { Row, Col } from 'react-flexbox-grid';

import ListOfElements from './ListOfElements';
import Title from '../clientEdit/sections/title';
import Input from '../../ui/input/inputComponent';

import {
    renderFields as renderStrategyFields,
    renderElements as renderStrategyElements
} from './Estrategias';


const styles = {
    main: {
        padding: "0px 10px 10px 20px",
        marginTop: "15px"
    },
    buttonsDiv: {
        marginTop: "auto"
    }
}


export default class Objetivos extends React.Component {
    state = {
        selectedId: null,
        elements: [],
        strategies: []
    }

    findById = (elements, elementId) => {
        return find(elements, ({ id }) => id == elementId);
    }

    updateElements = (elements, elementId) => {
        let element = this.findById(elements, elementId);
        if (element) {
            element["strategies"] = this.state.strategies;
        }
        this.setState({
            elements
        })
    }

    updateStrategies = (strategies) => {
        this.setState({
            strategies
        })
    }

    listenAddSection = () => {
        this.setState({
            strategies: []
        })
    }

    handleOnEdit = (id) => {
        let element = this.findById(this.state.elements, id);
        this.setState({
            strategies: element.strategies
        })
    }

    render() {
        return (
            <div style={styles.main}>
                <ListOfElements
                    renderTitle={
                        <Title
                            text="Objetivos del cliente"
                            icon={<i className="users icon" style={{ fontSize: "25px" }} />}
                        />
                    }
                    title={"Objetivos"}
                    renderAddSection={(fields, onChange, onAddElement, onCancel) => (
                        <Row>
                            <Col md={9} sm={12} >
                                <div>
                                    <dt><span>Objetivo</span></dt>
                                    <Input
                                        onChangeEvent={onChange}
                                        nameInput="nombre"
                                        value={fields["nombre"] || ""}
                                    />
                                </div>
                            </Col>
                            <Col md={3} sm={12} style={styles.buttonsDiv}>
                                <div style={styles.buttonsDiv}>
                                    <button style={{ marginRight: "15px" }} className="btn btn-secondary" type="button" onClick={onAddElement}>Agregar</button>
                                    <button className="btn btn-primary" type="button" onClick={onCancel}>Cancelar</button>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div style={styles.main} className="section-list-container" >
                                    <ListOfElements
                                        renderTitle={
                                            <Title
                                                text="Estrategias"
                                                icon={<i className="users icon" style={{ fontSize: "25px" }} />}
                                                isSection={false}
                                            />
                                        }
                                        title="Estrategias"
                                        renderAddSection={renderStrategyFields}
                                        elements={this.state.strategies}
                                        updateElements={this.updateStrategies}
                                        renderElement={renderStrategyElements}
                                        shouldRenderAddCancelButton={false}
                                    />
                                </div>
                            </Col>
                        </Row>
                    )}
                    handleOnEdit={this.handleOnEdit}
                    listenAddSection={this.listenAddSection}
                    elements={this.state.elements}
                    updateElements={this.updateElements}
                    renderElement={renderElements}
                    shouldRenderAddCancelButton={false}
                />
            </div>
        )
    }
}

export function renderElements(elements, removeElement, editElement) {

    console.log(elements);

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
                        <div className="section-list-divider" style={{marginBottom: "1px solid bottom"}} >
                            <Row>
                                <Col md={6} sm={12} >
                                    <div style={{padding: "10px", marginTop: "10px"}}>
                                        <Row>
                                            <Col md={1}>
                                                <i
                                                    className="zoom icon"
                                                    title="Editar Objetivo"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => editElement(objetivo)}
                                                />
                                            </Col>
                                            <Col md={10}>
                                                {objetivo.nombre}
                                            </Col>
                                            <Col md={1}>
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
                                <Col md={6} sm={12}>
                                    <div style={{padding: "10px"}} className="section-list-parent">
                                        {objetivo["strategies"] && objetivo["strategies"].map((strategy) => (
                                            <Row className="section-list-divider">
                                                <div style={{margin: "10px 0 10px 0"}}>
                                                <Col md={12}>
                                                    {strategy.value}
                                                </Col>
                                                </div>
                                            </Row>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            ))}
        </div>
    )
}