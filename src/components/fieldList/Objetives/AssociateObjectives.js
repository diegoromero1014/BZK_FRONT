import React from 'react';

import Objectives from './Objetives';

import {
    ListaObjetivos,
    ObjectiveSectionTitle,
    objectivesInitialValues,
    styles
} from './utils';
import TemplateObjectiveAndStrategies from './templateObjectiveAndStrategies';
import ToolTipComponent from '../../toolTip/toolTipComponent';
import BiztrackModal from '../Objetives/BiztrackModal';


export default class AssociateObjectives extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            elements: [
                {
                    id: 1,
                    value: "Hola",
                    strategies: []
                },
                {
                    id: 2,
                    value: "Mundo",
                    strategies: []
                }
            ],
            draftElements: [

            ],
            showAssociateSection: false
        }

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
                    checked: !element.checked
                })
            }
            return element
        })
    }

    checkDraftElement(elements, changedElement) {
        debugger;
        this.setState({
            draftElements: this.changeAssociationOfElements(elements, changedElement)
        })
    }

    checkElement(_, changedElement) {
        debugger;
        this.setState({
            elements: this.changeAssociationOfElements(this.state.elements, changedElement)
        })
    }

    renderElements(elements, checkedFunction) {
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
                            <input onChange={() => checkedFunction(elements, element)} type="checkbox" checked={element.checked} name="example" />
                        </div>
                    }
                    objetivo={element}
                />
            )
        )
    }

    showAssociateSection() {
        this.setState({
            draftElements: [...this.state.elements],
            showAssociateSection: true
        })
    }

    hideAssociateSection() {
        this.setState({
            showAssociateSection: false
        })
    }

    associateElements() {
        this.setState({
            elements: [...this.state.draftElements],
            showAssociateSection: false
        })
    }

    filterCheckedElements(element) {
        return element.checked;
    }

    render() {
        return (
            <div>
                <div style={{ position: "relative", marginBottom: "25px" }}>
                    <div className="add-section" style={{ position: "absolute", top: "10px", right: "10px" }} >
                        <button className="btn" onClick={this.showAssociateSection} type="button">
                        <ToolTip text={"Asociar Objetivos"}>
                                <Icon
                                    className='icon-message-elements'
                                    size='huge'
                                    name={'add square'}
                                    style={{ color: '#16498b', fontSize: '34pt !important', margin: '0px 20px 10px 20px', cursor: 'pointer' }}
                                    disabled={!isEditable || length >= max}
                                />
                            </ToolTip>
                        </button>
                    </div>
                </div>
                <div style={styles.main}>
                    {ObjectiveSectionTitle}
                    {this.renderElements(this.state.elements.filter(this.filterCheckedElements), this.checkElement)}
                    {this.state.showAssociateSection && <div>
                        <BiztrackModal 
                            title={"Asociar Objetivos"}
                            body={
                                <div>
                                    {this.renderElements(this.state.draftElements, this.checkDraftElement)}
                                    <div style={{marginTop: "20px"}}>
                                        <button style={{marginRight: "5px"}} className="btn btn-secondary section-btn-save" type="button" onClick={this.associateElements}>Guardar</button>
                                        <button className="btn btn-primary cancel-btn" type="button" onClick={this.hideAssociateSection}>Cancelar</button>
                                    </div>
                                </div>
                            }
                            onCancel={this.hideAssociateSection}
                        />
                    </div>}
                </div>
            </div>
        )
    }

}