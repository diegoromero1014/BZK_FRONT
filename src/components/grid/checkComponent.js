import React, { Component } from 'react';

class CheckComponent extends Component {

    constructor(props) {
        super(props);
        this._checkCheckBox = this._checkCheckBox.bind(this);
    }

    _checkCheckBox(event) {
        this.props.fn.apply(this, this.props.args);
    }

    componentWillMount() {
    }

    render() {
        const { isChecked } = this.props;
        return (
            <td>
                <input name="check" type="checkbox" onChange={this._checkCheckBox}
                    checked={isChecked} />
            </td>
        );
    }
}

export default CheckComponent;
