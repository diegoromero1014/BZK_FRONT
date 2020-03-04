import React, {Component} from 'react';
import {connect} from 'react-redux';
import ComboBoxFilter from "../../../ui/comboBoxFilter/comboBoxFilter";
import {bindActionCreators} from "redux";
import {filterUsersBanco} from "../../participantsVisitPre/actions";
import {swtShowMessage} from "../../sweetAlertMessages/actions";
import $ from "jquery";
import _ from 'lodash';
import {addEmployeeValue, clearEmployeeValue} from "./actions";

export class SearchEmployeeInput extends Component {

    constructor(props) {
        super(props);
    }

    updateKeyValueUsersBanco = (e) => {
        const { dispatchFilterUserBanco, searchEmployeeInputReducer: { employeeValue }, dispatchSwtShowMessage, onSelect } = this.props;
        const selector = $('.ui.search.employee');
        if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
            e.consultclick ? "" : e.preventDefault();
            if (employeeValue !== "" && employeeValue !== null && employeeValue !== undefined) {
                if(employeeValue.length < 3) {
                    dispatchSwtShowMessage('error','Error','Señor usuario, para realizar la búsqueda es necesario ingresar al menos 3 caracteres');
                    return;
                }
                selector.toggleClass('loading');
                dispatchFilterUserBanco(employeeValue).then(data => {
                    const usersBanco = _.get(data, 'payload.data.data');
                    selector.search({
                        cache: false,
                        source: usersBanco,
                        maxResults: 1500,
                        searchFields: [
                            'title',
                            'description'
                        ],
                        onSelect: onSelect
                    });
                    selector.toggleClass('loading');
                    selector.search('search local', employeeValue);
                    setTimeout(function () {
                        $('#employee').focus();
                    }, 150);
                });
            }
        }
    };

    onChangeValue = e => {
        const { validateOnChange, dispatchAddEmployeeValue } = this.props;
        dispatchAddEmployeeValue(e.target.value);
        validateOnChange(e.target.value);
    };

    componentDidMount() {
        const { value, dispatchAddEmployeeValue } = this.props;
        if(value)
            dispatchAddEmployeeValue(value);
    }

    componentWillUnmount() {
        const { dispatchClearEmployeeValue } = this.props;
        dispatchClearEmployeeValue();
    }

    render() {
        const { onSelect, isEditable, searchEmployeeInputReducer: { employeeValue } } = this.props;
        return (
            <div>
                <ComboBoxFilter
                    name="employee"
                    labelInput="Ingrese un criterio de búsqueda..."
                    parentId="dashboardComponentScroll"
                    onChange={this.onChangeValue}
                    value={employeeValue}
                    onSelect={val => onSelect(val)}
                    onKeyPress={e => this.updateKeyValueUsersBanco(e)}
                    max="255"
                    disabled={isEditable ? 'disabled' : ''}
                />
            </div>
        );
    }
}

function mapStateToProps({searchEmployeeInputReducer}) {
    return {
        searchEmployeeInputReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchFilterUserBanco: filterUsersBanco,
        dispatchSwtShowMessage: swtShowMessage,
        dispatchAddEmployeeValue: addEmployeeValue,
        dispatchClearEmployeeValue: clearEmployeeValue
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchEmployeeInput);