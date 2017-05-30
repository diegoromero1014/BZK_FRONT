/**
 * Created by Andres Hurtado on 22/05/2017.
 */
import React, {Component, PropTypes} from 'react';
import {Popup} from 'semantic-ui-react'
import {isUndefined} from 'lodash';

export const TOOLTIP_SIZE = {
    mini: 'mini',
    tiny: 'tiny',
    small: 'small',
    large: 'large',
    huge: 'huge'
};

export const TOOLTIP_POSITION = {
    topLeft: 'top left',
    topRight: 'top right',
    bottomRight: 'bottom right',
    bottomLeft: 'bottom left',
    rightCenter : 'right center',
    leftCenter: 'left center',
    topCenter: 'top center',
    bottomCenter: 'bottom center'
};

export const TOOLTIP_ACTION = {
    hover: 'hover',
    click: 'click',
    focus: 'focus'
};

class ToolTipComponent extends Component {


    render() {

        const {children, text, position, title, action, style, size, inverted, wide} = this.props;
        const _header = isUndefined(title) ? null : title;
        const _position = isUndefined(position) ? 'top left' : position;
        const _style = isUndefined(style) ? null : style;
        const _action = isUndefined(action) ? 'hover' : action;
        const _size = isUndefined(size) ? null : size;
        const _wide = isUndefined(wide) ? true : wide;
        const _inverted = isUndefined(inverted) ? true : inverted;
        return <Popup
            trigger={children}
            header={_header}
            content={text}
            inverted={_inverted}
            wide={_wide}
            style={_style}
            size={_size}
            on={_action}
            position={_position}
        />
    }
}

ToolTipComponent.propTypes = {
    text: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    title: PropTypes.string,
    position: PropTypes.string,
    action: PropTypes.string,
    style: PropTypes.object,
    size: PropTypes.string,
    inverted: PropTypes.bool,
    wide: PropTypes.bool
};

export default ToolTipComponent;