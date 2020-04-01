import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Form, Field, ErrorMessage, withFormik } from 'formik';
import { Input } from 'semantic-ui-react';
import '../../../styles/field/main.scss';
import * as Yup from 'yup';

import { schema } from './previsitSchema';
import Tooltip from "../toolTip/toolTipComponent";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import DateTimePickerUi from "../../ui/dateTimePicker/dateTimePickerComponent";
import RichText from '../richText/richTextComponent';
import Participants from './participants';
import Challenger from '../challenger/challenger';
import { renderLabel, renderMessageError } from '../../functions';

import { TITLE_MESSAGE_TARGET, TITLE_CHALLENGER, HELP_VISIT_TYPE, TITLE_MESSAGE_PENDIENT, TITLE_MESSAGE_ALTERNATIVE_OBJECTIVE, PROPUEST_OF_BUSINESS } from './constants';
import { checkRichTextRequiredBoolean } from '../../validationsFields/rulesField';
import SelectOpportunitiesWeaknesses from '../opportunitiesWeaknesses/SelectOpportunitiesWeaknesses';
import makeAssociateList from '../fieldList/makeAssociateList';
import { listName, objectiveChildrenList, objectivesInitialValues } from '../fieldList/Objetives/utils';
import  '../../../styles/app/previsit.scss';

const Objectives = makeAssociateList(listName, objectiveChildrenList);

export class PrevisitFormComponent extends Component {
   constructor(props) {
      super(props);
      this.state = {
         fields: {
            type: {
               name: 'Tipo de visita',
               nullable: false,
               message: HELP_VISIT_TYPE
            },
            date: {
               name: 'Fecha',
               nullable: false,
               message: null
            },
            duration: {
               name: 'Duración visita - horas',
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
            alternativeObjective: {
               name: '¿Cuál es la propuesta que se le llevará al cliente? ',
               nullable: false,
               message: TITLE_MESSAGE_ALTERNATIVE_OBJECTIVE
            },
            challenger: {
               name: 'Construcción de la Propuesta de Negocio',
               nullable: true,
               message: TITLE_CHALLENGER
            },
            observations: {
               name: 'Pendientes, quejas y reclamos',
               nullable: true,
               message: TITLE_MESSAGE_PENDIENT
            }
         }
      };
   }

   renderTitle = ({ name, message, nullable }) => (
      <div style={{ fontSize: "23px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px", display: "-webkit-inline-box" }}>
         <i className="browser icon" style={{ fontSize: "20px" }} />
         <span>{`${name} ${!nullable ? '(' : ''}`}</span>
         {!nullable && <span style={{ color: 'red' }}>*</span>}
         {!nullable && ')'}

         {message &&
            <Tooltip text={message}>
               <i className="help circle icon blue" style={{ fontSize: "16px", cursor: "pointer", marginLeft: "10px" }} />
            </Tooltip>
         }
      </div>
   );

   changeTypePrevisit = previsitTypeId => {
      const { onChangeShowChallengerSection, setFieldValue } = this.props;
      onChangeShowChallengerSection(previsitTypeId, setFieldValue);
   }

   componentDidMount() {
      this.forceUpdate();
   }

   render() {
      const { fields: { type, date, duration, place, objective, challenger, observations, alternativeObjective } } = this.state;
      const { previsitTypes, commercialReportButtons, showChallengerSection, isEditable, setFieldValue, previsitType } = this.props;

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
                        {({ field: { value, name, onBlur } }) =>
                           <div>
                              {renderLabel(type)}
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
                                 onBlur={onBlur}
                                 data={previsitTypes || []}
                                 className='field-input'
                                 disabled={isEditable ? 'disabled' : ''}
                                 parentId="dashboardComponentScroll"
                                 filterData={true}
                              />

                              <ErrorMessage name="documentType" component={'div'} >
                                 {message => renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }
                     </Field>
                  </Col>

                  <Col xs={3}>
                     <Field type="date" name="visitTime">
                        {({ field: { value, name, onBlur } }) =>
                           <div>
                              {renderLabel(date)}
                              <DateTimePickerUi
                                 culture='es'
                                 format={"DD/MM/YYYY hh:mm a"}
                                 time={true}
                                 value={value}
                                 onChange={val => setFieldValue(name, val, false)}
                                 onBlur={onBlur}
                                 placeholder='DD/MM/YYYY'
                                 className='field-input'
                                 name="visitTime"
                                 disabled={isEditable ? 'disabled' : ''}
                              />
                              <ErrorMessage name="visitTime" component={'div'} >
                                 {message => renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }

                     </Field>
                  </Col>

                  <Col xs={3}>
                     <Field type="text" name="endTime">
                        {({ field: { value, onChange, onBlur } }) =>
                           <div>
                              {renderLabel(duration)}
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
                                 {message => renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }

                     </Field>
                  </Col>

                  <Col xs={3}>
                     <Field type="text" name="visitLocation">
                        {({ field: { value, onChange, onBlur } }) =>
                           <div>
                              {renderLabel(place)}
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
                                 {message => renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }

                     </Field>
                  </Col>
               </Row>

               <Row style={{ paddingTop: 70, width: '99%', paddingLeft: 20 }}>
                  <Col xs>
                     <Participants disabled={isEditable} limitParticipantsByClient={10} />
                  </Col>
               </Row>

               <Row style={{ padding: "20px 23px 20px 20px" }}>
                  <Col xs={12} md={12} lg={12}>
                     <Objectives isEditable={!isEditable} initialValues={objectivesInitialValues} />
                  </Col>
               </Row>

               <Row style={{ padding: "20px 23px 20px 20px" }}>
                  <Col xs={12} md={12} lg={12}>
                     <SelectOpportunitiesWeaknesses isEditable={isEditable} />
                  </Col>
               </Row>

               <Row style={{ padding: "20px 23px 20px 20px" }}>
                  <Col xs={12} md={12} lg={12}>
                     {this.renderTitle(previsitType === PROPUEST_OF_BUSINESS.toUpperCase() ? alternativeObjective : objective)}
                  </Col>
               </Row>

               <Row style={{ padding: "0px 23px 20px 20px" }}>
                  <Col xs={12} md={12} lg={12}>
                     <Field type="text" name="principalObjective">
                        {({ field: { value, name } }) =>
                           <div>
                              <RichText
                                 name="principalObjective"
                                 id="principalObjective"
                                 value={value}
                                 onChange={val => setFieldValue(name, val, false)}
                                 title="Ingrese el objetivo de la reunión"
                                 style={{ width: '100%', height: '178px' }}
                                 readOnly={isEditable}
                                 disabled={!isEditable ? '' : 'disabled'}
                              />
                              <br></br>
                              <ErrorMessage name="principalObjective" component={'div'} >
                                 {message => renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }
                     </Field>
                  </Col>
               </Row>

               {showChallengerSection &&
                  <div>
                     <Row style={{ padding: "10px 10px 20px 20px" }}>
                        <Col xs={12} md={12} lg={12}>
                           {this.renderTitle(challenger)}
                        </Col>
                     </Row>
                     <Row style={{ padding: "20px 23px 20px 20px" }}>
                        <Col xs={12} md={12} lg={12}>
                           <Challenger isEditable={isEditable} />
                        </Col>
                     </Row>
                  </div>
               }
               {commercialReportButtons(setFieldValue)}

               <Row style={{ padding: "20px 23px 20px 20px" }}>
                  <Col xs={12} md={12} lg={12}>
                     {this.renderTitle(observations)}
                  </Col>
               </Row>

               <Row style={{ padding: "0px 23px 20px 20px" }}>
                  <Col xs={12} md={12} lg={12}>
                     <Field type="text" name="observations">
                        {({ field: { value, name } }) =>
                           <div>
                              <RichText
                                 name="observations"
                                 id="observations"
                                 value={value}
                                 onChange={val => setFieldValue(name, val, false)}
                                 title="Pendientes, quejas y reclamos"
                                 style={{ width: '100%', height: '178px' }}
                                 readOnly={isEditable}
                                 disabled={!isEditable ? '' : 'disabled'}
                              />
                              <br></br>
                              <ErrorMessage name="observations" component={'div'} >
                                 {message => renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }
                     </Field>
                  </Col>
               </Row>
            </Form>
         </div>
      )
   }
}

export default withFormik({
   handleSubmit: (values, { props }) => {
      props.onSubmit(values);
   },

   mapPropsToValues: (props) => {
      const { previsitData, questions } = props;
      const fields = {};

      questions.forEach(element => fields[element.field] = '');

      if (previsitData) {
         const { documentType, visitTime, endTime, visitLocation, principalObjective, documentStatus, observations } = previsitData;

         previsitData.answers.forEach(element => fields[element.field] = element.answer);

         return Object.assign({}, fields, { documentType, visitTime: new Date(visitTime), endTime, visitLocation, principalObjective, documentStatus, observations })
      } else {
         return Object.assign({}, fields, { documentType: '', visitTime: new Date(), endTime: '', visitLocation: '', principalObjective: '', documentStatus: undefined, observations: '' });
      }
   },
   validationSchema: ({ questions, showChallengerSection }) => {
      const object = {};
      if (showChallengerSection) {
         questions.forEach(element => object[element.field] = Yup.string()
            .when("documentStatus", {
               is: 1,
               then: Yup.string().test(`${element.title}richTextRequired`, `La pregunta ${element.title} es obligatoria`, value => checkRichTextRequiredBoolean(value))
            }));
      }
      const objectSchema = Object.assign({}, schema, object);
      return Yup.object().shape(objectSchema);
   }
})(PrevisitFormComponent);