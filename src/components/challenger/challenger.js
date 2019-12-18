import React, { Component } from 'react';
import $ from 'jquery';
import RichText from '../richText/richTextComponent';
import ToolTip from "../toolTip/toolTipComponent";
import { TITLE_CLIENT_TEACH } from './constants';

class Challenger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questions: [
                {
                    field: 'clientTeach',
                    name: '¿Qué le enseñará al cliente?',
                    nullable: false,
                    message: TITLE_CLIENT_TEACH,
                    placeholder: 'placeholder'
                },
                {
                    field: 'clientTeach1',
                    name: '¿Qué le enseñará al cliente?',
                    nullable: false,
                    message: TITLE_CLIENT_TEACH,
                    placeholder: 'placeholder'
                },
                {
                    field: 'clientTeach2',
                    name: '¿Qué le enseñará al cliente?',
                    nullable: false,
                    message: TITLE_CLIENT_TEACH,
                    placeholder: 'placeholder'
                }
            ],
            values: {}
        }
    }

    seletedTabActive = e => $(`.${e.target.classList[1]}`).toggleClass('active');

    onChange = (value, field) => {
        this.setState(({ values }) => ({ values:  Object.assign(values, { [field]: value }) }));
    }

    renderQuestions = values => {
        const { questions } = this.state;

        return questions.map(({field, name, nullable, message, placeholder}) => 
            <div>
                <div className={`title ${field} active`} onClick={this.seletedTabActive}>
                    <i className="dropdown icon"></i>
                    
                    <span>{`${name}  ${!nullable ? '(' : ''} `} </span> {!nullable && <span style={{ color: 'red' }}>*</span>}  {!nullable && ' )' }
                    
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
        const { values } = this.state;

        return (
            <div className="ui styled accordion" style={{ width: "100%" }}>
                {this.renderQuestions(values)}
                <button onClick={this.onChange}>asdasda</button>
            </div>
        );
    }
}

export default Challenger;