import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { redirectUrl } from '../../globalComponents/actions';
import MenuListChildrenComponent from './menuListChildrenComponent';
import { Dropdown, Menu, Icon } from 'semantic-ui-react';
import _ from 'lodash';

class MenuListFatherComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showClikdrenItem: false
        };
    }

    _handleClickMenuItemFather(e) {
        const { linkUrl } = this.props;
        if (linkUrl === "/login") {
            window.localStorage.setItem('sessionToken', '');
        }
        if (!_.isEqual(linkUrl, undefined) && !_.isEqual(linkUrl, null)) {
            redirectUrl(linkUrl);
        }
    }

    _handleClickMenuItemChildren(link) {
        if (linkUrl === "/login") {
            window.localStorage.setItem('sessionToken', '');
        }
        if (!_.isEqual(link, undefined) && !_.isEqual(link, null)) {
            redirectUrl(link);
        }
    }

    _mapMenuItemsChildren(item, idx) {
        console.log(item);
        return (<Dropdown.Item >{item.text}</Dropdown.Item>)
    }


    render() {
        const { iconClassName, labelText, linkUrl, style, children } = this.props;
        const iconAndText = (
            <span>
                <Icon name={iconClassName} /> {labelText}
            </span>
        );
        return (
            <Dropdown trigger={iconAndText} className='link item'>
                <Dropdown.Menu>
                    <Dropdown.Item>Father</Dropdown.Item>
                    <Dropdown.Divider />
                    {children.map(this._mapMenuItemsChildren)}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

}

MenuListFatherComponent.PropTypes = {
    iconClassName: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    linkUrl: PropTypes.string.isRequired,
    style: PropTypes.object,
    children: PropTypes.array,
    classItem: PropTypes.string
};

export default MenuListFatherComponent;