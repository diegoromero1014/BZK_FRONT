import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Form, Field, ErrorMessage, withFormik } from 'formik';
import { Input } from 'semantic-ui-react';
import { schema } from './previsitSchema';
import Tooltip from "../toolTip/toolTipComponent";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import DateTimePickerUi from "../../ui/dateTimePicker/dateTimePickerComponent";
import RichText from '../richText/richTextComponent';
import Participants from './participants';
import Challenger from '../challenger/challenger';
import { TITLE_MESSAGE_TARGET, TITLE_MESSAGE_PENDIENT } from './constants';

import '../../../styles/field/main.scss'; 

export class PrevisitFormComponent extends Component {
   constructor(props) {
      super(props);
      this.state = {
         fields: {
            type: {
               name: 'Tipo de visita',
               nullable: false,
               message: 'asdasdasd'
            },

            date: {
               name: 'Fecha',
               nullable: false,
               message: null
            },

            duration: {
               name: 'Duración previsita - horas',
               nullable: false,
               message: null
            },

            place: {
               name: 'Lugar',
               nullable: false,
               message: null
            },
            objective: {
               name: 'Objectivo de la reunión', 
               nullable: false,
               message: TITLE_MESSAGE_TARGET
            },
            pending: {
               name: 'Pendientes, quejas y reclamos',
               nullable: true,
               message: TITLE_MESSAGE_PENDIENT
            }
         },
         type: null
      };
   }

   renderMessageError = err => (
      <div>
         <div className="ui pointing red basic label"> {err} </div>
      </div>
   );

   renderLabel = ({name, message, nullable}) => (
      <div style={{ display: 'flex', 'flex-direction': 'row', 'justify-content': 'space-between' }}>
         <strong style={{ marginBottom: 10 }}>
               <span>{`${name}  ${!nullable ? '(' : ''} `} </span>
               {!nullable && <span style={{ color: 'red' }}>*</span>} 
               {!nullable && ' )' }
         </strong>

         {message !== null && 
            <Tooltip text={message}>
               <i className="help circle icon blue" style={{ fontSize: "15px", cursor: "pointer", marginLeft: "5px" }} />
            </Tooltip>
         }
      </div>
   );

   renderTitle = ({name, message, nullable}) => (
      <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
         <span>{`${name}  ${!nullable ? '(' : ''} `} </span>
            {!nullable && <span style={{ color: 'red' }}>*</span>} 
            {!nullable && ' )' }
         
         <Tooltip text={message}>
            <i className="help circle icon blue" style={{ fontSize: "18px", cursor: "pointer", marginLeft: "10px" }} />
         </Tooltip>
      </div>
   );

   render() {      
      const { fields: { type, date, duration, place, objective, pending } } = this.state;
      const { previsitTypes, children } = this.props;
     
      return (
         <div>                   
            <Form style={{ backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>               
              <Row style={{ padding: "10px 10px 20px 20px" }}>
                  <Col xs={12} md={12} lg={12}>
                      <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                          <div className="tab-content-row"
                              style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                          <i className="browser icon" style={{ fontSize: "20px" }} />
                          <span style={{ fontSize: "20px" }}> Datos de visita</span>
                      </div>
                  </Col>
              </Row>             
               <Row style={{ width: '99%', paddingLeft: 20 }}>
                  <Col xs={3}>
                     <Field type="text" name="typeVisit">
                        {({ field: { value, name, onBlur }, form: { setFieldValue } }) =>
                           <div>
                              {this.renderLabel(type)}
                              <ComboBox
                                  name="typeVisit"
                                  labelInput="Seleccione..."
                                  valueProp={'id'}
                                  textProp={'value'}
                                  value={value}
                                  onChange={(id, val) => {
                                       setFieldValue(name, id, false);
                                  }}
                                  onBlur={onBlur}
                                  data={previsitTypes}
                                  className='field-input'
                              />
                              <ErrorMessage name="typeVisit" component={'div'} >
                                {message => this.renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }

                     </Field>
                  </Col>

                  <Col xs={3}>
                     <Field type="date" name="date">
                        {({ field: { value, name, onBlur }, form: { setFieldValue } }) =>
                           <div>
                              {this.renderLabel(date)}
                              <DateTimePickerUi
                                  culture='es'
                                  format={"DD/MM/YYYY hh:mm a"}
                                  time={true}
                                  value={value}
                                  onChange={val => setFieldValue(name, val, false) }
                                  onBlur={onBlur}
                                  placeholder='DD/MM/YYYY'
                                  className='field-input'
                                  name="date"
                              />
                              <ErrorMessage name="date" component={'div'} >
                                {message => this.renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }

                     </Field>
                  </Col>

                  <Col xs={3}>
                     <Field type="text" name="duration">
                        {({ field: { value, onChange, onBlur } }) =>
                           <div>
                              {this.renderLabel(duration)}
                              <Input
                                  name="duration"
                                  value={value}
                                  placeholder="Duración previsita"
                                  type="text"
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  className='field-input'
                              />
                              <ErrorMessage name="duration" component={'div'} >
                                {message => this.renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }

                     </Field>
                  </Col>

                  <Col xs={3}>
                     <Field type="text" name="place">
                        {({ field: { value, onChange, onBlur } }) =>
                           <div>
                              {this.renderLabel(place)}
                              <Input
                                value={value}
                                name="place"
                                type="text"
                                onChange={onChange}
                                placeholder="Lugar"
                                onBlur={onBlur}
                                className='field-input'
                              />
                              <ErrorMessage name="place" component={'div'} >
                                {message => this.renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }

                     </Field>
                  </Col>
               </Row>
              
              <Row style={{ paddingTop: 70, width: '99%', paddingLeft: 20 }}>
                <Col xs>
                  <Participants />
                </Col>
              </Row>

              <Row style={{ padding: "20px 23px 20px 20px" }}>
                  <Col xs={12} md={12} lg={12}>
                     {this.renderTitle(objective)}
                  </Col>
              </Row>

              <Row style={{ padding: "0px 23px 20px 20px" }}>
                  <Col xs={12} md={12} lg={12}>
                     <Field type="text" name="targetPrevisit">
                        {({ field: { value, name }, form: { setFieldValue } }) =>
                           <div>
                              <RichText
                                 name="targetPrevisit"
                                 id="targetPrevisit"
                                 value={value}
                                 onChange={val => setFieldValue(name, val, false) }
                                 title="Ingrese el objetivo de la reunión"
                                 style={{ width: '100%', height: '178px' }}
                                 readOnly={false}
                              />
                              <ErrorMessage name="targetPrevisit" component={'div'} >
                                 {message => this.renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }
                     </Field>
                  </Col>
               </Row>

               <Row style={{ padding: "20px 23px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <Challenger />
                    </Col>
                </Row>

               <Row style={{ padding: "20px 23px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        {this.renderTitle(pending)}
                    </Col>
                </Row>

                <Row style={{ padding: "0px 23px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <Field type="text" name="pendingPrevisit">
                           {({ field: { value, name }, form: { setFieldValue } }) =>
                              <div>
                                 <RichText
                                    name="pendingPrevisit"
                                    id="pendingPrevisit"
                                    value={value}
                                    onChange={val => setFieldValue(name, val, false) }
                                    title="Ingrese pendientes, quejas y reclamos"
                                    style={{ width: '100%', height: '178px' }}
                                    readOnly={false}
                                 />
                                 <ErrorMessage name="pendingPrevisit" component={'div'} >
                                    {message => this.renderMessageError(message)}
                                 </ErrorMessage>
                              </div>
                           }
                        </Field>
                    </Col>
               </Row>
               
               {children}
            </Form>            
         </div>         
      )
   }
}

export default withFormik({
   handleSubmit: (values, { props, setSubmitting }) => {
      setSubmitting(false);
      props.onSubmit(values);
   },
   mapPropsToValues: (props) => {
         return {
            typeVisit: '',
            date: new Date(),
            duration: '',
            place: '',
            targetPrevisit: '',
            pendingPrevisit: '',
            clientTeach: ''
         }
      
   },
   validationSchema: schema
})(PrevisitFormComponent);