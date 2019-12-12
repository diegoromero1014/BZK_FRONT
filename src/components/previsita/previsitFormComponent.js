import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Form, Field, ErrorMessage, withFormik } from 'formik';
import { Input } from 'semantic-ui-react';
import { schema } from './previsitSchema';
import '../../../styles/field/main.scss';
import Tooltip from "../toolTip/toolTipComponent";

export class PrevisitFormComponent extends Component {

   state = {
      isEditable: false
   };

   constructor(props) {
      super(props);
      this.state = {
        fields: {
          type: {
            name: 'Tipo de visita',
            nullable: false,
            message: ''
          }
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
        <strong>
            <span>{`${name}  ${!nullable ? '(' : ''} `} </span>
            {!nullable && <span style={{ color: 'red' }}>*</span>} 
            {!nullable && ' )' }
        </strong>
        <Tooltip text={message}>
            <i className="help circle icon blue" style={{ fontSize: "15px", cursor: "pointer", marginLeft: "5px" }} />
        </Tooltip>
    </div>
  );

   render() {      
     const { fields: { type } } = this.state;
     
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
                     <Field type="text" name="typeVisit" placeholder="Campo">
                        {({ field: { value, onChange, onBlur } }) =>
                           <div>
                              {this.renderLabel(type)}
                              <ComboBox
                                  name="typeVisit"
                                  labelInput="Seleccione..."
                                  valueProp={'id'}
                                  textProp={'value'}
                                  value={value}
                                  onChange={val => this._changeTypePreVisit(val)}
                                  onBlur={onBlur}
                                  data={[]}
                              />
                              <ErrorMessage name="typeVisit" component={'div'} >
                                {message => this.renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }

                     </Field>
                  </Col>

                  <Col xs={3}>
                     <Field type="text" name="campo" placeholder="Campo">
                        {({ field: { value, onChange, onBlur } }) =>
                           <div>
                              <Input
                                 name="campo"
                                 value={value}
                                 placeholder="Duración previsita"
                                 type="text"
                                 onChange={onChange}
                                 onBlur={onBlur} 
                                 className='field-input'
                              />
                              <ErrorMessage name="campo" component={'div'} >
                                {message => this.renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }

                     </Field>
                  </Col>

                  <Col xs={3}>
                     <Field type="text" name="campo" placeholder="Campo">
                        {({ field: { value, onChange, onBlur } }) =>
                           <div>
                              <Input
                                 name="campo"
                                 value={value}
                                 placeholder="Duración previsita"
                                 type="text"
                                 onChange={onChange}
                                 onBlur={onBlur} 
                                 className='field-input'
                              />
                              <ErrorMessage name="campo" component={'div'} >
                                {message => this.renderMessageError(message)}
                              </ErrorMessage>
                           </div>
                        }

                     </Field>
                  </Col>

                  <Col xs={3}>
                     <Field type="text" name="campo" placeholder="Campo">
                        {({ field: { value, onChange, onBlur } }) =>
                           <div>
                              <Input
                                 name="campo"
                                 value={value}
                                 placeholder="Duración previsita"
                                 type="text"
                                 onChange={onChange}
                                 onBlur={onBlur} 
                                 className='field-input'
                              />
                              <ErrorMessage name="campo" component={'div'} >
                                {message => this.renderMessageError(message)}
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
   handleSubmit: () => {
      /**TODO: Submit del formulario */
   },
   mapPropsToValues: (props) => {
      const { previsitReducer } = props;
      const previsitData = previsitReducer.get('detailPrevisit') ? previsitReducer.get('detailPrevisit').data : null;
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