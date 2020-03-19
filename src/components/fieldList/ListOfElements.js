import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

import ToolTipComponent from '../toolTip/toolTipComponent';
import { elementsKey, validateSchema } from './Objetives/utils';


class ListOfElements extends React.Component {


    canAddElement = () => {
        const { elements, maxLength, swtShowMessage, title } = this.props;
        const isValid = elements && (elements.length < maxLength);

        if (!isValid) {
            swtShowMessage("warning", "Atención", "Señor usuario, el número máximo de " + title + " permitidas son "+maxLength);
        }

        return isValid;
    }

    openAddElement = () => {    
        if (this.canAddElement()) {
            this.toogleAddSection();
        }
    }

    handleCancel = () => {
        const { setListState } = this.props;
        setListState({
            isEditing: false
        });
        this.toogleAddSection();
    }

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
        const { setFields, initialValues } = this.props;
        setFields(initialValues);
    }

    handleChange = (e) => {
        const { addField } = this.props;
        addField(e.target.name, e.target.value.trim());
    }

    checkValidations = () => {
        const { schema, fields, setListState } = this.props;
        
        const [errors, fieldErrors] = validateSchema(fields, schema);

        const isValid = errors.length === 0;

        setListState({
            errors: fieldErrors
        })
        return isValid;
    }

    addElement = () => {
        const { handleOnAdd, fields, setListState, updateElement, isEditing } = this.props;

        //Solo validar al momento de crear
        if (!isEditing && !this.canAddElement()) {
            return;
        }

        if (typeof handleOnAdd === 'function') {
            handleOnAdd();
        }

        const isValid = this.checkValidations();

        if (isValid) {
            setListState({
                isEditing: false
            });
            //Marcar que el elemento cambio
            fields.didChange = true;
            updateElement(elementsKey);
            this.toogleAddSection();
        }
    }

    removeElement = (elementToDelete) => {
        const { removeElement, swtShowMessage, title } = this.props;
        swtShowMessage(
            "warning",
            "Confirmar eliminación",
            `Señor usuario, ¿Esta seguro que desea eliminar ${title}?`,
            {
                onConfirmCallback: () => {
                    removeElement(elementToDelete)
                },
                onCancelCallback: () => { }
            },
            {
                confirmButtonText: 'Sí, estoy seguro!',
                confirmButtonColor:'#DD6B55'
            }
        );
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
                <button style={{ marginRight: "15px" }} className="btn btn-secondary section-btn-save" type="button" onClick={this.addElement}>{botonAddText}</button>
                <button className="btn section-btn-cancel" type="button" onClick={this.handleCancel}>Cancelar</button>
            </div>
        )
    }

    renderElements = () => {
        const { elements, renderElement, title } = this.props;
        if (elements && elements.length) {
            return renderElement(elements, this.removeElement, this.editElement);
        }

        return (
            <Col xs={12} md={12} lg={12} className="elements-not-found">
                <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                    <span className="form-item">No se han adicionado {title} </span>
                </div>
            </Col>
        )

    }

    render() {
        const { shouldRenderAddCancelButton, fields, showAddSection, title } = this.props;
        return (
            <div>
                <div style={{ position: "relative", marginBottom: "25px" }}>
                    {this.props.renderTitle}
                    {!showAddSection && <div className="add-section" style={{ position: "absolute", top: "10px", right: "10px" }} >
                        <button className="btn" onClick={this.openAddElement} type="button">
                            <ToolTipComponent text={"Agregar " + title}>
                                <i className="plus white icon" style={{ padding: "3px 0 0 5px" }}></i>
                            </ToolTipComponent>
                        </button>
                    </div>}
                </div>
                {showAddSection && <Row>
                    <Col md={12} sm={12} >
                        {this.props.renderAddSection({
                            fields,
                            onChange: this.handleChange,
                            onAddElement: this.addElement,
                            onCancel: this.handleCancel,
                            isEditing: this.props.isEditing,
                            errors: this.props.errors || {}
                        })
                        }
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