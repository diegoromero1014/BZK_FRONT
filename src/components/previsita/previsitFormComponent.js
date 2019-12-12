import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Form, Field, ErrorMessage, withFormik } from 'formik';
import { Input } from 'semantic-ui-react';
import { schema } from './previsitSchema';
import Tooltip from "../toolTip/toolTipComponent";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import DateTimePickerUi from "../../ui/dateTimePicker/dateTimePickerComponent";
import '../../../styles/field/main.scss';
import Participants from './participants';

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
        }
      }
   }

   componentWillMount() {
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

   render() {      
     const { fields: { type, date, duration, place }, activeItemTabClient, activeItemTabBanc, activeItemTabOther } = this.state;
     const { previsitTypes } = this.props;
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
                                  onChange={val => {
                                    setFieldValue(name, val, false);
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
                     <Field type="text" name="date">
                        {({ field: { value, onChange, onBlur } }) =>
                           <div>
                              {this.renderLabel(date)}
                              <DateTimePickerUi
                                  culture='es'
                                  format={"DD/MM/YYYY hh:mm a"}
                                  time={true}
                                  value={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  placeholder='DD/MM/YYYY'
                                  className='field-input'
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
              
              <Row style={{ paddingTop: 70 }}>
                <Col xs>
                  <Participants />
                </Col>
              </Row>
            </Form>
         </div>
      )
   }
}

export default withFormik({
   handleSubmit: () => {
      /**TODO: Submit del formulario */
   },
   mapPropsToValues: (props) => {
      const { previsitData } = props;                  
      if (previsitData) {
         return {
            campo: previsitData.id
         }
      } else {
         return {
            campo: ''
         }
      }
   },
   validationSchema: schema,
   displayName: 'PrevisitForm'
})(PrevisitFormComponent);