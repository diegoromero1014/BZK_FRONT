import React, {Component} from 'react';
import Tooltip from '../toolTip/toolTipComponent';
import {TOOLTIP_SIZE} from '../toolTip/toolTipComponent';
import {htmlToText} from '../../actionsGlobal';
import {isNil} from 'lodash';

class TdComponent extends Component {
    render() {
        const {columnRow, styles, toolTip, headerToolTip} = this.props;
        return (
            <td style={styles}>
                {!isNil(toolTip) ?
                    <Tooltip title={headerToolTip} text={htmlToText(toolTip)} size={TOOLTIP_SIZE.mini}>
                        <div>
                            {columnRow}
                        </div>
                    </Tooltip>
                    :
                    <div>
                        {columnRow}
                    </div>
                }
            </td>
        );
    }
}

export default TdComponent;
