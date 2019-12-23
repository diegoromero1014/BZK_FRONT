import React from 'react';

import ListOfElements from './ListOfElements';

export default class Padre extends React.Component {

    state = {
        elements : []
    }

    updateElements = (elements) => {
        this.setState({
            elements
        })
    }

    render() {
        return (
            <ListOfElements
                title="Titulo de la sección"
                renderAddSection={(fields, onChange) => (
                    <div>
                        <h2>Add Section</h2>
                        <div>
                            <label>Nombre</label>
                            <input
                                onChange={onChange}
                                name="nombre"
                                value={fields["nombre"] || ""}
                            ></input>
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                onChange={onChange}
                                name="email"
                                value={fields["email"] || ""}
                            ></input>
                        </div>
                        <br></br>
                    </div>
                )}
                elements={this.state.elements}
                updateElements={this.updateElements}
                renderElement={(elements, removeElement, editElement) => (
                    <ul>
                        {elements.map((element) => (
                            <div>
                                <span onClick={() => editElement(element)}>Editar</span>
                                <li>{element.nombre + " - " + element.email}</li>
                                <span onClick={() => removeElement(element)}>Eliminar</span>
                            </div>
                        ))}
                    </ul>
                )}
            />
        );
    }

}