import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { cleanList, addToList, createList, linkedRecords, resetRecords } from '../elements/actions';
import ElementsComponent from '../elements';
import { schemaoOportunitiesWeaknesses } from './schema';
import { swtShowMessage } from '../sweetAlertMessages/actions';

export class ModalContentComponent extends Component {

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
        const { dispatchSwtShowMessage, element: { elements , open }, title } = this.props;
        
        if (open) {
            dispatchSwtShowMessage(
                "error",
                "Error",
                `Señor usuario, esta creando o editando un registro en la sección Oportunidades y Debilidades, debe terminarlo o cancelarlo para poder guardar.`
            )
        } else {
            if (elements.filter(item => item.associated).length > 5) {
                dispatchSwtShowMessage(
                    "warning",
                    "Alerta",
                    `Señor usuario el maximo de ${title} son 5`
                )
            } else {
                dispatchSwtShowMessage(
                    'warning',
                    "Guardar información",
                    "Señor usuario, los cambios realizados se verán reflejados en la información del cliente.",
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
        }
    }

    handleOnSave = () => {
        const { handleCloseModal, dispatchLinkedRecords, name } = this.props;

        dispatchLinkedRecords(name);
        handleCloseModal();
    }

    render() {
        const { name, singularTitle, title, placeholder, isEditable, handleCancel, element } = this.props;

        const { elements } = element;

        let max = 5 ;
        max += elements.filter(item => item.status === -1).length;

        this.handleBackup();

        return (
            <div>
                <ElementsComponent
                    schema={schemaoOportunitiesWeaknesses}
                    placeholder={placeholder}
                    messageButton={`Crear ${singularTitle}`}
                    name={name}
                    max={max}
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
    element: elementsReducer[props.name],
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