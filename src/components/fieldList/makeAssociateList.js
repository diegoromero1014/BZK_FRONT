import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AssociateListComponent from './Objetives/AssociateObjectives';

import {
    createList,
    addFieldToList,
    setFieldsToList,
    changeListState,
    removeElementFromList,
    updateElementFromList,
    editElementFromList,
    changeDraftListState
} from './actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';

export default function makeAssociateList(listName) {

    const changeState = changeListState(listName);

    class AssociateList extends React.Component {

        componentDidMount() {
            const {dispatchCreateList} = this.props;
            const childrenList = [];
            const initialValues = {
                elements: [
                    {
                        id: 1,
                        value: "prueba",
                        strategies: []
                    }
                ]
            }
            dispatchCreateList(listName, initialValues);
        }

        render() {

            const {
                dispatchChangeListState,
                dispatchSwtShowMessage,
                elements,
                draftElements,
                showAssociateSection
            } = this.props;

            return (
                <div>
                    <AssociateListComponent
                        changeListState={dispatchChangeListState}
                        swtShowMessage={dispatchSwtShowMessage}
                        elements={elements}
                        draftElements={draftElements}
                        showAssociateSection={showAssociateSection}
                    />
                </div>
            )
        }

    }

    function mapStateToProps({fieldListReducer}) {

        let values = fieldListReducer[listName];
        let elements = [];
        let draftElements = [];
        let showAssociateSection = false;

        if (values) {
            elements = values.elements;
            draftElements = values.draftElements;
            showAssociateSection = values.showAssociateSection;
        }

        return {
            elements,
            draftElements,
            showAssociateSection
        }
    }

    function mapDispatchToProps(dispatch) {
        return bindActionCreators({
            dispatchCreateList: createList,
            dispatchSwtShowMessage: swtShowMessage,
            dispatchChangeListState: changeState
        }, dispatch)
    }

    return connect(mapStateToProps, mapDispatchToProps)(AssociateList)

}