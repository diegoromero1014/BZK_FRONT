import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ListOfElements from './ListOfElements';

import {
    createList,
    addFieldToList,
    setFieldsToList,
    changeListState,
    removeElement,
    updateElement,
    editElement
} from './actions';

export default function makeFieldList(listName, childrenList) {

    class StateImplementation extends React.Component {

        componentDidMount() {
            const { dispatchCreateList } = this.props;
            dispatchCreateList(listName, childrenList);
        }

        render() {
            const {
                fields,
                elements,
                isEditing,
                dispatchAddFieldToList,
                dispatchSetFieldsToList,
                dispatchChangeListState,
                dispatchUpdateElement,
                dispatchRemoveElement,
                dispatchEditElement,
                showAddSection
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

        if (values) {
            fields = values.fields;
            elements = values.elements;
            showAddSection = values.showAddSection;
            isEditing = values.isEditing
        }

        return {
            formLists,
            fields,
            elements,
            showAddSection,
            isEditing
        }
    }

    function mapDispatchToProps(dispatch) {
        return bindActionCreators({
            dispatchCreateList: createList,
            dispatchAddFieldToList: addFieldToList(listName),
            dispatchSetFieldsToList: setFieldsToList(listName),
            dispatchChangeListState: changeListState(listName),
            dispatchUpdateElement: updateElement(listName),
            dispatchRemoveElement: removeElement(listName),
            dispatchEditElement: editElement(listName)
        }, dispatch)
    }

    return connect(mapStateToProps, mapDispatchToProps)(StateImplementation);

}