import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Dropdown, Menu, Icon} from 'semantic-ui-react';
import { redirectUrl } from '../../globalComponents/actions';
import _ from 'lodash';

class MenuListChildrenComponent extends Component {

    
 
    render() {
        const { labelText, linkUrl } = this.props;
        return (
            <Dropdown.Item  onClick={this._handleClickMenuItemChildren.bind(this)} >
                {labelText}
            </Dropdown.Item>
        );
    }
}

MenuListChildrenComponent.PropTypes = {
    labelText: PropTypes.string.isRequired,
    linkUrl: PropTypes.string.isRequired
};

export default MenuListChildrenComponent;