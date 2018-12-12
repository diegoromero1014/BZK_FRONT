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
import { isUndefined, has } from 'lodash';
import { updateStatusModal } from '../myPendings/draftDocuments/actions';
import { toggleMenu } from '../navBar/actions';
import { MENU_OPENED } from '../navBar/constants';
import { MODULE_VISIT, MODULE_PREVISIT, MODULE_PIPELINE, MODULE_BUSINESS_PLAN } from './constants';

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
        showLoading(true, 'Cargando cliente...');
        if (actionsRedirect.typeClickDetail === MODULE_VISIT) {
            updateTitleNavBar("Informe de visita/reunión");
            changeOwnerDraft(actionsRedirect.ownerDraft);
            if (!isUndefined(actionsRedirect.idClient)) {
                this._handleRedirect(actionsRedirect.urlRedirect + '/' + actionsRedirect.id, actionsRedirect.idClient);
            } else {
                showLoading(false, null);
                redirectUrl(actionsRedirect.urlRedirect + '/' + actionsRedirect.id);
            }
        } else if (actionsRedirect.typeClickDetail === MODULE_PREVISIT) {
            updateTitleNavBar("Informe de previsita");
            changeOwnerDraftPrevisit(actionsRedirect.ownerDraft);
            if (!isUndefined(actionsRedirect.idClient)) {
                this._handleRedirect(actionsRedirect.urlRedirect + '/' + actionsRedirect.id, actionsRedirect.idClient);
            } else {
                showLoading(false, null);
                redirectUrl(actionsRedirect.urlRedirect + '/' + actionsRedirect.id);
            }
        } else if (actionsRedirect.typeClickDetail === MODULE_PIPELINE) {
            updateTitleNavBar("Informe de pipeline");
            changeOwnerDraftPipeline(actionsRedirect.ownerDraft);
            if (!isUndefined(actionsRedirect.idClient)) {
                this._handleRedirect(actionsRedirect.urlRedirect + '/' + actionsRedirect.id, actionsRedirect.idClient);
            } else {
                showLoading(false, null);
                redirectUrl(actionsRedirect.urlRedirect + '/' + actionsRedirect.id);
            }
        } else if (actionsRedirect.typeClickDetail === MODULE_BUSINESS_PLAN) {
            updateTitleNavBar("Informe de plan de negocio");
            changeOwnerDraftPipeline(actionsRedirect.ownerDraft);
            if (!isUndefined(actionsRedirect.idClient)) {
                this._handleRedirect(actionsRedirect.urlRedirect + '/' + actionsRedirect.id, actionsRedirect.idClient);
            } else {
                showLoading(false, null);
                redirectUrl(actionsRedirect.urlRedirect + '/' + actionsRedirect.id);
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
            <td>
                <button className="btn btn-primary btn-sm" onClick={this._detailVisit}>
                    <i className={iconButton} style={{ margin: '0em', fontSize: '1.2em' }} />
                </button>
            </td>
        );
    }
}

ButtonDetailsRedirectComponent.propTypes = {
    actionsRedirect: PropTypes.object,
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
