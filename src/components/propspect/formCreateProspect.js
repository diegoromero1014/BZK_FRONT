import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import SelectYesNo from '../selectsComponent/selectYesNo/selectYesNo'
import {updateNote, addNote} from '../notes/actions';

var notasProspect = [];

const fields = ["idEntityLineBusiness", "segmento", "reportVirtual", "extractsVirtual"];

class FormCreateProspect extends Component{
  constructor( props ) {
    super(props);
    this._handleAddNote = this._handleAddNote.bind(this);
  }

  _handleAddNote(){
    const {addNote} = this.props;
    addNote();
  }

  _submitFormCreateProspect(){

  };


  render(){
    const { fields: { idEntityLineBusiness, idSegmento, reportVirtual, extractsVirtual },
      error, handleSubmit} = this.props;
    return(
      <form onSubmit={handleSubmit(this._submitFormCreateProspect)}>
      <Row style={{height: "100%", marginTop: "3px", paddingBottom: "15px"}}>
        <Col xs={12} md={3} lg={3} style={{marginTop: "15px"}}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Entidad/Línea de negocio(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} style={{marginTop: "15px"}}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Segmento(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} style={{marginTop: "15px"}}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Subsegmento(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} style={{marginTop: "15px"}}>
            <div style={{paddingLeft: "10px", paddingRight: "35px"}}>
              <dt><span>Grupo de riesgo(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "10px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <i className="icon-segmen" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Actividad económica</span>
            </dl>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>CIIU(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Sector(</span><span style={{color: "red"}}>*</span>)</dt>
              <span style={{width: "25%", verticalAlign: "initial", paddingTop: "5px"}}>Sector</span>
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>SubCIIU(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "35px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Subsector(</span><span style={{color: "red"}}>*</span>)</dt>
              <span style={{width: "25%", verticalAlign: "initial"}}>Subsector</span>
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "10px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <i className="icon-top-chart-risk" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Información de ubicación y correspondencia</span>
            </dl>
          </Col>
          <Col xs={12} md={12} lg={12} style={{marginLeft: "10px"}}>
            <h3 className="sub-header" style={{borderBottom: "solid 1px"}}>Dirección sede principal</h3>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Dirección(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>País(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Departamento(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "35px"}}>
              <dt><span>Ciudad(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div style={{paddingLeft: "10px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>¿Desea recibir su reporte de costos consolidado de forma virtual?(</span><span style={{color: "red"}}>*</span>)</dt>
              <SelectYesNo
                onChange={val => reportVirtual.onChange(val.id)}
                store={reportVirtual.id}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Teléfono(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "35px", paddingTop: "15px"}}>
              <dt><span>Barrio(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div style={{paddingLeft: "10px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>¿Desea consultar sus extractos de forma virtual?(</span><span style={{color: "red"}}>*</span>)</dt>
              <SelectYesNo
                onChange={val => reportVirtual.onChange(val.id)}
                store={extractsVirtual.id}
              />
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "10px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <i className="icon-address" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Información financiera</span>
            </dl>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Ventas anuales(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Activos(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Pasivos(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "35px"}}>
              <dt><span>Ingresos operacionales(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Ingresos no operacionales(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Egresos(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Fecha de ventas anuales(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "10px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <i className="icon-address" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Datos de conocimiento comercial</span>
            </dl>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Marca gerenciamiento</span></dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>¿Necesita LME?</span></dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Grupo económico/Relación</span></dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "35px"}}>
              <dt><span>Centro de decisión</span></dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Justificación no gerenciamiento</span></dt>
              <textarea
                style={{width: "100%"}}
                rows="4"
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Justificación no necesita LME</span></dt>
              <textarea
                style={{width: "100%"}}
                rows="4"
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Justificación excliente</span></dt>
              <textarea
                style={{width: "100%"}}
                rows="4"
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "10px", paddingRight: "35px"}}>
              <dt><span>NIT principal</span></dt>
              <input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
              />
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "10px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <i className="icon-address" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Notas</span>
            </dl>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "10px"}}>
              <button className="btn btn-primary modal-button-edit add-item"
                onClick={this._handleAddNote} type="button" title="Adicionar nota" >
                Agregar nota
              </button>
          </Col>
      </Row>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateNote,
    addNote
  }, dispatch);
}

function mapStateToProps({propspectReducer, notes},ownerProps) {
  return {
    propspectReducer,
    notes
  };
}

export default reduxForm({
  form: 'submitValidation',
  fields
}, mapStateToProps, mapDispatchToProps)(FormCreateProspect);
