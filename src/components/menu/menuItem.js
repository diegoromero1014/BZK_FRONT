import React, {Component, PropTypes} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Icon, Menu} from "semantic-ui-react";
import {redirectUrl} from "../globalComponents/actions";
import _ from "lodash";
import {changeActiveItemMenu} from './actions';

class MenuItem extends Component {

    _handleClickMenuItem(e) {
        const {linkUrl, changeActiveItemMenu, labelText} = this.props;
        if (linkUrl === "/login") {
            window.localStorage.setItem('sessionTokenFront', '');
        }
        if (!_.isEqual(linkUrl, undefined) && !_.isEqual(linkUrl, null)) {
            changeActiveItemMenu(labelText);
            redirectUrl(linkUrl);
        }
    }

    render() {
        const {iconClassName, labelText, style, menu} = this.props;
        const activeItem = _.isEqual(menu.get('activeItem'), labelText);
        const iconAndText = (
            <span style={{fontSize : "15px"}}>
                <Icon name={iconClassName}/> {labelText}
            </span>
        );

        return (
            <Menu.Item active={activeItem} style={style} onClick={this._handleClickMenuItem.bind(this)}>
                {iconAndText}
            </Menu.Item>
        );
    }
}
MenuItem.PropTypes = {
    labelText: PropTypes.string.isRequired,
    linkUrl: PropTypes.string.isRequired
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators({changeActiveItemMenu}, dispatch);
}

function mapStateToProps({menu}, ownerProps) {
    return {menu};
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItem);