import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { cleanList, addToList, createList, linkedRecords, resetRecords } from '../elements/actions';
import ElementsComponent from '../elements';
import { schemaoOportunitiesWeaknesses } from './schema';
import { swtShowMessage } from '../sweetAlertMessages/actions';

class ModalContentComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            elements: null,
        }
    }

    handleBackup() {
        const { element } = this.props;

        if (!this.state.elements) {
            this.setState({ elements: Object.assign([], element.elements) });
        }
    }

    handleOnClick = () => {
        const { dispatchSwtShowMessage } = this.props;

        dispatchSwtShowMessage(
            'warning',
            "Guardar información",
            "¿Señor usuario, está seguro que desea guardar esta información?",
            {
                onConfirmCallback: () => this.handleOnSave(),
                onCancelCallback: () => { }
            },
            {
                "confirmButtonColor": '#DD6B55',
                "confirmButtonText": 'Sí, estoy seguro!',
                "cancelButtonText": "Cancelar",
                "showCancelButton": true,
            }
        );
    }

    handleOnSave = () => {
        const { handleCloseModal, dispatchLinkedRecords, name } = this.props;

        dispatchLinkedRecords(name);
        handleCloseModal();
    }

    render() {
        const { name, singularTitle, title, placeholder, isEditable, handleCancel } = this.props;

        this.handleBackup();

        return (
            <div>
                <ElementsComponent
                    schema={schemaoOportunitiesWeaknesses}
                    placeholder={placeholder}
                    messageButton={`Agregar ${singularTitle}`}
                    name={name}
                    max={5}
                    title={title}
                    isEditable={isEditable}
                    singularTitle={singularTitle}
                    showCheck={true}
                />

                <div className="modalBt4-footer modal-footer">
                    <button type="submit" className="btn btn-primary modal-button-edit" style={{ marginRight: 15 }} onClick={this.handleOnClick}>
                        <span>Guardar</span>
                    </button>

                    <button type="button" className="btn btn-default modal-button-edit" onClick={() => handleCancel(this.state.elements)}>
                        <span>Cancelar</span>
                    </button>
                </div>
            </div>
        );
    }
}


const mapStateToProps = ({ elementsReducer }, props) => ({
    element: elementsReducer[props.name]
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchCleanList: cleanList,
        dispatchAddToList: addToList,
        dispatchCreateList: createList,
        dispatchLinkedRecords: linkedRecords,
        dispatchResetRecords: resetRecords,
        dispatchSwtShowMessage: swtShowMessage
    }, dispatch)
};


export default connect(mapStateToProps, mapDispatchToProps)(ModalContentComponent);