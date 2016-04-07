import React, {Component, PropTypes} from 'react';
import { browserHistory } from 'react-router';
import {redirectUrl} from '../globalComponents/actions';

class MenuListItem extends Component {

  _handleClickMenuItem(e){
    const {linkUrl} = this.props;
    if( linkUrl === "/login" ){
      window.localStorage.setItem('sessionToken', '');
      redirectUrl(linkUrl);
    } else {

    }
  }

    render() {
        const {iconClassName, labelText, linkUrl, style} = this.props;
        return (
            <li style={style} onClick={this._handleClickMenuItem.bind(this)} className="cursorMenuList">
                <a>
                    <i className={iconClassName}/>
                    <div style={{width: "100px", height: "30px"}} >
                      <span className="title">{labelText}</span>
                    </div>
                </a>
            </li>
        );
    }
}

MenuListItem.PropTypes = {
    iconClassName: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    linkUrl: PropTypes.string.isRequired,
    style: PropTypes.object
};

export default MenuListItem;
