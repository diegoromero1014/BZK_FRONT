import React, {Component, PropTypes} from 'react';
import {scrollToComponent} from '../../components/scrollTo/scrollComponent';
import $ from 'jquery';
import _ from 'lodash';

const e = {keyCode: 13, consultclick: true};

class comboBoxFilter extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {onKeyPress} = this.props;
        const self = this;
        $("#iconSearchUserFilter").click(function () {
            onKeyPress(e);
        });
    }

    render() {
        const {nameInput, max, labelInput, data, touched, disabled, invalid, error, scrollTo, name, parentId, onChange, onBlur, onKeyPress, onSelect, value} = this.props;
        if (touched && invalid) {
            scrollTo(parentId);
        }
        return (
            <div className={disabled}>
                <div className={`styleWidthComponents ui dropdown search selection fluid ${name} ${disabled}`}
                     style={{border: "0px", zIndex: "1", padding: "0px"}}>
                    <div className="ui icon input" style={{width: "100%"}}>
                        <input className={`prompt ${disabled}`} id="inputParticipantBanc"
                               style={{borderRadius: "3px"}}
                               autoComplete="off"
                               type="text"
                               value={value}
                               onBlur={onBlur}
                               onChange={onChange}
                               placeholder="Ingrese un criterio de búsqueda..."
                               onKeyPress={onKeyPress}
                               onSelect={onSelect}
                               disabled={disabled}
                               maxLength={max}
                        />
                        <i className="search icon" id="iconSearchUserFilter"></i>
                    </div>
                    <div className="menu results" id="resultstUserSearch"></div>
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

comboBoxFilter.PropTypes = {
    nameInput: PropTypes.string,
    labelInput: PropTypes.string,
    data: PropTypes.array,
    textProp: PropTypes.string,
    valueProp: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
    onSelect: PropTypes.func,
    defaultValue: PropTypes.string
};

export default scrollToComponent(comboBoxFilter);
