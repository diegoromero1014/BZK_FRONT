import React, {Component, PropTypes} from "react";
import {redirectUrl} from "../globalComponents/actions";
import {Dropdown, Icon} from "semantic-ui-react";
import _ from "lodash";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {changeActiveItemMenu} from './actions';

class MenuListFatherComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showClikdrenItem: false
        };
    }

    _handleClickMenuItemChildren(link, labelText) {
        if (!_.isEqual(link, undefined) && !_.isEqual(link, null)) {
            this.props.changeActiveItemMenu(this.props.labelText);
            redirectUrl(link);
        }
    }

    _mapMenuItemsChildren(item, idx) {
        return (<Dropdown.Item key={_.uniqueId("MenuListFatherComponent_")} onClick={this._handleClickMenuItemChildren.bind(this, item.link)}>
            {!_.isUndefined(item.icon) && 
                <Icon name={item.icon} />
            }
            {item.text}
        </Dropdown.Item>)

    }


    render() {
        const { iconClassName, labelText, linkUrlFather, style, children, labelTextFather, menu} = this.props;
        const activeItem = _.isEqual(menu.get('activeItem'), labelText) ? 'active' : '';
        const iconAndText = (
            <span>
                <Icon name={iconClassName} /> {labelText}
            </span>
        );
        return (
            <Dropdown key={_.uniqueId("MenuListFatherComponent_")} style={style} trigger={iconAndText} className={`link item ${activeItem}`}>
                <Dropdown.Menu>
                    {!_.isUndefined(linkUrlFather) &&
                        <Dropdown.Item key={_.uniqueId("MenuListFatherComponent_")} onClick={this._handleClickMenuItemChildren.bind(this, linkUrlFather)} >
                            {labelTextFather}
                        </Dropdown.Item>
                    }
                    {children.map(this._mapMenuItemsChildren.bind(this))}
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({changeActiveItemMenu}, dispatch);
}

function mapStateToProps({ menu}, ownerProps) {
    return {menu};
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuListFatherComponent);
