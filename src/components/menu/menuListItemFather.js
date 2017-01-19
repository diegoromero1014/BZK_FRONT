import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { redirectUrl } from '../globalComponents/actions';
import MenuListItemChildren from './menuListItemChildren';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash';

const styleChildrenMount = { marginLeft: '-20px', transition: 'all 0.3s' };
const styleChildrenUnMount = {display: 'none', transition: 'all 0.3s'};

class MenuListItemFather extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showClikdrenItem: false
        };
        this._mouseHoverItemFather = this._mouseHoverItemFather.bind(this);
        this._mouseOutItemFather = this._mouseOutItemFather.bind(this);
    }

    _handleClickMenuItemFather(e) {
        const {linkUrl} = this.props;
        if (linkUrl === "/login") {
            window.localStorage.setItem('sessionToken', '');
        }
        if( !_.isEqual(linkUrl, undefined) && !_.isEqual(linkUrl, null) ){
            redirectUrl(linkUrl);
        }
    }

    _mapMenuItemsChildren(item, idx) {
        return <MenuListItemChildren
            key={idx}
            labelText={item.text}
            linkUrl={item.link}
            style={item.style}
            />
    }

    _mouseHoverItemFather() {
        this.setState({
            showClikdrenItem: true
        });
    }

    _mouseOutItemFather() {
        this.setState({
            showClikdrenItem: false
        });
    }

    render() {
        const {iconClassName, labelText, linkUrl, style, children} = this.props;
        return (
            <div onMouseOver={this._mouseHoverItemFather}
                    onMouseOut={this._mouseOutItemFather}>
                <li style={style} onClick={this._handleClickMenuItemFather.bind(this)} className="cursorMenuList">
                    <a className="menuItemStyle">
                        <div style={{ paddingTop: '8px' }}>
                            <Icon className="itemMenu" name={iconClassName} />
                            <span className="title">{labelText}</span>
                        </div>
                    </a>
                </li>
                <ul style={ this.state.showClikdrenItem ? styleChildrenMount : styleChildrenUnMount }>
                    {children.map(this._mapMenuItemsChildren)}
                </ul>
            </div>
        );
    }
}

MenuListItemFather.PropTypes = {
    iconClassName: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    linkUrl: PropTypes.string.isRequired,
    style: PropTypes.object,
    children: PropTypes.array,
    classItem: PropTypes.string
};

export default MenuListItemFather;
