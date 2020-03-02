import React, {Component} from 'react';
import {connect} from 'react-redux';
import ComboBoxFilter from "../../../ui/comboBoxFilter/comboBoxFilter";
import {bindActionCreators} from "redux";
import {filterUsersBanco} from "../../participantsVisitPre/actions";
import {swtShowMessage} from "../../sweetAlertMessages/actions";
import $ from "jquery";

class SearchEmployeeInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            employeeValue: ''
        }
    }

    updateKeyValueUsersBanco = (e) => {
        const { dispatchFilterUserBanco, dispatchSwtShowMessage, onSelect } = this.props;
        const { employeeValue } = this.state;
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

    componentDidMount() {
        const { value } = this.props;
        this.setState({
            employeeValue: value
        });
    }

    onChangeValue = e => {
        const { validateOnChange } = this.props;
        this.setState({employeeValue: e.target.value});
        validateOnChange(e.target.value);
    };

    render() {
        const { onSelect, isEditable } = this.props;
        const { employeeValue } = this.state;
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

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchFilterUserBanco: filterUsersBanco,
        dispatchSwtShowMessage: swtShowMessage
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchEmployeeInput);