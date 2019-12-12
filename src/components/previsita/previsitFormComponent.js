import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { Form, Field, ErrorMessage, withFormik } from 'formik';
import { EDITAR } from '../../constantsGlobal';
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
    const {reducerGlobal} = this.props;
    return (
      <div>
        <Form style={{ backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>
            <Row style={{ padding: "5px 10px 0px 20px" }}>
              <Col xs={10} sm={10} md={10} lg={10}>
                  <span>Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</span>
              </Col>
              <Col xs={2} sm={2} md={2} lg={2}>
                  {
                      _.get(reducerGlobal.get('permissionsPrevisits'), _.indexOf(reducerGlobal.get('permissionsPrevisits'), EDITAR), false) && (!this.state.isEditable) &&
                      <button type="button" onClick={this._editPreVisit}
                          className={'btn btn-primary modal-button-edit'}
                          style={{ marginRight: '15px', float: 'right', marginTop: '-15px' }}>Editar <i
                              className={'icon edit'}></i></button>
                  }
              </Col>
            </Row>
            <Row>
              <Col>
                  <Field type="text" name="campo" placeholder="Campo">                    
                      {({field: {value, onChange, onBlur}, form: {errors, touched}}) => 
                        <div>
                          <Input
                              name="campo"
                              value={value}                                                
                              placeholder="Duración previsita"
                              type="text"
                              onChange={onChange}
                              onBlur={onBlur}
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({    
  }, dispatch);
}

function mapStateToProps({ clientInformacion, previsitReducer: { detailPrevisit }, reducerGlobal }) {
  return {    
    clientInformacion,
    detailPrevisit,
    reducerGlobal
  };
}

export default withFormik({
  handleSubmit: () => {

  },
  mapPropsToValues: (props) => {    
    console.log(props);
  }, 
  validationSchema: schema
})(connect(mapStateToProps, mapDispatchToProps)(PrevisitFormComponent));