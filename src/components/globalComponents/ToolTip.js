import React, { Component } from 'react';
import { Popup, List } from 'semantic-ui-react';

class Tooltip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: [
                {
                    message: 'Option 1',
                    isFulfilled: false
                },

                {
                    message: 'Option 2',
                    isFulfilled: true
                },

                {
                    message: 'Option 3',
                    isFulfilled: false
                },

                {
                    message: 'Option 4',
                    isFulfilled: true
                }
            ]
        }
    }

    renderOptions = () => {
        const { options } = this.state;

        return options.map(option => {
            <List.Item id="tooltip-item1">
                {option.isFulfilled ? <List.Icon color="green" name="check" /> : <List.Icon color="red" name="close" />}
                <List.Content>{option.message}</List.Content>
            </List.Item>

        })
    }

    render() {
        return (
            <div className="tooltip">
                <Popup
                    trigger={
                        <button
                            className="btn"
                            type="button"
                            style={{ backgroundColor: "#eb984e" }}
                            id="btn-generar-pdf"><span>Generar PDF</span>
                        </button>
                    }
                    flowing
                    hoverable
                    inverted
                >
                    <List id="tooltip-generar-pdf">
                        {this.renderOptions}
                    </List>

                </Popup>
            </div>
        );
    }
}

export default Tooltip;