import React, { Component } from 'react';
import _ from 'lodash';
import { Icon, TextArea } from 'semantic-ui-react';
import { Row, Col } from 'react-flexbox-grid';
import { Field, ErrorMessage, withFormik } from 'formik';
import { renderMessageError }  from '../../functions';
import ToolTip from '../toolTip/toolTipComponent';
import '../../../styles/elements/main.scss';


class ElementsComponent extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            show: false
        }
    }
    

    render() {
        const { placeholder, messageButton, handleSubmit} = this.props;
        const { show } = this.state;
        
        return (
            <form>
                <div className={'elements-container'}>
                    <Row style={{ padding: "10px 10px 20px 20px", marginBottom: 70 }} end="xs">
                        <Col xs={12} md={12} lg={12}>
                            <ToolTip text={messageButton}>
                                <Icon 
                                    className='icon-message-elements' 
                                    size='huge' 
                                    name={'add square'} 
                                    style={{ color: '#16498b', fontSize: '34pt !important', margin: '0px 20px 10px 20px' }}
                                    onClick={() => this.setState({ show: true})}
                                />  
                            </ToolTip>
                        </Col>
                    </Row>
                        
                    { show && 
                        <Row style={{ width: '99%', paddingLeft: 20 }}>
                            <Col xs={10} md={10} lg={10}>
                                <Field type="text" name="field">
                                    {({ field: { value, name, onChange, onBlur }, form: {errors } }) =>
                                        <div>
                                            <TextArea
                                                name={name} 
                                                id={name} 
                                                cols="30" 
                                                rows="10"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                placeholder={placeholder}
                                                className={`field ${errors[name] ? 'error': '' }`}
                                            />
                                            <br></br>

                                            <ErrorMessage name={name} component={'div'} >
                                                {message => renderMessageError(message)}
                                            </ErrorMessage>
                                        </div>
                                    }
                                </Field>
                            </Col>
                            
                            <Col xs={2} md={2} lg={2}>
                                <Col xs={12} md={12} lg={12}>
                                    <button 
                                        type="submit" 
                                        className='button-primary' 
                                        onClick={event => { 
                                            event.preventDefault(); 
                                            handleSubmit(); 
                                            
                                            if(this.props.isValid) {
                                                this.setState({ show: false });
                                            }
                                        }}
                                    >
                                        Agregar
                                    </button> 
                                </Col>
                                <Col xs={12} md={12} lg={12}>
                                    <button 
                                        type="button" 
                                        className='button-secondary' 
                                        onClick={() => this.setState({ show: false })}
                                    >
                                        Cancelar
                                    </button> 
                                </Col>
                            </Col>
                        </Row>
                    }
                </div> 
            </form>
        );
    }
}


export default withFormik({
    handleSubmit: (values, { setSubmitting, props }) => {
        setSubmitting(false);
        console.log(values);      
    },
    mapPropsToValues: () => ({ field: '' }),
    validationSchema: ({ schema }) => schema
})(
    ElementsComponent
);