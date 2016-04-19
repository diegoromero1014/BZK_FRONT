import React, {Component} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';

class ContactDetailsModalComponent extends Component {
  render() {
    return (
      <div className="modalBt4-body modal-body business-content contact-detail-body editable-form-content clearfix">
        <Row>
          <Col md={12} lg={12}>
            <dt className="business-title" style={{fontSize: '17px'}}>Información básica contacto</dt>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={4} lg={4}>
            <dt><span>Tipo de documento</span><span> (*)</span></dt>
            <dd className="input-with-icon right success-control">
              <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Número de documento</span><span> (*)</span></dt>
            <dd className="input-with-icon right success-control">
              <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={4} lg={4}>
            <dt><span>Tratamiento</span><span> (*)</span></dt>
            <dd className="input-with-icon right success-control">
              <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={4} lg={4}>
            <dt><span>Genero</span><span> (*)</span></dt>
            <dd className="input-with-icon right success-control">
              <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Primer nombre</span><span> (*)</span></dt>
            <dd className="input-with-icon right success-control">
              <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Segundo nombre</span><span> (*)</span></dt>
            <dd className="input-with-icon right success-control">
              <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Primer apellido</span><span> (*)</span></dt>
            <dd className="input-with-icon right success-control">
              <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Segundo apellido</span></dt>
            <dd className="input-with-icon right success-control">
              <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Cargo</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxLength="15" />
              </dd>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Área dependencia</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxLength="15" />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt>Fecha de nacimiento</dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxLength="15" />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={4} lg={4}>
              <dt>Estilo social</dt>
              <dd className="input-with-icon fight success-control">
                <input type="text" className="form-control" id="form_socialStyle" name="form_socialStyle" maxLength="15" />
              </dd>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={4} lg={4}>
              <dt>Actitud frente al grupo</dt>
              <dd className="input-with-icon fight success-control">
                <input type="text" className="form-control" id="form_socialStyle" name="form_socialStyle" maxLength="15" />
              </dd>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <dt className="business-title" style={{fontSize: '17px'}}>Información de ubicación y correspondencia</dt>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>País</span><span> (*)</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_country" name="form_country" maxLength="15" />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Departamento</span><span> (*)</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_province" name="form_province" maxLength="15" />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Ciudad</span><span> (*)</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_city" name="form_city" maxLength="15" />
              </dd>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <dt><span>Dirección</span><span> (*)</span></dt>
              <dd className="input-with-icon right success-control">
                <textarea className="form-control need-input" id="form_address" name="form_address"></textarea>
              </dd>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Barrio</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_city" name="form_city" maxLength="15" />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Codigo postal</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_city" name="form_city" maxLength="15" />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Telefono</span><span> (*)</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_city" name="form_city" maxLength="15" />
              </dd>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Extensión</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_city" name="form_city" maxLength="15" />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Celular</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_city" name="form_city" maxLength="15" />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Correo electrónico</span><span> (*)</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_city" name="form_city" maxLength="15" />
              </dd>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <dt className="business-title" style={{fontSize: '17px'}}>Clasificación del contacto</dt>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Tipo de contacto</span><span> (*)</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_city" name="form_city" maxLength="15" />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Entidad / Línea de negocio</span><span> (*)</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_city" name="form_city" maxLength="15" />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Función</span><span> (*)</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_city" name="form_city" maxLength="15" />
              </dd>
            </Col>
          </Row>
          <Row>
            <Row>
              <Col lg={12}>
                <dt className="business-title" style={{fontSize: '17px'}}>Hobbies y deportes</dt>
              </Col>
            </Row>
            <Row>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Hobbie</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_city" name="form_city" maxLength="15" />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>Deporte</span></dt>
              <dd className="input-with-icon right success-control">
                <input type="text" className="form-control" id="form_city" name="form_city" maxLength="15" />
              </dd>
            </Col>
          </Row>
        </Row>
      </div>
    );
  }
}

export default ContactDetailsModalComponent;
