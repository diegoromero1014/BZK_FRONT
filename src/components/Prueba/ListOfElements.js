import React from 'react';
import { uniqueId, isEmpty } from 'lodash';
import { Row, Col } from 'react-flexbox-grid';

import ToolTipComponent from '../tooltip/toolTipComponent';

class ListOfElements extends React.Component {

    state = {
        showAddSection: false,
        fields: {},
        isEditing: false
    }

    toogleAddSection = () => {
        const { listenAddSection } = this.props;
        if (typeof listenAddSection === 'function') {
            listenAddSection();
        }
        this.clearFields();
        this.setState({
            showAddSection: !this.state.showAddSection
        })
    }

    clearFields = () => {
        this.setState({
            fields: {}
        })
    }

    handleChange = (e) => {
        let newFields = Object.assign({}, this.state.fields, { [e.target.name]: e.target.value });
        this.setState({
            fields: newFields
        })
    }

    addIdToElement = (fields) => {
        let modifiedFiels = Object.assign({}, fields);
        if (!fields.hasOwnProperty("id")) {
            modifiedFiels["id"] = uniqueId();
        }
        return modifiedFiels;
    }

    mergeElements = (elements, newElement) => {
        const filterElements = elements.filter((element) => element.id !== newElement.id);
        return [...filterElements, newElement];
    }

    addElement = () => {
        const { updateElements, elements, handleOnAdd } = this.props;

        if (typeof handleOnAdd === 'function') {
            handleOnAdd();
        }

        if (isEmpty(this.state.fields)) {
            alert("Ingrese valores");
            return
        }

        const element = this.addIdToElement(this.state.fields);
        const newElements = this.mergeElements(elements, element);

        this.setState({
            isEditing: false
        })

        updateElements(newElements, element.id);
        this.toogleAddSection();
    }

    removeElement = (elementToDelete) => {
        const { updateElements } = this.props;
        updateElements(this.props.elements.filter(
            (element) => element.id != elementToDelete.id
        ));
    }

    editElement = (element) => {
        const { handleOnEdit } = this.props;
        if (typeof handleOnEdit === 'function') {
            handleOnEdit(element.id);
        }
        this.setState({
            fields: element,
            showAddSection: true,
            isEditing: true
        });
    }

    renderButtonsAddSection = () => {
        if (!this.state.showAddSection) {
            return;
        }

        const botonAddText = this.state.isEditing ? "Modificar" : "Agregar";

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
        const { shouldRenderAddCancelButton } = this.props;

        return (
            <div>
                <div style={{ position: "relative", marginBottom: "25px" }}>
                    {this.props.renderTitle}
                    {!this.state.showAddSection && <div style={{ position: "absolute", top: "10px", right: "10px" }} >
                        <button className="btn" onClick={this.toogleAddSection}>
                            <ToolTipComponent text="Agregar cliente principal">
                                <i className="plus white icon" style={{ padding: "3px 0 0 5px" }}></i>
                            </ToolTipComponent>
                        </button>
                    </div>}
                </div>
                {this.state.showAddSection && <Row>
                    <Col md={12} sm={12} >
                        {this.props.renderAddSection(this.state.fields, this.handleChange, this.addElement, this.toogleAddSection)}
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