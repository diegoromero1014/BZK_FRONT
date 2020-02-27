import React from 'react';
import { Icon } from 'semantic-ui-react'
import Objectives from './Objetives';

import {
    ListaObjetivos,
    ObjectiveSectionTitle,
    objectivesInitialValues,
    styles
} from './utils';
import TemplateObjectiveAndStrategies from './templateObjectiveAndStrategies';
import ToolTip from '../../toolTip/toolTipComponent';
import BiztrackModal from '../Objetives/BiztrackModal';


export default class AssociateObjectives extends React.Component {

    constructor(props) {
        super(props);
        this.showAssociateSection = this.showAssociateSection.bind(this);
        this.associateElements = this.associateElements.bind(this);
        this.checkDraftElement = this.checkDraftElement.bind(this);
        this.checkElement = this.checkElement.bind(this);
        this.hideAssociateSection = this.hideAssociateSection.bind(this);
    }

    changeAssociationOfElements(elements, changedElement) {
        return elements.map((element) => {
            if (element.id == changedElement.id) {
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
            "Confirmar eliminación",
            `Señor usuario, ¿Esta seguro que desea desasociar el Objetivo?`,
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
                confirmButtonColor:'#DD6B55'
            }
        );
    }

    renderElements(elements=[], checkedFunction, filterAssociatedElements) {

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
                            <input onChange={() => checkedFunction(elements, element)} type="checkbox" checked={element.associated} name="example" />
                        </div>
                    }
                    objetivo={element}
                    strategies={filterAssociatedElements(element["strategies"])}
                />
            )
        )
    }

    showAssociateSection() {
        const { elements, changeListState } = this.props;
        changeListState({
            draftElements: [...elements],
            showAssociateSection: true
        })
    }

    hideAssociateSection() {
        const { changeListState } = this.props;
        changeListState({
            showAssociateSection: false
        })
    }

    associateElements() {
        const { changeListState, draftElements } = this.props;
        changeListState({
            elements: [...draftElements],
            showAssociateSection: false
        })
    }

    filterCheckedElements(element) {
        return element.associated;
    }

    render() {

        const {
            elements,
            showAssociateSection,
            draftElements
        } = this.props;

        const filteredElements = elements.filter(this.filterCheckedElements);

        return (
            <div>
                <div style={{ position: "relative", marginBottom: "25px" }}>
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
                </div>
                <div style={styles.main}>
                    {ObjectiveSectionTitle}
                    {this.renderElements(filteredElements, this.checkElement, (list) => list.filter((el) => el.associated ))}
                    {!filteredElements.length && <div className="elements-not-found">
                        <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                            <span className="form-item">No se han asociado Objetivos</span>
                        </div>
                    </div>}
                    {showAssociateSection &&
                        <BiztrackModal
                            title={"Asociar Objetivos"}
                            body={
                                <div>
                                    {this.renderElements(draftElements, this.checkDraftElement, (el) => el)}
                                    <div style={{ marginTop: "20px" }}>
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