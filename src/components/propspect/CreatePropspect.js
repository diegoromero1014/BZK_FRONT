import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {validateProspectExists, clearState} from './actions';
import {redirectUrl} from '../globalComponents/actions';
import {toggleMessage} from '../messages/actions';
import SelectTypeDocument from '../selectsComponent/SelectTypeDocument/ComponentTypeDocument';

const fields = ["idType", "idNumber"];

class CreatePropspect extends Component{
  constructor( props ) {
    super(props);

    this._clickButtonCreateProps = this._clickButtonCreateProps.bind(this);
  }

  componentWillMount(){
    if( window.localStorage.getItem('sessionToken') === "" ){
      redirectUrl("/login");
    }
  }

  _clickButtonCreateProps(formData){
    const {idType} = formData;
    const {idNumber} = formData;
    const {validateProspectExists} = this.props;
    validateProspectExists(idType, idNumber);
  }

  render(){
    const { fields: { idType, idNumber }, error, handleSubmit, clearState} = this.props
    const {propspectReducer} = this.props;
    const status = propspectReducer.get('status');
    const validateLogin = propspectReducer.get('validateLogin');
    const prospectExist =  propspectReducer.get('prospectExist');
    if( !validateLogin ){
      //redirectUrl("/login");
    }
    if( status === "Error" ){
      //toggleMessage("Señor usuario, ocurrió en error tratando de validar si el prospecto existe, por favor intentelo .");
      clearState();
      alert("Señor usuario, ocurrió en error tratando de validar si el prospecto existe, por favor intentelo.");
    }
     if(status === "Exists" ){
       clearState();
       //toggleMessage("Señor usuario, ocurrió en error tratando de validar si el prospecto existe, por favor intentelo .");
       alert("Señor usuario, el prospecto que desea registrar, ya se encuentra creado en la aplicación.");
    }

    return(
      <div>
        <form onSubmit={handleSubmit(this._clickButtonCreateProps)}>
          <Row style={{padding: "10px 10px 20px 20px", boxShadow: "-2px 2px 4px 0 rgba(0, 0, 0, 0.2)"  }}>
            <Col xs={12} md={4} lg={5}>
              <dt><span>Tipo de documento (</span><span style={{color: "red"}}>*</span>)</dt>
              <SelectTypeDocument
                onChange={val => idType.onChange(val.id)}
                store={idType.id}
              />
            </Col>
            <Col xs={10} md={4} lg={5}>
              <dt><span>Número de documento (</span><span style={{color: "red"}}>*</span>)</dt>
                <input
                  type="text"
                  className="form-control"
                  style={{height: "22px !important", minHeight: "26px !important"}}
                  required
                  placeholder="Ingrese el número de documento del usuario"
                  {...idNumber}
                />
            </Col>
            <Col xs={2} md={4} lg={2}>
              <button className="btn btn-default" type="submit" title="Buscar prospecto"
                style={{backgroundColor:"#66778d", marginLeft:"30px", marginTop: "25px", paddingTop: "4px !important"}}>
                <i className="icon-search" style={{color: "white"}}></i>
              </button>
            </Col>
          </Row>
        </form>
        {!prospectExist &&
          <div><p>Holaaaa</p></div>
        }
      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    validateProspectExists,
    toggleMessage,
    clearState
  }, dispatch);
}

function mapStateToProps({propspectReducer},ownerProps) {
  return {
    propspectReducer
  };
}

export default reduxForm({
  form: 'submitValidation',
  fields
}, mapStateToProps, mapDispatchToProps)(CreatePropspect);
