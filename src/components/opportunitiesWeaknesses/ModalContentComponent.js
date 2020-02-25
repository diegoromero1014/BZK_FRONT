import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { cleanList, addToList, createList } from '../elements/actions';
import ElementsComponent from '../elements';
import { schema } from '../participants/schema';

class ModalContentComponent extends Component {

    render() {
        const { name, singularTitle, title, placeholder, isEditable } = this.props;
        return (
            <div>
                <ElementsComponent
                    schema={schema}
                    placeholder={placeholder}
                    messageButton='Agregar'
                    name={name}
                    max={3}
                    title={title}
                    isEditable={isEditable}
                    singularTitle={singularTitle}
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