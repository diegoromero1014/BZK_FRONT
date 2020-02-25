import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { cleanList, addToList, createList } from '../elements/actions';
import { 
    TITLE_OPPORTUNITIES,
    TITLE_WEAKNESSES,
    OPPORTUNITIES_PLACEHOLDER,
    WEAKNESSES_PLACEHOLDER,
    SINGULAR_TITLE_OPPORTUNITIES,
    SINGULAR_TITLE_WEAKNESSES,
} from './constants';

import ElementsComponent from '../elements';
import { schemaoOportunitiesWeaknesses } from './schema';

class ModalContentComponent extends Component {

    componentWillMount() {
        const { dispatchCleanList, dispatchAddToList, dispatchCreateList } = this.props;

        dispatchCleanList("opportunities");
        dispatchCreateList("opportunities");
    }

    render() {
        return (
            <div>
                <ElementsComponent
                    schema={schema}
                    placeholder={OBJECTIVES_PLACEHOLDER}
                    messageButton='Agregar'
                    name={"opportunities"}
                    max={3}
                    title={'Oportunidades'}
                    isEditable={true}
                    singularTitle={'oportunidad'}
                    showCheck={true}
                />
            </div>
        );
    }
}


const mapStateToProps = ({ elementsReducer }) => ({
    elementsReducer
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchCleanList: cleanList,
        dispatchAddToList: addToList,
        dispatchCreateList: createList
    }, dispatch)
};


export default connect(mapStateToProps, mapDispatchToProps)(ModalContentComponent);