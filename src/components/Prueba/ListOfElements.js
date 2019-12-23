import React from 'react';
import _ from 'lodash';

export default class ListOfElements extends React.Component {

    state = {
        showAddSection: false,
        fields: {}
    }
    
    toogleAddSection = () => {
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
            modifiedFiels["id"] = _.uniqueId();
        }
        return modifiedFiels;
    }

    mergeElements = (elements, newElement) => {
        const filterElements = elements.filter((element) => element.id !== newElement.id);
        return [...filterElements, newElement];
    }

    addElement = () => {
        const { updateElements, elements } = this.props;
        const element = this.addIdToElement(this.state.fields);
        const newElements = this.mergeElements(elements, element);

        updateElements(newElements);
        this.toogleAddSection();
    }

    removeElement = (elementToDelete) => {
        const { updateElements } = this.props;
        updateElements(this.props.elements.filter(
            (element) => element.id != elementToDelete.id
        ));
    }

    editElement = (element) => {
        this.toogleAddSection();
        this.setState({
            fields: element
        });
    }

    renderButtonsAddSection = () => {
        if (!this.state.showAddSection) {
            return;
        }
        return (
            <div>
                <button onClick={this.toogleAddSection}>Cancelar</button>
                <button onClick={this.addElement}>Agregar</button>
            </div>
        )
    }

    render() {
        const {elements, title} = this.props; 

        return (
            <div>
                <h1>{title}</h1>
                { !this.state.showAddSection && <button onClick={this.toogleAddSection} >Add</button>}
                { this.state.showAddSection && this.props.renderAddSection(this.state.fields, this.handleChange) }
                { this.renderButtonsAddSection() }
                { elements && elements.length > 0 && this.props.renderElement(elements, this.removeElement, this.editElement) }
            </div>
        )
        
    }

}