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

        if(value)
            addAnswer({ [field]: value });
    }

    renderQuestions = values => {
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
                        value={values[field]}
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
        const { answers } = this.props;

        return (
            <div className="ui styled accordion" style={{ width: "100%" }}>
                {this.renderQuestions(answers)}
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