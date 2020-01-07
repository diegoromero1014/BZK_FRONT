import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';
import { Field } from 'formik';

import RichText from '../richText/richTextComponent';
import ToolTip from "../toolTip/toolTipComponent";

import { getAllQuestions, addAnswer, clearAnswer } from './actions';
import { htmlToTextRegex } from '../../actionsGlobal';

export class Challenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMounted: false
        };
    }

    componentWillMount() {
        const { dispatchGetAllQuestions } = this.props;
        dispatchGetAllQuestions();
    }

    selectedTabActive = field => $(`.challenger-dropdown-${field}`).toggleClass('active');

    onChange = (value, field, index) => {
        const { dispatchAddAnswer, answers } = this.props;

        const old = answers.filter(value => value[field])[0];

        if (value) {
            dispatchAddAnswer(old, { id: old ? old.id : index, [field]: value });
        }
    }

    getValue = (field) => {
        const { answers } = this.props;

        const value = answers.filter(value => value[field]);

        return value.length ? value[0][field] : '';
    }

    renderError = (err, field) => {
        if (err[field] && !htmlToTextRegex(this.getValue(field)).length) {
            const fieldDropdown = $(`.challenger-dropdown-${field}`);
            if (!fieldDropdown.hasClass('active')) {
                this.selectedTabActive(field);
            }
            return (
                <div name={`error-${field}`} style={{ marginTop: 10 }}>
                    <div className="ui pointing red basic label"> {err[field]} </div>
                </div>
            )
        }
    }

    renderQuestions = () => {
        const { questions, isEditable } = this.props;
        return questions.map(({ field, title, nullable, message, placeholder, subtitle }, index) => {
            return (
                <div name="mainContainer" key={index}>
                    <div name={field} className={`title ${field} challenger-dropdown-${field}`} onClick={() => this.selectedTabActive(field)}>
                        <i className="dropdown icon"></i>

                        <div name={`title${field}`} style={{ display: "inline-flex" }}>
                            <span name={`title${field}`} onClick={() => this.selectedTabActive(field)}>
                                {`${title}  ${!nullable ? '(' : ''} `}
                            </span> {!nullable && <span style={{ color: 'red' }}>*</span>}  {!nullable && ' )'}
                            <br />
                            {message &&
                                <ToolTip text={message}>
                                    <i className="help circle icon blue" style={{ cursor: "pointer", marginLeft: 10 }} />
                                </ToolTip>
                            }
                        </div>

                        {subtitle &&
                            <span name={`subtitle${field}`} onClick={() => this.selectedTabActive(field)} style={{ marginLeft: 22, fontSize: 11, 'text-align': 'justify', display: 'table', width: '60%' }}>{subtitle}</span>
                        }
                    </div>

                    <div className={`content ${field} challenger-dropdown-${field}`}>
                        <Field type="text" name={field}>
                            {({ field: { name }, form: { setFieldValue, errors } }) =>
                                <div>
                                    <RichText
                                        value={this.getValue(field)}
                                        name={field}
                                        id={field}
                                        style={{ width: '100%', height: '130pt', marginBottom: '10pt' }}
                                        placeholder={placeholder}
                                        readOnly={isEditable}
                                        disabled={!isEditable ? '' : 'disabled'}
                                        onChange={value => {
                                            this.onChange(value, field, index);
                                            setFieldValue(name, value, true);
                                        }}
                                    />
                                    {this.renderError(errors, field)}
                                </div>
                            }
                        </Field>
                    </div>
                </div>
            )
        });
    }

    render() {
        return (
            <div className="ui styled accordion" style={{ width: "100%" }}>
                {this.renderQuestions()}
            </div>
        );
    }
}

const mapStateToProps = ({ questionsReducer: { questions, answers } }) => ({
    questions,
    answers
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchGetAllQuestions: getAllQuestions,
        dispatchAddAnswer: addAnswer,
        dispatchClearAnswer: clearAnswer
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Challenger)