import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Form, Field, ErrorMessage, withFormik } from 'formik';
import { Input } from 'semantic-ui-react';
import '../../../styles/field/main.scss'; 
import * as Yup from 'yup';

import { schema  } from './previsitSchema';
import Tooltip from "../toolTip/toolTipComponent";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import DateTimePickerUi from "../../ui/dateTimePicker/dateTimePickerComponent";
import RichText from '../richText/richTextComponent';
import Participants from './participants';
import Challenger from '../challenger/challenger';

import { TITLE_MESSAGE_TARGET } from './constants';

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
               name: 'Objetivo de la reunión', 
               nullable: false,
               message: TITLE_MESSAGE_TARGET
            },
            challenger: {
               name: 'Construcción de la Propuesta de Negocio',
               nullable: true,
               message: null
            },
            pqr: {
               name: 'Pendientes, quejas y reclamos',
               nullable: true,
               message: null
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
      </div >
   );

   renderTitle = ({name, message, nullable}) => (
      <div style={{ fontSize: "23px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px",  display: "-webkit-inline-box" }}>
         <span>{`${name}  ${!nullable ? '(' : ''} `} </span>
            {!nullable && <span style={{ color: 'red' }}>*</span>} 
            {!nullable && ' )' }
         
         {message && 
            <Tooltip text={message}>
               <i className="help circle icon blue" style={{ fontSize: "16px", cursor: "pointer", marginLeft: "10px" }} />
            </Tooltip>
         }
      </div>
   );

   changeTypePrevisit = (previsitTypeId) => {
      const { onChangeShowChallengerSection, setFieldValue } = this.props;
      onChangeShowChallengerSection(previsitTypeId, setFieldValue);     
   }

   componentDidMount() {
      this.forceUpdate();
   }

   render() {      
      const { fields: { type, date, duration, place, objective, challenger, pqr } } = this.state;
      const { previsitTypes, commercialReportButtons, showChallengerSection, isEditable } = this.props;
     
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
                     <Field type="text" name="documentType">
                        {({ field: { value, name, onBlur }, form: { setFieldValue } }) =>
                           <div>
                              {this.renderLabel(type)}
                              <ComboBox
                                  name="documentType"
                                  labelInput="Seleccione..."
                                  valueProp={'id'}
                                  textProp={'value'}
                                  value={value}
                                  onChange={(id, val) => {                                                               
                                    setFieldValue(name, id, false);                                                                                                               
                                    this.changeTypePrevisit(id);                                                                        
                                  }}
                                  data={previsitTypes || []}
                                  className='field-input'
                                  disabled={isEditable ? 'disabled' : ''}
                                  parentId="dashboardComponentScroll"
                                  filterData={true}
                              />

                              <ErrorMessage name="documentType" component={'div'} >
                                {message => this.renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }                        
                     </Field>
                  </Col>

                  <Col xs={3}>
                     <Field type="date" name="visitTime">
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
                                  name="visitTime"
                                  disabled={isEditable ? 'disabled' : ''}
                              />
                              <ErrorMessage name="visitTime" component={'div'} >
                                {message => this.renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }

                     </Field>
                  </Col>

                  <Col xs={3}>
                     <Field type="text" name="endTime">
                        {({ field: { value, onChange, onBlur } }) =>
                           <div>
                              {this.renderLabel(duration)}
                              <Input
                                  name="endTime"
                                  value={value}
                                  placeholder="Duración previsita"
                                  type="text"
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  className='field-input'
                                  disabled={isEditable ? 'disabled' : ''}
                              />
                              <ErrorMessage name="endTime" component={'div'} >
                                {message => this.renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }

                     </Field>
                  </Col>

                  <Col xs={3}>
                     <Field type="text" name="visitLocation">
                        {({ field: { value, onChange, onBlur } }) =>
                           <div>
                              {this.renderLabel(place)}
                              <Input
                                value={value}
                                name="visitLocation"
                                type="text"
                                onChange={onChange}
                                placeholder="Lugar"
                                onBlur={onBlur}
                                className='field-input'
                                disabled={isEditable ? 'disabled' : ''}
                              />
                              <ErrorMessage name="visitLocation" component={'div'} >
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
                     <Field type="text" name="principalObjective">
                        {({ field: { value, name }, form: { setFieldValue } }) =>
                           <div>
                              <RichText
                                 name="principalObjective"
                                 id="principalObjective"
                                 value={value}
                                 onChange={val => setFieldValue(name, val, false) }
                                 title="Ingrese el objetivo de la reunión"
                                 style={{ width: '100%', height: '178px' }}
                                 readOnly={false}
                                 disabled={isEditable ? 'disabled' : ''}
                              />
                              <br></br>
                              <ErrorMessage name="principalObjective" component={'div'} >
                                 {message => this.renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }
                     </Field>
                  </Col>
               </Row>   

               {showChallengerSection &&
                  <div>
                     <Row style={{ padding: "20px 23px 20px 20px" }}>
                        <Col xs={12} md={12} lg={12}>
                           {this.renderTitle(challenger)}
                        </Col>
                     </Row>                 
                     <Row style={{ padding: "20px 23px 20px 20px" }}>                     
                        <Col xs={12} md={12} lg={12}>
                           <Challenger />
                        </Col>                     
                     </Row>   
                  </div>
               }      

               <Row style={{ padding: "20px 23px 20px 20px" }}>
                  <Col xs={12} md={12} lg={12}>
                     {this.renderTitle(pqr)}
                  </Col>
               </Row>
                <Row style={{ padding: "0px 23px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <Field type="text" name="observations">
                           {({ field: { value, name }, form: { setFieldValue } }) =>
                              <div>
                                 <RichText
                                    name="observations"
                                    id="observations"
                                    value={value}
                                    onChange={val => setFieldValue(name, val, false) }
                                    title="Ingrese pendientes, quejas y reclamos"
                                    style={{ width: '100%', height: '178px' }}
                                    readOnly={false}
                                    disabled={isEditable ? 'disabled' : ''}
                                 />
                                 <ErrorMessage name="observations" component={'div'} >
                                    {message => this.renderMessageError(message)}
                                 </ErrorMessage>
                              </div>
                           }
                        </Field>
                    </Col>
               </Row>
               {commercialReportButtons}
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
      const { previsitData, questions } = props;
      const fields = {};
      
      questions.forEach(element => fields[element.field] = '' );

      if(previsitData) {
         const { documentType, visitTime, endTime, visitLocation, principalObjective } = previsitData;
         
         return {
            documentType,
            visitTime: new Date(visitTime),
            endTime,
            visitLocation,
            principalObjective
         }
      } else {
         return Object.assign({}, fields,  { documentType: '', visitTime: new Date(), endTime: '', visitLocation: '', principalObjective: ''});
      }
   },
   validationSchema: props => {
      const { questions } = props;

      const object = {};
   
      questions.forEach(element => object[element.field] = Yup.string().required('Esto es obligatorio') );

      const objectSchema = Object.assign({}, schema, object); 
   
      return Yup.object().shape(objectSchema);
   }
})(PrevisitFormComponent);