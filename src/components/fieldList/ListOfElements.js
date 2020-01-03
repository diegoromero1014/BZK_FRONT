import React from 'react';
import { isEmpty } from 'lodash';
import { Row, Col } from 'react-flexbox-grid';

import ToolTipComponent from '../toolTip/toolTipComponent';

class ListOfElements extends React.Component {

    toogleAddSection = () => {
        const { listenAddSection, setListState, showAddSection } = this.props;
        if (typeof listenAddSection === 'function') {
            listenAddSection();
        }
        this.clearFields();
        setListState({
            showAddSection: !showAddSection
        });
    }

    clearFields = () => {
        const { setFields } = this.props;
        setFields({});
    }

    handleChange = (e) => {
        const { addField } = this.props;
        addField(e.target.name, e.target.value);
    }

    addElement = () => {
        const { handleOnAdd, fields, setListState, updateElement } = this.props;

        if (typeof handleOnAdd === 'function') {
            handleOnAdd();
        }

        if (isEmpty(fields)) {
            alert("Ingrese valores");
            return
        }

        setListState({
            isEditing: false
        })

        updateElement(fields);
        this.toogleAddSection();
    }

    removeElement = (elementToDelete) => {
        const { removeElement } = this.props;
        removeElement(elementToDelete)
    }

    editElement = (element) => {
        const { handleOnEdit } = this.props;
        handleOnEdit(element);
    }

    renderButtonsAddSection = () => {
        if (!this.props.showAddSection) {
            return;
        }

        const botonAddText = this.props.isEditing ? "Modificar" : "Agregar";

        return (
            <div>
                <button style={{ marginRight: "15px" }} className="btn btn-secondary" type="button" onClick={this.addElement}>Agregar</button>
                <button className="btn section-btn-cancel" type="button" onClick={this.toogleAddSection}>Cancelar</button>
            </div>
        )
    }

    renderElements = () => {
        const { elements, renderElement, title } = this.props;

        if (elements && elements.length) {
            return renderElement(elements, this.removeElement, this.editElement);
        }

        return (
            <Col xs={12} md={12} lg={12}>
                <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                    <span className="form-item">No se han adicionado {title} </span>
                </div>
            </Col>
        )

    }

    render() {
        const { shouldRenderAddCancelButton, fields, showAddSection } = this.props;
        return (
            <div>
                <div style={{ position: "relative", marginBottom: "25px" }}>
                    {this.props.renderTitle}
                    {!showAddSection && <div style={{ position: "absolute", top: "10px", right: "10px" }} >
                        <button className="btn" onClick={this.toogleAddSection}>
                            <ToolTipComponent text="Agregar cliente principal">
                                <i className="plus white icon" style={{ padding: "3px 0 0 5px" }}></i>
                            </ToolTipComponent>
                        </button>
                    </div>}
                </div>
                {showAddSection && <Row>
                    <Col md={12} sm={12} >
                        {this.props.renderAddSection(fields, this.handleChange, this.addElement, this.toogleAddSection)}
                    </Col>
                </Row>}
                {shouldRenderAddCancelButton && this.renderButtonsAddSection()}
                <div className="section-list-container" style={{ marginTop: "10px" }}>
                    {this.renderElements()}
                </div>
                
            </div>
        )
    }
}

ListOfElements.defaultProps = {
    shouldRenderAddCancelButton: true
}

export default ListOfElements;