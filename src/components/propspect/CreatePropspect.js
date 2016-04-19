import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {validateProspectExists} from './actions';
import {redirectUrl} from '../globalComponents/actions';
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

  _handleChangeName(){
    this.setState({
      namePropspect: e.target.value
    })
  }

  _clickButtonCreateProps(formData){
    console.log(JSON.stringify(formData, null, 2));
    const {id} = formData.idType;
    const {idNumber} = formData;
    validateProspectExists(id, idNumber);
  }

  render(){
    const { fields: { idType, idNumber }, error, handleSubmit} = this.props
    const {propspectReducer} = this.props;
    const {status, validateLogin, prospectExist} = propspectReducer;
    if( !validateLogin ){
      //redirectUrl("/login");
    }
    if( prospectExist ){
      alert("El prospecto ya se encuentra registrado en el sistema, por tal motivo no lo puede crear.");
    }

    return(
      <form onSubmit={handleSubmit(this._clickButtonCreateProps)}>
        <Row style={{padding: "10px 10px 20px 20px", boxShadow: "-2px 2px 4px 0 rgba(0, 0, 0, 0.2)"  }}>
          <Col xs={12} md={4} lg={5}>
            <dt><span>Tipo de documento (</span><span style={{color: "red"}}>*</span>)</dt>
            <SelectTypeDocument
              onChange={value => idType.onChange(value)}
              store={idType.value}
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
            <button className="btn btn-default" type="submit" title="Crear prospecto"
              style={{backgroundColor:"#66778d", marginLeft:"30px", marginTop: "25px", paddingTop: "4px !important"}}>
              <i className="icon-search" style={{color: "white"}}></i>
            </button>
          </Col>
        </Row>
      </form>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    validateProspectExists
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
