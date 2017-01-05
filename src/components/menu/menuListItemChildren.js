import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { redirectUrl } from '../globalComponents/actions';

class MenuListItemChildren extends Component {

    _handleClickMenuItemChildren(e) {
        const {linkUrl} = this.props;
        if (linkUrl === "/login") {
            window.localStorage.setItem('sessionToken', '');
        }
        redirectUrl(linkUrl);
    }

    render() {
        const {labelText, linkUrl, style} = this.props;
        return (
            <li onClick={this._handleClickMenuItemChildren.bind(this)} className="cursorMenuList">
                <a className="menuItemStyle">
                    <div  style={{paddingTop: '8px'}}>
                        <span className="title">{labelText}</span>
                    </div>
                </a>
            </li>
        );
    }
}

MenuListItemChildren.PropTypes = {
    labelText: PropTypes.string.isRequired,
    linkUrl: PropTypes.string.isRequired,
    style: PropTypes.object
};

export default MenuListItemChildren;
