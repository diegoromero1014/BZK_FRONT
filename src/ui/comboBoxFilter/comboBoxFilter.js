import React, {Component, PropTypes} from 'react';
import {scrollToComponent} from '../../components/scrollTo/scrollComponent';
import $ from 'jquery';
import _ from 'lodash';

const e = {keyCode: 13, consultclick: true};

export class comboBoxFilter extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {onKeyPress, disabled,idIcon} = this.props;
        const _idIcon = idIcon === undefined ? "iconSearchUserFilter" : idIcon;
        if (_.isEmpty(disabled)) {
            if(!_.isEqual("disabled",disabled)) {
                $(`#${_idIcon}`).click(function (e) {
                    onKeyPress(e);
                });
            }
        }
    }

    render() {
        const {
            nameInput, max, labelInput, data, touched, disabled, invalid, error, scrollTo, name, parentId,
            onChange, onBlur, onKeyPress, onSelect, value, id, idIcon
        } = this.props;
        if (touched && invalid) {
            scrollTo(parentId);
        }
        const _disabled = _.isEmpty(disabled) ? "" : disabled;
        return (
            <div className={_disabled}>
                <div className={`styleWidthComponents ui dropdown search selection fluid ${name} ${_disabled}`}
                     style={{border: "0px", zIndex: "3", padding: "0px"}}>
                    <div className="ui icon input" style={{width: "100%"}}>
                        <input className={`prompt ${_disabled}`} id={id === undefined ? "inputParticipantBanc" : id}
                               style={{borderRadius: "3px"}}
                               autoComplete="off"
                               type="text"
                               value={value}
                               onBlur={onBlur}
                               onChange={onChange}
                               placeholder="Ingrese un criterio de búsqueda..."
                               onKeyPress={onKeyPress}
                               onSelect={onSelect}
                               disabled={_disabled}
                               maxLength={max}
                        />
                        <i disabled={_disabled} className={`search icon ${_disabled}`}
                           id={idIcon === undefined ? "iconSearchUserFilter" : idIcon}/>
                    </div>
                    <div className="menu results" id="resultstUserSearch"/>
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

comboBoxFilter
    .PropTypes = {
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
