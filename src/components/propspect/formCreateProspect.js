import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import SelectYesNo from '../selectsComponent/selectYesNo/selectYesNo';
import SelectCIIU from '../selectsComponent/selectCIIU/selectCIIU';

var notasProspect = [];

const fields = ["reportVirtual", "extractsVirtual",
                "marcGeren", "necesitaLME", "idCIIU"];

class FormCreateProspect extends Component{
  constructor( props ) {
    super(props);
    this.state = {
      styleTypeDocument: {},
      styleDocumentNumber: {},
      styleMarcGeren: {},
      stylenecesitaLME: {},
      styleCIIU: {}
    }
  }

  _onChangeValueList(type, val){
    switch (type) {
      case "ciiu":
        var {fields: {idCIIU}} = this.props
        idCIIU.onChange(val);
        break;

      case "reporteVirtual":
        var {fields: {reportVirtual}} = this.props
        reportVirtual.onChange(val);
        break;
      default:
        break;
    }
  };

  _submitFormCreateProspect(formData){
    const {reportVirtual, extractsVirtual, marcGeren, necesitaLME, idCIIU} = formData;

  };


  render(){
    const {
      fields: { reportVirtual, extractsVirtual, marcGeren, necesitaLME, idCIIU
      },
      error, handleSubmit} = this.props;

    console.log("marcGeren", marcGeren);
    console.log("necesitaLME", necesitaLME);

    return(
      <form onSubmit={handleSubmit(this._submitFormCreateProspect)}>
      <Row style={{height: "100%", marginTop: "3px", paddingBottom: "15px"}}>

          <Col xs={12} md={12} lg={12} style={{marginTop: "10px", marginLeft: "20px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <i className="icon-segmen" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Actividad económica</span>
            </dl>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>CIIU(</span><span style={{color: "red"}}>*</span>)</dt>
              <SelectCIIU
                onChange={val => this._onChangeValueList("ciiu", val)}
                store={idCIIU.id}
                styles={this.state.styleCIIU}/>
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Sector(</span><span style={{color: "red"}}>*</span>)</dt>
              <span style={{width: "25%", verticalAlign: "initial", paddingTop: "5px"}}>{idCIIU.value === undefined ? "" : idCIIU.value.economicSector}</span>
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>SubCIIU(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Subsector(</span><span style={{color: "red"}}>*</span>)</dt>
              <span style={{width: "25%", verticalAlign: "initial"}}>Subsector</span>
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "20px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <i className="icon-top-chart-risk" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Información de ubicación y correspondencia</span>
            </dl>
          </Col>
          <Col xs={12} md={12} lg={12} style={{marginLeft: "20px"}}>
            <h3 className="sub-header" style={{borderBottom: "solid 1px"}}>Dirección sede principal</h3>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Dirección(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>País(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Departamento(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt><span>Ciudad(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>¿Desea recibir su reporte de costos consolidado de forma virtual?(</span><span style={{color: "red"}}>*</span>)</dt>
              <SelectYesNo
                onChange={val => this._onChangeValueList("reporteVirtual", val.id)}
                store={reportVirtual.id}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Teléfono(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px", paddingTop: "15px"}}>
              <dt><span>Barrio(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>¿Desea consultar sus extractos de forma virtual?(</span><span style={{color: "red"}}>*</span>)</dt>
              <SelectYesNo
                onChange={val => reportVirtual.onChange(val.id)}
                store={extractsVirtual.id}
              />
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "20px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <i className="icon-address" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Información financiera</span>
            </dl>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Ventas anuales(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Activos(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Pasivos(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt><span>Ingresos operacionales(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Ingresos no operacionales(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Egresos(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Fecha de ventas anuales(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "20px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <i className="icon-address" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Datos de conocimiento comercial</span>
            </dl>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Marca gerenciamiento</span></dt>
              <SelectYesNo
                onChange={val => marcGeren.onChange(val.id)}
                store={marcGeren.id}
                styles={this.state.styleMarcGeren}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>¿Necesita LME?</span></dt>
              <SelectYesNo
                onChange={val => necesitaLME.onChange(val.id)}
                store={necesitaLME.id}
                styles={this.state.stylenecesitaLME}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Grupo económico/Relación</span></dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt><span>Centro de decisión</span></dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          {!marcGeren.value &&
            <Col xs={12} md={3} lg={3}>
              <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
                <dt><span>Justificación no gerenciamiento</span></dt>
                <textarea
                  style={{width: "100%"}}
                  rows="4"
                />
              </div>
            </Col>
          }
          {!necesitaLME.value == true &&
            <Col xs={12} md={3} lg={3}>
              <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
                <dt><span>Justificación no necesita LME</span></dt>
                <textarea
                  style={{width: "100%"}}
                  rows="4"
                />
              </div>
            </Col>
          }
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Justificación excliente</span></dt>
              <textarea
                style={{width: "100%"}}
                rows="4"
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt><span>NIT principal</span></dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={12} lg={12}>
            <div className="" style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0", width:"100%", marginBottom: "0", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
              <button className="btn" style={{float:"right", margin:"8px 0px 0px 8px", position:"fixed"}} type="submit">
                <span style={{color: "#FFFFFF", padding:"10px"}}>Crear prospecto</span>
              </button>
            </div>
          </Col>
      </Row>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps({propspectReducer, notes},ownerProps) {
  return {
    propspectReducer,
  };
}

export default reduxForm({
  form: 'submitValidation',
  fields
}, mapStateToProps, mapDispatchToProps)(FormCreateProspect);
