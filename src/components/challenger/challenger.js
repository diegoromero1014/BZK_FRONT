import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';
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
    
    seletedTabActive = e => $(`.${e.target.classList[1]}`).toggleClass('active');

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

    renderQuestions = () => {
        const { questions } = this.props;

        return questions.map(({field, title, nullable, message, placeholder}, index) => 
            <div key={index}>
                <div className={`title ${field} active`} onClick={this.seletedTabActive}>
                    <i className="dropdown icon"></i>
                    
                    <span>{`${title}  ${!nullable ? '(' : ''} `} </span> {!nullable && <span style={{ color: 'red' }}>*</span>}  {!nullable && ' )' }
                    
                    {message && 
                        <ToolTip text={message}>
                            <i className="help circle icon blue" style={{ cursor: "pointer", marginLeft: 10 }} />
                        </ToolTip>
                    }
                </div>

                <div className={`content ${field} active`}>
                    <RichText
                        value={this.getValue(field)}
                        name={field}
                        id={field}
                        style={{ width: '100%', height: '130pt', marginBottom: '10pt' }}
                        placeholder={placeholder}
                        readOnly={false}
                        onChange={value => this.onChange(value, field)}
                    />
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