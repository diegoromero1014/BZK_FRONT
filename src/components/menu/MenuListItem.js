import React, {Component, PropTypes} from 'react';

class MenuListItem extends Component {
    render() {
        const {iconClassName, labelText, linkUrl} = this.props;
        return (
            <li className="menu-item start" data-ref="portfolio">
                <a href={linkUrl}>
                    <i className={iconClassName}/>
                    <span className="title">{labelText}</span>
                </a>
            </li>
        );
    }
}

MenuListItem.PropTypes = {
    iconClassName: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    linkUrl: PropTypes.string.isRequired
};

export default MenuListItem;
