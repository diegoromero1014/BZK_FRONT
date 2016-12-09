import React, {Component} from 'react';

class TdComponent extends Component {
    render() {
        const {columnRow, styles, title} = this.props;
        return (
            <td style={styles}>
                <div title={title}>
                    {columnRow}
                </div>
            </td>
        );
    }
}

export default TdComponent;
