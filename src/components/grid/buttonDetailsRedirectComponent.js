import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { redirectUrl } from '../globalComponents/actions';
import { changeOwnerDraft } from '../visit/actions';
import { changeOwnerDraftPrevisit } from '../previsita/actions';
import { changeOwnerDraftPipeline } from '../pipeline/actions';
import { seletedButton, validateContactShareholder } from '../clientDetailsInfo/actions';
import { updateTitleNavBar } from '../navBar/actions';
import { consultInfoClient } from '../clientInformation/actions';
import { showLoading } from '../loading/actions';
import { isUndefined } from 'lodash';
import { updateStatusModal } from '../myPendings/draftDocuments/actions';
import { toggleMenu } from '../navBar/actions';
import { MENU_OPENED } from '../navBar/constants';
import { MODULE_VISIT, MODULE_PREVISIT, MODULE_PIPELINE, MODULE_BUSINESS_PLAN } from './constants';
import {MODULE_TASKS} from "../../constantsGlobal";

class ButtonDetailsRedirectComponent extends Component {

    constructor(props) {
        super(props);
        this._detailVisit = this._detailVisit.bind(this);
        this._handleRedirect = this._handleRedirect.bind(this);
    }

    _detailVisit() {
        const {
            actionsRedirect, updateTitleNavBar, changeOwnerDraft, changeOwnerDraftPrevisit, changeOwnerDraftPipeline, showLoading,
            updateStatusModal, toggleMenu, navBar
        } = this.props;
        let redirectObject;
        if (typeof actionsRedirect === 'function') {
            redirectObject = actionsRedirect();
        } else {
            redirectObject = actionsRedirect;
        }
        showLoading(true, 'Cargando cliente...');
        if (redirectObject.typeClickDetail === MODULE_VISIT) {
            updateTitleNavBar("Informe de visita/reunión");
            changeOwnerDraft(redirectObject.ownerDraft);
            if (!isUndefined(redirectObject.idClient)) {
                this._handleRedirect(redirectObject.urlRedirect + '/' + redirectObject.id, redirectObject.idClient);
            } else {
                showLoading(false, null);
                redirectUrl(redirectObject.urlRedirect + '/' + redirectObject.id);
            }
        } else if (redirectObject.typeClickDetail === MODULE_PREVISIT) {
            updateTitleNavBar("Informe de previsita");
            changeOwnerDraftPrevisit(redirectObject.ownerDraft);
            if (!isUndefined(redirectObject.idClient)) {
                this._handleRedirect(redirectObject.urlRedirect + '/' + redirectObject.id, redirectObject.idClient);
            } else {
                showLoading(false, null);
                redirectUrl(redirectObject.urlRedirect + '/' + redirectObject.id);
            }
        } else if (redirectObject.typeClickDetail === MODULE_PIPELINE) {
            updateTitleNavBar("Informe de pipeline");
            changeOwnerDraftPipeline(redirectObject.ownerDraft);
            if (!isUndefined(redirectObject.idClient)) {
                this._handleRedirect(redirectObject.urlRedirect + '/' + redirectObject.id, redirectObject.idClient);
            } else {
                showLoading(false, null);
                redirectUrl(redirectObject.urlRedirect + '/' + redirectObject.id);
            }
        } else if (redirectObject.typeClickDetail === MODULE_BUSINESS_PLAN) {
            updateTitleNavBar("Informe de plan de negocio");
            changeOwnerDraftPipeline(redirectObject.ownerDraft);
            if (!isUndefined(redirectObject.idClient)) {
                this._handleRedirect(redirectObject.urlRedirect + '/' + redirectObject.id, redirectObject.idClient);
            } else {
                showLoading(false, null);
                redirectUrl(redirectObject.urlRedirect + '/' + redirectObject.id);
            }
        } else if (redirectObject.typeClickDetail === MODULE_TASKS) {
            updateTitleNavBar("Tareas");
            changeOwnerDraftPipeline(redirectObject.ownerDraft);
            if (!isUndefined(redirectObject.idClient)) {
                this._handleRedirect(redirectObject.urlRedirect + '/' + redirectObject.id, redirectObject.idClient);
            } else {
                showLoading(false, null);
                redirectUrl(redirectObject.urlRedirect + '/' + redirectObject.id);
            }
        }
        if (navBar.get('status') === MENU_OPENED) {
            toggleMenu();
        }
        updateStatusModal(false);
    }

    _handleRedirect(urlRedirect, idClient) {
        window.sessionStorage.setItem('idClientSelected', idClient);
        const { consultInfoClient, showLoading } = this.props;
        consultInfoClient().then((data) => {
            showLoading(false, null);
            redirectUrl(urlRedirect);
        });
    }


    render() {
        const iconButton = isUndefined(this.props.icon) ? "zoom icon" : this.props.icon;
        return (
            <td style={this.props.style}>
                <button className="btn btn-primary btn-sm" onClick={this._detailVisit}>
                    <i className={iconButton} style={{ margin: '0em', fontSize: '1.2em' }} />
                </button>
            </td>
        );
    }
}

ButtonDetailsRedirectComponent.propTypes = {
    icon: PropTypes.string
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar,
        changeOwnerDraft,
        changeOwnerDraftPrevisit,
        changeOwnerDraftPipeline,
        seletedButton,
        consultInfoClient,
        validateContactShareholder,
        showLoading,
        updateStatusModal,
        redirectUrl,
        toggleMenu
    }, dispatch);
}

function mapStateToProps({ navBar, visitReducer }, ownerProps) {
    return {
        navBar,
        visitReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDetailsRedirectComponent);
