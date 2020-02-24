import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { cleanList, addToList, createList } from '../elements/actions';
import { OBJECTIVES_PLACEHOLDER } from '../participants/constants';
import ElementsComponent from '../elements';
import { schema } from '../participants/schema';

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