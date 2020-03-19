import React from 'react';
import { Icon } from 'semantic-ui-react'

import {
    makeObjectiveSectionTitle,
    styles,
    elementsKey,
    draftElementsKey,
    validateSchema
} from './utils';
import TemplateObjectiveAndStrategies from './templateObjectiveAndStrategies';
import ToolTip from '../../toolTip/toolTipComponent';
import BiztrackModal from '../Objetives/BiztrackModal';

import { addObjectiveBody } from './Objetives';
import schema from './ObjetiveSchema';
import Message from '../../message';

const ObjectiveSectionTitle = makeObjectiveSectionTitle(true)

export default class AssociateObjectives extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showAddSection: false
        }

        this.showAssociateSection = this.showAssociateSection.bind(this);
        this.associateElements = this.associateElements.bind(this);
        this.checkDraftElement = this.checkDraftElement.bind(this);
        this.checkElement = this.checkElement.bind(this);
        this.hideAssociateSection = this.hideAssociateSection.bind(this);
        this.renderElements = this.renderElements.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnAdd = this.handleOnAdd.bind(this);
        this.showEditSection = this.showEditSection.bind(this);
        this.clearFields = this.clearFields.bind(this);
        this.handleOnRemoveElement = this.handleOnRemoveElement.bind(this);
    }


    //TODO: LLamar variable MYID. Verificar que los registros del server se les agregue el ID
    changeAssociationOfElements(elements, changedElement) {
        return elements.map((element) => {
            if (element["fieldlist-id"] == changedElement["fieldlist-id"]) {
                return Object.assign({}, element, {
                    associated: !element.associated,
                    strategies: element.strategies.map((strategy) => Object.assign({}, strategy, {
                        associated: !element.associated
                    }))
                })
            }
            return element
        })
    }

    checkDraftElement(elements, changedElement) {
        const { changeListState } = this.props;
        changeListState({
            draftElements: this.changeAssociationOfElements(elements, changedElement)
        });
    }

    checkElement(_, changedElement) {
        const { elements, swtShowMessage, changeListState } = this.props;
        swtShowMessage(
            "warning",
            "Confirmar desasociación",
            `Señor usuario, ¿está seguro que desea desasociar el Objetivo del cliente?`,
            {
                onConfirmCallback: () => {
                    changeListState({
                        elements: this.changeAssociationOfElements(elements, changedElement)
                    })
                },
                onCancelCallback: () => { }
            },
            {
                confirmButtonText: 'Sí, estoy seguro!',
                confirmButtonColor: '#DD6B55'
            }
        );
    }

    handleOnRemoveElement(element) {

        const {removeElement, swtShowMessage} = this.props;

        swtShowMessage(
            "warning",
            "Confirmar eliminación",
            `Señor usuario, ¿Esta seguro que desea eliminar este Objetivo del cliente?`,
            {
                onConfirmCallback: () => {
                    removeElement(element, draftElementsKey);
                },
                onCancelCallback: () => { }
            },
            {
                confirmButtonText: 'Sí, estoy seguro!',
                confirmButtonColor:'#DD6B55'
            }
        );

    }

    renderElements(checkedFunction, filterAssociatedElements, elements = [], canEdit) {

        const { isEditable, editElement } = this.props;

        return elements.map(
            (element) => (
                <TemplateObjectiveAndStrategies
                    buttons={
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            alignItems: "center"
                        }}>
                            {canEdit && element.status !== -1 && <i
                                className="edit icon"
                                title="Editar Objetivo"
                                style={{ cursor: "pointer", marginLeft: "5px" }}
                                onClick={() => editElement(element)}
                            />}
                            <input
                                onChange={() => checkedFunction(elements, element)}
                                type="checkbox"
                                checked={element.associated}
                                name="example"
                                disabled={!isEditable}
                            />
                            {canEdit && element.status !== -1 && <i
                                className="trash icon"
                                title="Eliminar Objetivo"
                                style={{ cursor: "pointer", marginLeft: "5px" }}
                                onClick={() => this.handleOnRemoveElement(element)}
                            />}
                        </div>
                    }
                    objetivo={element}
                    strategies={filterAssociatedElements(element["strategies"])}
                />
            )
        )
    }

    showEditSection() {

        const { draftElements, swtShowMessage, changeListState } = this.props;

        if (draftElements.filter(element => element.status !== -1).length == 3) {
            swtShowMessage("warning", "Alerta", "Señor usuario, Señor usuario, el número máximo de Objetivos del cliente permitidos son 3");
            return;
        }

        changeListState({
            showAddSection: true
        })
    }

    showAssociateSection() {
        const { elements, changeListState } = this.props;

        if (!elements.length) {
            this.setState({
                showAddSection: true
            })
            return;
        }

        changeListState({
            draftElements: [...elements],
            showAssociateSection: true
        });
    }

    hideAssociateSection() {
        const { changeListState } = this.props;
        this.clearFields()
        changeListState({
            showAssociateSection: false
        })
    }

    associateElements() {
        const { changeListState, draftElements, swtShowMessage } = this.props;

        const checkedElements = draftElements.filter(this.filterCheckedElements).length;

        if (checkedElements > 3) {
            swtShowMessage("warning", "Alerta", "Señor usuario, solo puede asociar un maximo de 3 Objetivos del cliente.");
            return;
        }

        changeListState({
            elements: [...draftElements],
            showAssociateSection: false
        })
    }

    filterCheckedElements(element) {
        return element.associated;
    }

    handleChange(e) {
        const { addField } = this.props;
        addField(e.target.name, e.target.value.trim());
    }

    clearFields() {
        const { initialValues, setFields, changeListState } = this.props;
        setFields(initialValues);
        changeListState({
            showAddSection: false
        })
        this.setState({
            showAddSection: false
        })
    }

    handleOnAdd(key) {

        const { updateElement, listState, changeListState, addField } = this.props;

        const clearFields = this.clearFields;

        return function () {

            const [errors, fieldErrors] = validateSchema(listState.fields, schema);

            changeListState({
                errors: fieldErrors
            });

            if (errors.length > 0) {
                return;
            }

            addField("associated", true);

            updateElement(key);

            clearFields();
        }

    }

    render() {

        const {
            elements,
            showAssociateSection,
            draftElements,
            isEditable,
            listState
        } = this.props;

        const filteredElements = elements.filter(this.filterCheckedElements);

        return (
            <div>
                {isEditable && <div style={{ position: "relative", marginBottom: "25px" }}>
                    <div className="add-section" style={{ position: "absolute", top: "10px", right: "10px" }} >
                        <ToolTip text={"Asociar Objetivos"}>
                            <Icon
                                className='icon-message-elements'
                                size='huge'
                                name={'add square'}
                                style={{ color: '#16498b', fontSize: '34pt !important', margin: '0px 20px 10px 20px', cursor: 'pointer' }}
                                onClick={this.showAssociateSection}
                            />
                        </ToolTip>
                    </div>
                </div>}
                <div style={styles.main} className='container-associate-objetives'>
                    {ObjectiveSectionTitle}
                    {this.renderElements(this.checkElement, (list) => list.filter((el) => el.associated), filteredElements)}
                    {!filteredElements.length && !this.state.showAddSection && <div className="elements-not-found">
                        <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                            <span className="form-item">No se han asociado Objetivos del cliente</span>
                        </div>
                    </div>}
                    {this.state.showAddSection && !showAssociateSection && <div style={{paddingTop: "10px"}}>
                        {addObjectiveBody(Object.assign({}, listState, {
                            onChange: this.handleChange,
                            onAddElement: this.handleOnAdd(elementsKey),
                            onCancel: this.clearFields
                        }))}
                    </div>}
                    {showAssociateSection &&
                        <BiztrackModal
                            title={"Asociar Objetivos"}
                            head={<Message message={"Señor usuario, los cambios realizados se verán reflejados en la información del cliente."} show={true} icon={'exclamation'} />}
                            body={
                                <div>
                                    {listState.showAddSection && <div>
                                        {addObjectiveBody(
                                            Object.assign({}, listState, {
                                                onChange: this.handleChange,
                                                onAddElement: this.handleOnAdd(draftElementsKey),
                                                onCancel: this.clearFields
                                            })
                                        )}</div>}
                                    {!listState.showAddSection && <div className="add-section" style={{ position: "absolute", top: "60px", right: "10px" }} >
                                        <ToolTip text={"Asociar Objetivos"}>
                                            <Icon
                                                className='icon-message-elements'
                                                size='huge'
                                                name={'add square'}
                                                style={{ color: '#16498b', fontSize: '34pt !important', margin: '0px 20px 10px 20px', cursor: 'pointer' }}
                                                onClick={this.showEditSection}
                                            />
                                        </ToolTip>
                                    </div>}
                                    {this.renderElements(this.checkDraftElement, (el) => el, draftElements, true)}
                                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                                        <button style={{ marginRight: "5px" }} className="btn btn-secondary section-btn-save" type="button" onClick={this.associateElements}>Guardar</button>
                                        <button className="btn btn-primary cancel-btn" type="button" onClick={this.hideAssociateSection}>Cancelar</button>
                                    </div>
                                </div>
                            }
                            onCancel={this.hideAssociateSection}
                        />
                    }
                </div>
            </div >
        )
    }

}