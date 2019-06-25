import React, { Component } from 'react';
import { Popup, List } from 'semantic-ui-react';

class Tooltip extends Component {
    renderOptions = () => {
        const { options } = this.props;

        return options.map((option, index) => (
            <List.Item id={index}>
                {option.isFulfilled ? <List.Icon color="green" name="check circle outline" /> : <List.Icon color="red" name="circle outline" />}
                <List.Content>{option.message}</List.Content>
            </List.Item>
        ));
    }

    render() {
        return (
            <Popup trigger={this.props.children} flowing hoverable inverted >
                <List id="tooltip-generar-pdf">
                    {this.renderOptions()}
                </List>
            </Popup>
        );
    }
}

export default Tooltip;