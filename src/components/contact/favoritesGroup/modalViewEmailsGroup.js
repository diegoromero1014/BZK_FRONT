/**
 * Created by Andres Hurtado on 25/04/2017.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import { getEmailsForGroup, clearEmails } from './actions';
import AreaNueva from '../../../ui/textarea/textareaComponent';
import _ from 'lodash';
import { showLoading } from '../../loading/actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import $ from 'jquery';
import { validateResponse } from '../../../actionsGlobal';
import { MESSAGE_ERROR, MESSAGE_ERROR_SWEET_ALERT, TITLE_ERROR_SWEET_ALERT } from '../../../constantsGlobal';

class ModalViewEmailsGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailView: false,
        };
        this._copy = this._copy.bind(this);
    }

    componentWillMount() {
        let { getEmailsForGroup, idGroup } = this.props;
        getEmailsForGroup(idGroup).then((data) => {
            if (validateResponse(data)) {
            } else {
                swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            }
        }, (reason) => {
            swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
        this.setState({ emailView: true });
    }

    componentWillUnmount() {
        this.props.clearEmails();
    }

    _copy() {
        const { swtShowMessage } = this.props;
        let aux = document.createElement("input");
        aux.setAttribute("value", document.getElementById("emailsGroups").value);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        swtShowMessage('success', 'Copia correcta', 'Señor usuario, los correos fueron copiados correctamente');
    }

    render() {
        const emailsGroups = this.props.groupsFavoriteContacts.get('viewEmailGroup');
        return (
            <div>
                <div className="modalBt4-body modal-body clearfix"
                    style={{ overflowX: 'hidden', maxHeight: '490px !important' }}>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <Row style={{ paddingTop: '10px' }}>
                            <Col xs={12} md={12} lg={12}>
                                <h4>Correos electrónicos</h4>
                                <div>
                                    <AreaNueva
                                        id="emailsGroups"
                                        name="actionArea"
                                        type="text"
                                        disabled="disabled"
                                        style={{ width: '100%', height: '100%', textAlign: 'justify' }}
                                        max="1000"
                                        rows={5}
                                        value={emailsGroups}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="button"
                        className="btn btn-primary modal-button-edit">
                        <a href={`mailto:${emailsGroups}`} target="_top" style={{ color: "#FFF" }}>
                            Enviar correo
                        </a>
                    </button>
                    <button type="button" onClick={this._copy}
                        className="btn btn-primary modal-button-edit">Copiar
                    </button>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getEmailsForGroup,
        swtShowMessage,
        clearEmails
    }, dispatch);
}

function mapStateToProps({ groupsFavoriteContacts }, ownerProps) {
    return {
        groupsFavoriteContacts
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalViewEmailsGroup);