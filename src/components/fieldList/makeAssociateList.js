import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AssociateListComponent from './Objetives/AssociateObjectives';

import {
    createList,
    changeListState,
    updateElementFromList,
    addFieldToList,
    setFieldsToList,
    editElementFromList,
    removeElementFromList
} from './actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';

export default function makeAssociateList(listName, childrenList=[]) {

    const changeState = changeListState(listName);
    const updateElement = updateElementFromList(listName);
    const addField = addFieldToList(listName);
    const setFields = setFieldsToList(listName);
    const editElement = editElementFromList(listName);
    const removeElement = removeElementFromList(listName);

    class AssociateList extends React.Component {

        componentDidMount() {
            const {dispatchCreateList, initialValues} = this.props;
            dispatchCreateList(listName,{childrenList, initialValues});
            for (let index = 0; index < childrenList.length; index++) {
                const child = childrenList[index];
                dispatchCreateList(child.name, { initialValues: child.initialValues });
            }
        }

        render() {

            const {
                dispatchChangeListState,
                dispatchSwtShowMessage,
                dispatchUpdateElement,
                dispatchSetFields,
                dispatchAddField,
                dispatchEditElement,
                dispatchRemoveElement,
                elements,
                draftElements,
                showAssociateSection,
                listState,
                initialValues
            } = this.props;

            return (
                <div>
                    <AssociateListComponent
                        {...this.props}
                        changeListState={dispatchChangeListState}
                        swtShowMessage={dispatchSwtShowMessage}
                        updateElement={dispatchUpdateElement}
                        setFields={dispatchSetFields}
                        elements={elements}
                        draftElements={draftElements}
                        showAssociateSection={showAssociateSection}
                        isEditable={true}
                        listState={listState}
                        addField={dispatchAddField}
                        initialValues={initialValues}
                        editElement={dispatchEditElement}
                        removeElement={dispatchRemoveElement}
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
            showAssociateSection,
            listState: values
        }
    }

    function mapDispatchToProps(dispatch) {
        return bindActionCreators({
            dispatchCreateList: createList,
            dispatchSwtShowMessage: swtShowMessage,
            dispatchChangeListState: changeState,
            dispatchUpdateElement: updateElement,
            dispatchAddField: addField,
            dispatchSetFields: setFields,
            dispatchEditElement: editElement,
            dispatchRemoveElement: removeElement
        }, dispatch)
    }

    return connect(mapStateToProps, mapDispatchToProps)(AssociateList)

}