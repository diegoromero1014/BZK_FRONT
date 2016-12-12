/**
 * Created by ahurtado on 12/6/2016.
 */
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {redirectUrl} from '../globalComponents/actions';

class LinkComponent extends Component {

    constructor(props) {
        super(props);
        this._redirect = this._redirect.bind(this);
    }

    _redirect() {
        const {url, idClient} = this.props;
        window.localStorage.setItem('idClientSelected', idClient);
        redirectUrl(url);
    }

    render() {
        const {text, isRedirect} = this.props;
        if (isRedirect) {
            return (<td><a style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={this._redirect}>{text}</a></td>);
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
    return bindActionCreators({}, dispatch);
}

function mapStateToProps({}, ownerProps) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkComponent);
