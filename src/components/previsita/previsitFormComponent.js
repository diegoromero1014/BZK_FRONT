import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Form, Field, ErrorMessage, withFormik } from 'formik';
import Input from "../../ui/input/inputComponent";
import { schema } from './previsitSchema';

export class PrevisitFormComponent extends Component {
  
  constructor(props) {
      super(props);
   }

   componentWillMount() {
   }

   renderMessageError = err => (
    <div>
        <div className="ui pointing red basic label"> {err} </div>
    </div>
  );

   render() {       
      const {isEditable, previsitData} = this.props;       
      return (
         <div>                  
            <Form>               
               <Row>
                  <Col>
                     <Field type="text" name="campo" placeholder="Campo">
                        {({ field: { value, onChange, onBlur }, form: { errors, touched } }) =>
                        <div>
                          <Input
                              name="campo"
                              value={value}                                                
                              placeholder="Duración previsita"
                              type="text"
                              onChange={onChange}
                              onBlur={onBlur}
                              disabled={!isEditable ? '' : 'disabled'}                              
                            />
                          <ErrorMessage name="campo" component={'div'} style={{color: 'red', marginTop: 3}}>
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
   handleSubmit: () => {},

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