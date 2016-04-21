import React, {Component, PropTypes} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {Combobox, DateTimePicker, Multiselect} from 'react-widgets';
import SelectOption from '../../selectsComponent/selectFilterContact/selectFilterComponent';
import {CLIENT_ID_TYPE, FILTER_FUNCTION_ID, FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LOB_ID, FILTER_GENDER, FILTER_TITLE, FILTER_DEPENDENCY, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, FILTER_SPORTS} from '../../selectsComponent/constants';

const dataValues = ['orange', 'red', 'blue'];

class ContactDetailsModalComponent extends Component {

  /* Constructor de la clase ContactDetailModalComponent */
  constructor(props) {
    super(props)
  }

  /*  */
  getInitialState() {
    return {
        id: '',
        contactType: '',
        contactIdentityNumber: '',
        firstName: '',
        middleName: '',
        firstLastName: '',
        secondLastName: '',
        socialStyle: '',
        attitudeOverGroup: '',

        dateOfBirth: '',
        country: '',
        province: '',
        city: '',
        address: '',
        neighborhood: '',
        postalCode: '',
        telephoneNumber: '',
        extension: '',
        mobileNumber: '',
        emailAddress: '',

        typeOfContact: '',
        lineOfBusinesses: [],
        functions: [],

        hobbies: [],
        sports: []
    }
  }

  render() {
    return (
      <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
        <Row>
          <Col md={12} lg={12}>
            <dt className="business-title" style={{fontSize: '17px'}}>Información básica contacto</dt>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={4} lg={4}>
            <dt><span>Tipo de documento</span><span> (*)</span></dt>
            <dd>
              {/* Tipo de documento */}
              <SelectOption key={1} idTypeFilter={CLIENT_ID_TYPE} />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Número de documento</span><span> (*)</span></dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dd className="rw-input">
              <button className="btn btn-primary"><span className="icon icon-search"></span></button>
            </dd>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={4} lg={4}>
            <dt><span>Tratamiento</span><span> (*)</span></dt>
            <dd>
              <SelectOption key={2} idTypeFilter={FILTER_TITLE} />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={4} lg={4}>
            <dt><span>Género</span><span> (*)</span></dt>
            <dd>
              <SelectOption key={3} idTypeFilter={FILTER_GENDER} />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Primer nombre</span><span> (*)</span></dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Segundo nombre</span></dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Primer apellido</span><span> (*)</span></dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Segundo apellido</span></dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_middleName" name="form_middleName" maxLength="15" />
            </dd>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Cargo</span></dt>
            <dd>
              <SelectOption key={4} idTypeFilter={FILTER_TITLE} />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Área dependencia</span></dt>
            <dd>
              <SelectOption key={5} idTypeFilter={FILTER_DEPENDENCY} />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt>Fecha de nacimiento</dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_socialStyle" name="form_socialStyle" maxLength="15" />
            </dd>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={4} lg={4}>
            <dt>Estilo social</dt>
            <dd>
              <Combobox />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={4} lg={4}>
            <dt>Actitud frente al Grupo</dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_socialStyle" name="form_socialStyle" maxLength="15" />
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
            <dd>
              <SelectOption key={6} idTypeFilter={FILTER_COUNTRY} />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Departamento</span><span> (*)</span></dt>
            <dd>
              <SelectOption key={7} idTypeFilter={FILTER_PROVINCE} />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Ciudad</span><span> (*)</span></dt>
            <dd>
              <SelectOption key={8} idTypeFilter={FILTER_CITY} />
            </dd>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <dt><span>Dirección</span><span> (*)</span></dt>
            <dd className="rw-widget">
              <textarea className="form-control need-input" id="form_address" name="form_address"></textarea>
            </dd>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Barrio</span></dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_city" name="form_city" maxLength="15" />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Código postal</span></dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_city" name="form_city" maxLength="15" />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Teléfono</span><span> (*)</span></dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_city" name="form_city" maxLength="15" />
            </dd>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Extensión</span></dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_city" name="form_city" maxLength="15" />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Celular</span></dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_city" name="form_city" maxLength="15" />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Correo electrónico</span><span> (*)</span></dt>
            <dd className="rw-widget">
              <input type="text" className="rw-input form-control" id="form_city" name="form_city" maxLength="15" />
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
            <dd>
              <SelectOption key={9} idTypeFilter={FILTER_TYPE_CONTACT_ID} />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Entidad / Línea de negocio</span><span> (*)</span></dt>
            <dd>
              <Multiselect />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <dt><span>Función</span><span> (*)</span></dt>
            <dd>
              <Multiselect />
            </dd>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <dt className="business-title" style={{fontSize: '17px'}}>Hobbies y deportes</dt>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <dt><span>Hobbie</span></dt>
            <dd>
              <Multiselect data={dataValues} />
            </dd>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <dt><span>Deporte</span></dt>
            <dd>
              {/* <Multiselect /> */}
              <SelectOption key={1} idTypeFilter={FILTER_SPORTS} />
            </dd>
          </Col>
        </Row>
      </div>
    );
  }
}

ContactDetailsModalComponent.PropTypes = {
  id: PropTypes.number,
  contactType: PropTypes.number,
  contactIdentityNumber: PropTypes.string,
  firstName: PropTypes.string,
  middleName: PropTypes.string,
  firstLastName: PropTypes.string,
  secondLastName: PropTypes.string,
  socialStyle: PropTypes.number,
  attitudeOverGroup: PropTypes.number,

  dateOfBirth: PropTypes.string,
  country: PropTypes.number,
  province: PropTypes.number,
  city: PropTypes.number,
  address: PropTypes.string,
  neighborhood: PropTypes.string,
  postalCode: PropTypes.string,
  telephoneNumber: PropTypes.string,
  extension: PropTypes.string,
  mobileNumber: PropTypes.string,
  emailAddress: PropTypes.string,

  typeOfContact: PropTypes.number,
  lineOfBusinesses: PropTypes.array,
  functions: PropTypes.array,

  hobbies: PropTypes.array,
  sports: PropTypes.array
};

export default ContactDetailsModalComponent;
