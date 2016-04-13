import React, {Component} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';

class ContactDetailsModalComponent extends Component {
    render() {
        return (
          <div className="modalBt4-body modal-body business-content contact-detail-body editable-form-content clearfix">
                  <dt className="col-md-12 business-title" style={{fontSize: '17px'}}>Información básica contacto</dt>
                  <div className="col-md-12" >
                  <dl className="col-md-4">
                        <dt><span>Tratamiento</span><span> (*)</span></dt>
                          <dd className="input-with-icon  right success-control">
                          <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxlength="15"/>
                          </dd>
                        </dl>
                        <dl className="col-md-4">
                          <dt><span>Genero</span><span> (*)</span></dt>
                          <dd className="input-with-icon  right success-control">
                          <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxlength="15"/>
                          </dd>
                        </dl>
                        <dl className="col-md-4">
                          <dt><span>Tipo de documento</span><span> (*)</span></dt>
                          <dd className="input-with-icon  right success-control">
                          <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxlength="15"/>
                          </dd>
                        </dl>
                        <dl className="col-md-4">
                          <dt><span>Número de documento</span><span> (*)</span></dt>
                          <dd className="input-with-icon  right success-control">
                          <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxlength="15"/>
                          </dd>
                        </dl>
                        <dl className="col-md-4">
                          <dt><span>Primer nombre</span><span> (*)</span></dt>
                          <dd className="input-with-icon  right success-control">
                          <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxlength="15"/>
                          </dd>
                        </dl>
                        <dl className="col-md-4">
                          <dt><span>Segundo nombre</span><span> (*)</span></dt>
                          <dd className="input-with-icon  right success-control">
                          <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxlength="15"/>
                          </dd>
                        </dl>
                        <dl className="col-md-4">
                          <dt><span>Primer apellido</span><span> (*)</span></dt>
                          <dd className="input-with-icon  right success-control">
                          <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxlength="15"/>
                          </dd>
                        </dl>
                        <dl className="col-md-4">
                          <dt><span>Segundo apellido</span></dt>
                          <dd className="input-with-icon  right success-control">
                          <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxlength="15"/>
                          </dd>
                        </dl>
                        <dl className="col-md-4">
                          <dt><span>Cargo</span></dt>
                          <dd className="input-with-icon  right success-control">
                          <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxlength="15"/>
                          </dd>
                        </dl>
                        <dl className="col-md-4">
                          <dt><span>Área dependencia</span></dt>
                          <dd className="input-with-icon  right success-control">
                          <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxlength="15"/>
                          </dd>
                        </dl>
                        <dl className="col-md-4">
                          <dt>Fecha de nacimiento</dt>
                          <dd className="input-with-icon  right success-control">
                          <input type="text" className="form-control" id="form_middleName" name="form_middleName" maxlength="15"/>
                          </dd>
                        </dl>
                  </div>
                </div>
        );
    }
}

export default ContactDetailsModalComponent;
