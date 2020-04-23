import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { redirectUrl } from '../globalComponents/actions';
import { consultInfoClient } from '../clientInformation/actions';
import { seletedButton } from '../clientDetailsInfo/actions';

import { BUTTON_UPDATE } from '../clientDetailsInfo/constants';

export class LinkComponent extends Component {

    constructor(props) {
        super(props);
        this._redirect = this._redirect.bind(this);
    }

    _redirect() {
        const { url, idClient, dispatchConsultInfoClient, dispatchSeletedButton } = this.props;
        window.sessionStorage.setItem('idClientSelected', idClient);
        if (url === '/dashboard/clientEdit') {

            dispatchSeletedButton(BUTTON_UPDATE);

            dispatchConsultInfoClient(idClient).then(() => {
                redirectUrl(url);
            })

        }

    }

    render() {
        const { text, isRedirect, hasAccess } = this.props;
        if (isRedirect && hasAccess) {
            return (<td><a style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={this._redirect}>{text}</a></td>);
        } else {
            return (<td><p>{text}</p></td>);
        }
    }
}

LinkComponent.propTypes = {
    text: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isRedirect: PropTypes.bool.isRequired,
    idClient: PropTypes.number
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        dispatchConsultInfoClient : consultInfoClient, 
        dispatchSeletedButton : seletedButton 
    },
    dispatch);
}

function mapStateToProps({ }, ownerProps) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkComponent);