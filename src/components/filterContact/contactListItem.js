import React, { Component, PropTypes } from 'react';
import { redirectUrl } from '../globalComponents/actions';
import { shorterStringValue, joinName } from '../../actionsGlobal';

class ContactListItem extends Component {
    constructor(props) {
        super(props);
        this._handleClickContactItem = this._handleClickContactItem.bind(this);
    }

    _handleClickContactItem(e) {
        const {id} = this.props;
        window.sessionStorage.setItem('idContactSelected', id);
        redirectUrl("/dashboard/clientsContacts");
    }

    render() {
        const { typeDocument, numberDocument, firstName, middleName, firstLastName, secondLastName } = this.props;
        return (
            <div>
                <div className="contact-card" onClick={this._handleClickContactItem}>
                    <div className="contact-card-top">
                        <div className="contact-card-top-left">
                            <div className="contact-title">{joinName(firstName, middleName, firstLastName, secondLastName)}</div>
                            <div className="contact-name">{typeDocument}: {shorterStringValue(numberDocument, 30)}</div>
                        </div>
                    </div>
                    <div className="contact-card-bottom" >
                        <i className="chevron circle right icon blue" style={{ marginTop: "-19px" }}></i>
                    </div>
                </div>
            </div>
        )
    }
}

ContactListItem.PropTypes = {
    id: PropTypes.string.isRequired,
    typeDocument: PropTypes.string.isRequired,
    numberDocument: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    middleName: PropTypes.string,
    firstLastName: PropTypes.string.isRequired,
    secondLastName: PropTypes.string,
};

export default ContactListItem;
