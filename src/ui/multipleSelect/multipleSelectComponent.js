import React, {Component, PropTypes} from 'react';
import {scrollToComponent} from '../../components/scrollTo/scrollComponent';
import $ from 'jquery';
import _ from 'lodash';

class MultipleSelectComponent extends Component {
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
        if(!_.isEqual(this.state.value, value)){
          selector.dropdown('set selected', value);
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
        const {nameInput, labelInput, style, data, touched, invalid, error, name, disabled, scrollTo, parentId} = this.props;
        if( touched && invalid ){
          scrollTo(parentId);
        }
        return (
            <div style={style}>
                <div className={`styleWidthComponents ui multiple search selection dropdown ${disabled} ${name}`}>
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

MultipleSelectComponent.PropTypes = {
    nameInput: PropTypes.string.isRequired,
    labelInput: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    textProp: PropTypes.string.isRequired,
    valueProp: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object
};

export default scrollToComponent(MultipleSelectComponent);
