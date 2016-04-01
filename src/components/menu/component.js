import React, {Component, PropTypes} from 'react';
import MenuList from './MenuList';

class MenuComponent extends Component {
    render() {
        return (
            <div className="page-sidebar mini" id="main-menu">
                <MenuList/>
                <div id="submenu-container" className="inner-menu hidden">
                </div>
            </div>
        );
    }
}

export default MenuComponent;