import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { isEmpty, mapKeys } from 'lodash';

import ToolTipComponent from '../toolTip/toolTipComponent';
import { processRules } from '../../validationsFields/rulesField';


class ListOfElements extends React.Component {

    componentDidMount() {
        //const { setFields, initialValues } = this.props;
        //setFields(initialValues);
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
        addField(e.target.name, e.target.value);
    }

    checkValidations = () => {
        const { schema, fields, setListState } = this.props;
        const fieldErrors = processRules(fields, schema);
        let errors = []
        mapKeys(fieldErrors, (value, _) => {
            if (value) {
                errors.push(value);
            }
        })

        const isValid = errors.length === 0;

        setListState({
            errors: fieldErrors
        })
        return isValid;
    }

    addElement = () => {
        const { handleOnAdd, fields, setListState, updateElement } = this.props;

        if (typeof handleOnAdd === 'function') {
            handleOnAdd();
        }

        const isValid = this.checkValidations();

        if (isValid) {
            setListState({
                isEditing: false
            });
            updateElement(fields);
            this.toogleAddSection();
        }
    }

    removeElement = (elementToDelete) => {
        const { removeElement, swtShowMessage } = this.props;
        swtShowMessage(
            "warning",
            "Confirmar eliminación",
            "Señor usuario, ¿Esta seguro que desea eliminar este elemento?",
            {
                onConfirmCallback: () => {
                    removeElement(elementToDelete)
                },
                onCancelCallback: () => { }
            },
            {
                confirmButtonText: 'Confirmar'
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
                <button style={{ marginRight: "15px" }} className="btn btn-secondary" type="button" onClick={this.addElement}>{botonAddText}</button>
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
        const { shouldRenderAddCancelButton, fields, showAddSection, title } = this.props;
        return (
            <div>
                <div style={{ position: "relative", marginBottom: "25px" }}>
                    {this.props.renderTitle}
                    {!showAddSection && <div style={{ position: "absolute", top: "10px", right: "10px" }} >
                        <button className="btn" onClick={this.toogleAddSection}>
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
                            onCancel: this.toogleAddSection,
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