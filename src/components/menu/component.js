import React, {Component, PropTypes} from 'react';
import MenuList from './menuList';

class MenuComponent extends Component {
    render() {
        return (
            <div className="main dashboard" style={{width: "100%", height: "100%"}}>
                <div className="menu-metro">
                    <MenuList />
                    <div className="inner-menu hidden">
                    </div>
                </div>
            </div>
        );
    }
}

export default MenuComponent;
