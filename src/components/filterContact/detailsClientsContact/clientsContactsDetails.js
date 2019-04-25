import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../../globalComponents/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateTitleNavBar } from '../../navBar/actions';
import { STYLE_CONTAINER_BUTTONS, STYLE_BUTTONS_ACTIONS, MODULE_CONTACTS } from '../../../constantsGlobal';
import SweetAlert from '../../sweetalertFocus';
import FormContactDetails from '../../contact/contactDetail/contactDetailsModalComponent';
import { validatePermissionsByModule } from '../../../actionsGlobal';
import ListClientsContact from './listClientsContact';

class ClientsContactsDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmCancel: false
        };
        this._cancelActionContact = this._cancelActionContact.bind(this);
        this._closeConfirmCloseView = this._closeConfirmCloseView.bind(this);
    }

    _cancelActionContact() {
        this.setState({ showConfirmCancel: true });
    }

    _closeConfirmCloseView() {
        this.setState({ showConfirmCancel: false });
        redirectUrl("/dashboard/contacts");
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionTokenFront') === "") {
            redirectUrl("/login");
        } else if (window.sessionStorage.getItem('idContactSelected') === "") {
            redirectUrl("/dashboard/clients");
        } else {
            const { updateTitleNavBar, validatePermissionsByModule } = this.props;
            updateTitleNavBar("Contacto");
            validatePermissionsByModule(MODULE_CONTACTS).then((data) => {
                if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                    redirectUrl("/login");
                }
            });
        }
    }

    render() {
        const { contactDetail } = this.props;

        const contactId = window.sessionStorage.getItem('idContactSelected');
        return (
            <div style={{ backgroundColor: "#FFFFFF", width: "100%", paddingBottom: '70px' }}>
                <FormContactDetails callFromModuleContact={true} contactId={contactId} />
                <div className="" style={STYLE_CONTAINER_BUTTONS}>
                    <div style={{ right: '0px', position: 'fixed', paddingRight: '15px' }}>
                        <Row style={{ paddingTop: '8px' }}>

                            <Col style={STYLE_BUTTONS_ACTIONS}>
                                <button className="btn" style={{ backgroundColor: "rgb(193, 193, 193)" }} onClick={this._cancelActionContact}>
                                    <span style={{ color: "#FFFFFF" }}>Cancelar</span>
                                </button>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div>
                    <dt className="business-title" style={{ fontSize: '17px', marginTop: '30px' }}>
                        <span style={{ paddingLeft: '20px' }}>Listado de clientes asociados</span>
                    </dt>
                    <ListClientsContact contactId={contactId} />
                </div>
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmCancel}
                    title="Confirmación salida"
                    text="Señor usuario, ¿Está seguro que desea salir de la pantalla de contacto?"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmCancel: false })}
                    onConfirm={this._closeConfirmCloseView} />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar,
        validatePermissionsByModule
    }, dispatch);
}

function mapStateToProps({ filterContactsReducer, contactDetail }, ownerProps) {
    return {
        filterContactsReducer,
        contactDetail
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientsContactsDetails);