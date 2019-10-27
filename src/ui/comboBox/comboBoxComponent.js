import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import _ from 'lodash';

import { scrollToComponent } from '../../components/scrollTo/scrollComponent';

class comboBoxComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            used: false
        };
        this.mapValuesToDropDown = this.mapValuesToDropDown.bind(this);
        this._setUsed = this._setUsed.bind(this);
        this._changeValue = this._changeValue.bind(this);
        this._setPristine = this._setPristine.bind(this);
        this.existValueToMap = this.existValueToMap.bind(this);

        this.pastValue = null;
        this.pastData = null;

    }

    _setUsed(used) {
        this.setState({
            used
        });
    }

    _clearValues(name) {
        const selector = $(`.ui.selection.dropdown.${name}`);
        selector.dropdown('clear');
    }

    _changeValue(value, name, data) {
        const selector = $(`.ui.selection.dropdown.${name}`);
        let valueField = value;

        if (data && data.length > 0 && !this.existValueToMap(value, data)) {
            this.pastValue = value;
            this.pastData = data;
            valueField = null;
        }

        selector.dropdown('set selected', valueField);
        selector.dropdown('set value', valueField);
        this._setUsed(true);
    }

    existValueToMap(value, dataSource = []) {
        let existValue = false;
        _.forEach(dataSource, function (data) {
            if (_.isEqual(_.toString(value), _.toString(data.id))) {
                existValue = true;
            }
        });

        return existValue;
    }

    _setPristine(labelInput, name) {
        const selector = $(`.ui.selection.dropdown.${name}`);
        selector.dropdown('clear');
        this._setUsed(false);
        selector.dropdown('set text', labelInput);
    }

    componentWillReceiveProps({ value, name, pristine, labelInput, data, filterData }) {
        const selector = $(`.ui.selection.dropdown.${name}`);
        selector.dropdown('refresh');
        const isEmptyAndUsed = _.isEqual(value, '') && this.state.used;
        const valueIsNotEmpty = value !== null && value !== undefined && value !== "";
        const setPristineAgain = (value === null || value === undefined || value === "") && pristine && this.state.used;

        if (setPristineAgain) {
            this._setPristine(labelInput, name);
        } else {
            // Se agrega campo filter data para evitar que se vuelva a seleccionar un valor anteriormente filtrado
            if (this.pastValue && this.pastData != data && !filterData) {
                debugger;
                this._changeValue(this.pastValue, name, data);
            } else if (valueIsNotEmpty) {
                this._changeValue(value, name, data);
            } else {
                if (isEmptyAndUsed) {
                    this._clearValues(name);
                }
            }
        }
    }

    componentDidMount() {
        const { onChange, onBlur, name } = this.props;
        const selector = $(`.ui.selection.dropdown.${name}`);
        const self = this;
        selector.dropdown({
            fullTextSearch: true,
            onChange: function (id, text) {
                self.touched = true;
                self.setState({
                    value: id,
                    used: true
                });
                if (onBlur) {
                    onBlur(id, text);
                }
                if (onChange) {
                    onChange(id, text);
                }
            },
            forceSelection: false,
            selectOnKeydown: false
        });
        selector.dropdown('setting', {
            allowAdditions: false,
            message: { noResults: 'No hay valores que cumplan con el filtro' }
        });
    }

    mapValuesToDropDown(item, idx) {
        const { textProp, valueProp, value } = this.props;
        return (
            <div className="item" data-value={_.get(item, valueProp)} value={value || this.state.value} key={idx}>
                {_.get(item, textProp)}
            </div>
        );
    }

    render() {
        const {
            nameInput, labelInput, data, touched, invalid, error, name, disabled, deployUp, scrollTo, parentId,
            searchClient, shouldHandleUpdate, defaultValue, textProp, valueProp, showEmptyObject
        } = this.props;

        if (touched && invalid && shouldHandleUpdate) {
            scrollTo(parentId);
        }

        let emptyObject = {};
        let comboData;
        let _data = Object.assign([], data);

        if (showEmptyObject) {
            emptyObject[valueProp] = '';
            emptyObject[textProp] = "Seleccione...";
            comboData = [emptyObject, ..._data];
        } else {
            comboData = _data;
        }

        return (
            <div className={disabled} >
                <div
                    className={`styleWidthComponents ui search selection dropdown  ${name} ${deployUp === true ? 'bottom pointing' : ''} ${disabled}`}
                    style={{ minWidth: '7em', marginBottom: '0px' }}>
                    <input type="hidden" name={nameInput} value={defaultValue} disabled={disabled} placeholder="Seleccione..." className={disabled} />
                    <i className="dropdown icon" />
                    <div className={`default text ${searchClient}`}>{labelInput}</div>
                    <div className={`right menu ${name}`}>
                        {_.map(comboData, this.mapValuesToDropDown)}
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
    defaultValue: PropTypes.string
};

comboBoxComponent.defaultProps = {
    showEmptyObject: false,
    filterData: false
}

export default scrollToComponent(comboBoxComponent);