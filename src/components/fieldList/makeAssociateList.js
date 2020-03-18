import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AssociateListComponent from './Objetives/AssociateObjectives';

import {
    createList,
    changeListState
} from './actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';

export default function makeAssociateList(listName, childrenList=[]) {

    const changeState = changeListState(listName);

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
                elements,
                draftElements,
                showAssociateSection
            } = this.props;

            return (
                <div>
                    <AssociateListComponent
                        {...this.props}
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