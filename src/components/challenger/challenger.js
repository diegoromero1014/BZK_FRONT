import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';
import { Field } from 'formik';

import RichText from '../richText/richTextComponent';
import ToolTip from "../toolTip/toolTipComponent";

import { getAllQuestions, addAnswer } from './actions';

class Challenger extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const { getAllQuestions } = this.props;

        getAllQuestions();
    }
    
    seletedTabActive = field => $(`.challenger-dropdown-${field}`).toggleClass('active'); 
    
    onChange = (value, field) => {
        const { addAnswer, answers } = this.props;

        const old = answers.filter(value => value[field])[0];

        if(value)
            addAnswer(old,  { id: old ? old.id : null, [field]: value });
    }

    getValue = field => {
        const { answers } = this.props;

        const value = answers.filter(value => value[field]);

        return value.length ? value[0][field] : ''
    }

    renderError = (err, field) => {
        if(err[field]) {
            this.seletedTabActive(field);
            return (
                <div style={{ marginTop: 10 }}>
                    <div className="ui pointing red basic label"> {err[field]} </div>
                </div>
            )
        }
    }

    renderQuestions = () => {
        const { questions, isEditable } = this.props;

        return questions.map(({ field, title, nullable, message, placeholder, subtitle }, index) => 
            <div key={index}>
                <div className={`title ${field} challenger-dropdown-${field}`} onClick={() => this.seletedTabActive(field)}>
                    <i className="dropdown icon"></i>
                    
                    <div style={{ display: "inline-flex"}}>
                        <span onClick={() => this.seletedTabActive(field)}>
                            {`${title}  ${!nullable ? '(' : ''} `} 
                        </span> {!nullable && <span style={{ color: 'red' }}>*</span>}  {!nullable && ' )' }
                        <br />
                        {message && 
                            <ToolTip text={message}>
                                <i className="help circle icon blue" style={{ cursor: "pointer", marginLeft: 10 }} />
                            </ToolTip>
                        }
                    </div>

                    {subtitle &&
                        <span onClick={() => this.seletedTabActive(field)} style={{ marginLeft: 22, fontSize: 11, 'text-align': 'justify', display: 'table', width: '60%' }}>{subtitle}</span>
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
                                    this.onChange(value, field);
                                    
                                    if(value) {
                                        setFieldValue(name, value, false);
                                    }
                                }}
                              />

                              {this.renderError(errors, field)}                                
                           </div>
                        }
                     </Field>
                </div>
            </div>
        );
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
        getAllQuestions,
        addAnswer
    }, dispatch)
};
 
export default connect(mapStateToProps, mapDispatchToProps)(Challenger)