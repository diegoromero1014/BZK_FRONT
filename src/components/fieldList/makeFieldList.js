import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ListOfElements from './ListOfElements';

import {
    createList,
    addFieldToList,
    setFieldsToList,
    changeListState,
    removeElementFromList,
    updateElementFromList,
    editElementFromList
} from './actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';


export default function makeFieldList(listName, childrenList=[]) {

    const addField = addFieldToList(listName);
    const setFields = setFieldsToList(listName);
    const changeState = changeListState(listName);
    const updateElement = updateElementFromList(listName);
    const removeElement = removeElementFromList(listName);
    const editElement = editElementFromList(listName);

    class FieldList extends React.Component {

        componentDidMount() {
            const { dispatchCreateList } = this.props;
            dispatchCreateList(listName, childrenList);
            for (let index = 0; index < childrenList.length; index++) {
                const child = childrenList[index];
                dispatchCreateList(child.name);
            }
        }

        render() {
            const {
                fields,
                elements,
                isEditing,
                errors,
                dispatchAddFieldToList,
                dispatchSetFieldsToList,
                dispatchChangeListState,
                dispatchUpdateElement,
                dispatchRemoveElement,
                dispatchEditElement,
                showAddSection,
                dispatchSwtShowMessage
            } = this.props;

            return (
                <ListOfElements
                    {...this.props}
                    elements={elements}
                    fields={fields}
                    addField={dispatchAddFieldToList}
                    setFields={dispatchSetFieldsToList}
                    showAddSection={showAddSection}
                    setListState={dispatchChangeListState}
                    isEditing={isEditing}
                    updateElement={dispatchUpdateElement}
                    removeElement={dispatchRemoveElement}
                    handleOnEdit={dispatchEditElement}
                    swtShowMessage={dispatchSwtShowMessage}
                    errors={errors}
                />
            )
        }

    }

    function mapStateToProps({ formLists }) {
        let values = formLists[listName];
        let fields = {};
        let elements = [];
        let showAddSection = false;
        let isEditing = false;
        let errors = {}

        if (values) {
            fields = values.fields;
            elements = values.elements;
            showAddSection = values.showAddSection;
            isEditing = values.isEditing
            errors = values.errors
        }

        return {
            formLists,
            fields,
            elements,
            showAddSection,
            isEditing,
            errors
        }
    }

    function mapDispatchToProps(dispatch) {
        return bindActionCreators({
            dispatchCreateList: createList,
            dispatchAddFieldToList: addField,
            dispatchSetFieldsToList: setFields,
            dispatchChangeListState: changeState,
            dispatchUpdateElement: updateElement,
            dispatchRemoveElement: removeElement,
            dispatchEditElement: editElement,
            dispatchSwtShowMessage: swtShowMessage
        }, dispatch)
    }

    return connect(mapStateToProps, mapDispatchToProps)(FieldList);

}