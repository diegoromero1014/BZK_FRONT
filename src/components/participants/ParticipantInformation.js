import React, { Component } from 'react';
import { Form, Field, ErrorMessage, withFormik } from 'formik';
import { Row, Col } from 'react-flexbox-grid';
import { Input } from 'semantic-ui-react';
import { renderLabel, renderMessageError }  from '../../functions';
import ElementsComponent from '../elements';
import { schema } from './schema';

class ParticipantInformation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fields: {
                name: {
                    name: 'Nombre',
                    nullable: false,
                    message: null
                },

                position: {
                    name: 'Cargo',
                    nullable: true,
                    message: null
                },

                socialStyle: {
                    name: 'Estilo social',
                    nullable: true,
                    message: null
                },

                attitude: {
                    name: 'Actitud frente al grupo',
                    nullable: true,
                    message: null
                }
            }
        }
    }

    render() {
        const { fields: { name, position, socialStyle, attitude } } = this.state;

        return (
            <Form style={{ backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>
                <Row style={{ padding: "10px 10px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="browser icon" style={{ fontSize: "20px" }} />
                            <span style={{ fontSize: "20px" }}> Información general</span>
                        </div>
                    </Col>
                </Row>

                <Row style={{ width: '99%', paddingLeft: 20, marginTop: 20 }}>
                    <Col xs={12}>
                        <Field type="text" name="name">
                            {({ field: { value, onChange, onBlur } }) =>
                                <div>
                                    {renderLabel(name)}
                                    <Input
                                        name="name"
                                        value={value}
                                        placeholder="Nombre"
                                        type="text"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className='field-input'
                                        disabled={true}
                                    />
                                    <ErrorMessage name="name" component={'div'} >
                                        {message => renderMessageError(message)}
                                    </ErrorMessage>
                                </div>
                            }
                        </Field>
                    </Col>
                </Row>

                <Row style={{ width: '99%', paddingLeft: 20, marginTop: 20 }}>
                    <Col xs={12}>
                        <Field type="text" name="position">
                            {({ field: { value, onChange, onBlur } }) =>
                                <div>
                                    {renderLabel(position)}
                                    <Input
                                        name="position"
                                        value={value}
                                        placeholder="Cargo"
                                        type="text"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className='field-input'
                                        disabled={true}
                                    />
                                    <ErrorMessage name="position" component={'div'} >
                                        {message => renderMessageError(message)}
                                    </ErrorMessage>
                                </div>
                            }
                        </Field>
                    </Col>
                </Row>


                <Row style={{ width: '99%', paddingLeft: 20, marginTop: 20 }}>
                    <Col xs={6}>
                        <Field type="text" name="socialStyle">
                            {({ field: { value, onChange, onBlur } }) =>
                                <div>
                                    {renderLabel(socialStyle)}
                                    <Input
                                        name="socialStyle"
                                        value={value}
                                        placeholder="Estilo social"
                                        type="text"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className='field-input'
                                        disabled={true}
                                    />
                                    <ErrorMessage name="socialStyle" component={'div'} >
                                        {message => renderMessageError(message)}
                                    </ErrorMessage>
                                </div>
                            }
                        </Field>
                    </Col>

                    <Col xs={6}>
                        <Field type="text" name="attitude">
                            {({ field: { value, onChange, onBlur } }) =>
                                <div>
                                    {renderLabel(attitude)}
                                    <Input
                                        name="attitude"
                                        value={value}
                                        placeholder="Actitud frente al grupo"
                                        type="text"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className='field-input'
                                        disabled={true}
                                    />
                                    <ErrorMessage name="attitude" component={'div'} >
                                        {message => renderMessageError(message)}
                                    </ErrorMessage>
                                </div>
                            }
                        </Field>
                    </Col>
                </Row>

                <Row style={{ padding: "10px 10px 20px 20px", marginTop: 40 }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="browser icon" style={{ fontSize: "20px" }} />
                            <span style={{ fontSize: "20px" }}> Objetivos del interlocutor</span>
                        </div>
                    </Col>
                </Row>

                <Row style={{ marginTop: '-65px' }}> 
                    <Col xs={12} md={12} lg={12}>
                        <ElementsComponent schema={schema} placeholder='Objectivos' messageButton='Agregar' name={'objectives'} />
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default withFormik({
    handleSubmit: (values) => {
       console.log(values);
    },
    mapPropsToValues: ({ selectedRecord }) => {
        
        if(selectedRecord) {
            const { nameComplet, contactPosition, contactSocialStyle, contactActitudeCompany } = selectedRecord;
            return {
                name: nameComplet,
                position:  !contactPosition ? '' : contactPosition,
                socialStyle: !contactSocialStyle ? '' : contactSocialStyle,
                attitude: !contactActitudeCompany ? '' : contactActitudeCompany
            }
        } else {
            return {
                name: '',
                position: '',
                socialStyle: '',
                attitude: ''
            }
        }
    }
 })(ParticipantInformation);