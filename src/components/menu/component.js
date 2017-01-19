import React, {Component, PropTypes} from 'react';
import MenuList from './menuList';

class MenuComponent extends Component {
    render() {
        return (
            <div className="main dashboard" style={{width: "100%", height: "100%"}}>
                <div className="page-sidebar" id="main-menu" style={{overflow: 'auto'}}>
                    <MenuList/>
                    <div id="submenu-container" className="inner-menu hidden">
                    </div>
                </div>
            </div>
        );
    }
}

export default MenuComponent;
