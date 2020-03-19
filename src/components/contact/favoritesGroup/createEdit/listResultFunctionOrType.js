import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { stringValidate } from '../../../../actionsGlobal';
import { MESSAGE_ERROR } from '../../../../constantsGlobal';
import GridComponent from '../../../grid/component';
import { swtShowMessage } from '../../../sweetAlertMessages/actions';
import { changeStateSaveData } from '../../../main/actions';
import { ACTION_CHECK } from '../../../grid/constants';
import { changeStateContactByFunctionOrType } from '../actions';

class ListResultFunctionOrType extends Component {

    constructor(props) {
        super(props);
        this.state = {
            actions: {},
            modalIsOpen: false
        };

        this.closeModal = this.closeModal.bind(this);
        this._renderHeaders = this._renderHeaders.bind(this);
        this._renderCellView = this._renderCellView.bind(this);
        this._addContact = this._addContact.bind(this);
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    _addContact(idContact, item) {
        const { changeStateContactByFunctionOrType, swtShowMessage } = this.props;
        if (!stringValidate(item.email)) {
            swtShowMessage(MESSAGE_ERROR, 'Acción no permitida', 'Señor usuario no puede agregar un contacto que no tiene correo.');
        } else {
            changeStateContactByFunctionOrType(idContact);
        }
    }

    _renderHeaders() {
        return [
            {
                title: "",
                key: ACTION_CHECK,
                width: '20px'
            },
            {
                title: "Documento",
                key: "document"
            },
            {
                title: "Nombre",
                key: "completeName"
            },
            {
                title: "Correo",
                key: "email"
            }
        ]
    }

    _renderCellView(data = []) {
        return data.map(item => {
            const thisSelf = this;
            const jsonRow = {
                check: {
                    fn: thisSelf._addContact,
                    argsFn: [item.id, item],
                    isChecked: item.checked
                },
                document: item.document,
                completeName: item.completeName,
                email: item.email,
                checked: item.checked
            }
            return jsonRow;
        })
    }

    render() {
        const { groupsFavoriteContacts } = this.props;
        var listContactsByFunctionOrType = groupsFavoriteContacts.get('contactByFunctionOrTypeSelected');
        listContactsByFunctionOrType = _.filter(listContactsByFunctionOrType, ['show', true]);
        return (
            <div className="horizontal-scroll-wrapper" style={{ overflow: 'scroll', overflowX: 'hidden' }}>
                <GridComponent headers={this._renderHeaders} data={this._renderCellView(listContactsByFunctionOrType)} />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        swtShowMessage,
        changeStateSaveData,
        changeStateContactByFunctionOrType
    }, dispatch);
}

function mapStateToProps({ selectsReducer, reducerGlobal, groupsFavoriteContacts }, ownerProps) {
    return {
        selectsReducer,
        reducerGlobal,
        groupsFavoriteContacts
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListResultFunctionOrType);


