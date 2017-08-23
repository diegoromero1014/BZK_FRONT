import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Dropdown, Menu, Icon } from 'semantic-ui-react';
import { redirectUrl } from '../../globalComponents/actions';
import _ from 'lodash';

class MenuItem extends Component {

    _handleClickMenuItem(e) {
        const { linkUrl } = this.props;
        if (linkUrl === "/login") {
            window.localStorage.setItem('sessionToken', '');
        }
        if (!_.isEqual(linkUrl, undefined) && !_.isEqual(linkUrl, null)) {
            redirectUrl(linkUrl);
        }
    }

    render() {
        const { iconClassName, labelText, linkUrl } = this.props;
          const iconAndText = (
            <span>
                <Icon name={iconClassName} /> {labelText}
        </span>
        )
        return (
            <Menu.Item  onClick={this._handleClickMenuItem.bind(this)}>
                {iconAndText}
            </Menu.Item>
        );
    }
}
MenuItem.PropTypes = {
    labelText: PropTypes.string.isRequired,
    linkUrl: PropTypes.string.isRequired
};

export default MenuItem;