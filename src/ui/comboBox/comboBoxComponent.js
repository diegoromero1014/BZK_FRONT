import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import _ from 'lodash';

class comboBoxComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.mapValuesToDropDown = this.mapValuesToDropDown.bind(this);
    }

    componentWillReceiveProps({value, name}) {
        const selector = $(`.ui.selection.dropdown.${name}`);
        if (_.isEqual(value, '')) {
            selector.dropdown('clear');
        }
    }

    componentDidMount() {
        const {onChange, onBlur, name, defaultValue} = this.props;
        const selector = $(`.ui.selection.dropdown.${name}`);
        const self = this;
        selector.dropdown({
            onChange: function (id, text) {
                self.touched = true;
                self.setState({
                    value: id
                });
                onBlur(id, text);
                onChange(id, text);
            }
        });
        selector.dropdown('set selected', defaultValue);
    }

    mapValuesToDropDown(item, idx) {
        const {textProp, valueProp, value} = this.props;
        return (
            <div className="item" data-value={_.get(item, valueProp)} value={value || this.state.value} key={idx}>
                {_.get(item, textProp)}
            </div>
        );
    }

    render() {
        const {nameInput, labelInput, style, data, touched, error, name} = this.props;

        return (
            <div style={style}>
                <div className={`styleWidthCompoentns ui search selection dropdown ${name}`}>
                    <input type="hidden" name={nameInput}/>
                    <i className="dropdown icon"/>
                    <div className="default text">{labelInput}</div>
                    <div className="menu">
                        {_.map(data, this.mapValuesToDropDown)}
                    </div>
                </div>
                {
                    touched && error &&
                    <div>
                        <div className="ui pointing red basic label">
                            {error}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

comboBoxComponent.PropTypes = {
    nameInput: PropTypes.string.isRequired,
    labelInput: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    textProp: PropTypes.string.isRequired,
    valueProp: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object
};

export default comboBoxComponent;
