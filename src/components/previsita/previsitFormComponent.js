import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Form, Field, ErrorMessage, withFormik } from 'formik';
import { Input } from 'semantic-ui-react';
import { schema } from './previsitSchema';

export class PrevisitFormComponent extends Component {

   state = {
      isEditable: false
   };

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
                                 error={errors.campo && touched.campo}
                                 type="text"
                                 onChange={onChange}
                                 onBlur={onBlur} />
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
   handleSubmit: () => {},

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