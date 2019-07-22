import React from "react";
import { Row, Col } from "react-flexbox-grid";
import { Checkbox } from "semantic-ui-react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { swtShowMessage } from "../../sweetAlertMessages/actions";

import Tooltip from "../../toolTip/toolTipComponent";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import Textarea from "../../../ui/textarea/textareaComponent";

import {
  FILTER_COUNTRY,
  FILTER_PROVINCE,
  FILTER_CITY
} from "../../selectsComponent/constants";

export class Ubicacion extends React.Component {

  originalCountry = "";
  originalProvince = "";
  originalCity = "";
  originalNeighborhood = "";
  originalAddress = "";
  firstTime = true;

  constructor(props) {
    super(props);
    this.onChangeCountry = this.onChangeCountry.bind(this);
    this.onChangeProvince = this.onChangeProvince.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.onChangeCity = this.onChangeCity.bind(this);
    this.changeCheckBox = this.changeCheckBox.bind(this);
    this.changeCityWhenClearUbication = this.changeCityWhenClearUbication.bind(this);

    this.state = {
      checked: false
    }

  }

  onChangeCountry(val) {
    const {
      fields: { contactCountry, contactProvince, contactCity },
      consultListWithParameterUbication
    } = this.props;

    if (val !== undefined && val !== null) {
      contactCountry.onChange(val);
      consultListWithParameterUbication(FILTER_PROVINCE, val);
      contactProvince.onChange("");
      contactCity.onChange("");
    }
    
  }

  onChangeProvince(val) {
    const {
      fields: { contactProvince, contactCity },
      consultListWithParameterUbication
    } = this.props;

    if (val !== undefined && val !== null) {
      contactProvince.onChange(val);
      consultListWithParameterUbication(FILTER_CITY, val);
      contactCity.onChange("");
    }
    
  }

  onChangeCity(val) {
    const {
      fields: { contactCity }
    } = this.props;

    if (val) {
      contactCity.onChange(val);
    }
  }

  handleChecked(e, data) {
    const {
      fields: {
        contactCountry,
        contactProvince,
        contactCity,
        contactAddress,
        contactNeighborhood
      },
      clientInfo,
      consultListWithParameterUbication
    } = this.props;

    var newCity = "";

    const address = clientInfo.addresses[0];
      if (data.checked) {

        if (this.firstTime) {
          this.originalCountry = contactCountry.value;
          this.originalProvince = contactProvince.value;
          this.originalAddress = contactAddress.value;
          this.originalNeighborhood = contactNeighborhood.value;
          this.originalCity = contactCity.value;
          this.firstTime = false;
        }

        contactCountry.onChange(address.country);
        contactProvince.onChange(address.province);
        contactAddress.onChange(address.address);
        contactNeighborhood.onChange(address.neighborhood);
        newCity = address.city;

        this.changeCityWhenClearUbication(contactCity, newCity);
    
    } else {
        contactCountry.onChange(this.originalCountry);
        consultListWithParameterUbication(FILTER_PROVINCE, this.originalCountry).then(() => {
          contactProvince.onChange(this.originalProvince);
          consultListWithParameterUbication(FILTER_CITY, this.originalProvince).then(() => {
            contactProvince.onChange(this.originalProvince);
            this.changeCityWhenClearUbication(contactCity, this.originalCity);
          })
      });

      contactAddress.onChange(this.originalAddress);
      contactNeighborhood.onChange(this.originalNeighborhood);
      newCity = this.originalCity;
    }

    

  }

  changeCityWhenClearUbication(city, newValue) {
      setTimeout(() => {
        city.onChange(newValue);
        this.forceUpdate();
      }, 1000);
  }

  changeCheckBox() {

    const { clientInfo, swtShowMessage } = this.props;

    const address = clientInfo.addresses[0];

    if (!this.state.checked) {
      if ((!_.isNull(address.country) || _.isUndefined(address.country) || !_.isEmpty(address.country) || 
      (!_.isNull(address.province) || _.isUndefined(address.province) || !_.isEmpty(address.province)) || 
      (!_.isNull(address.address) || _.isUndefined(address.address) || !_.isEmpty(address.address)) ||
      (!_.isNull(address.neighborhood) || _.isUndefined(address.neighborhood) || !_.isEmpty(address.neighborhood)) ||
      (!_.isNull(address.city) || _.isUndefined(address.city) || !_.isEmpty(address.city))))
      {
        this.setState({checked: true});
      } else {
        
        swtShowMessage('error', 'Ubicación vacía', 'Señor usuario, este cliente no cuenta con información de ubicación');
        
      }

    } else {
      this.setState({checked: false});
    }

  }

  _renderCheckbox(){
    const {origin, isEditable} = this.props;
    if(origin === 'clientInformation' || origin === 'createContact'){
      return (<Col xs={12} sm={12} md={3} lg={3}>
      <Tooltip text="Al activar el campo, se copiará la información de ubicación de la sede principal del cliente seleccionado (dirección, país, ciudad, departamento y barrio)">
        <Checkbox
          onChange={(e, data) => this.handleChecked(e, data)}
          onClick={this.changeCheckBox}
          checked={this.state.checked}
          label={"Copiar ubicación"}
          disabled={!isEditable}
          toggle
        />
      </Tooltip>
    </Col>)
    }
  }

  render() {
    const {
      fields: {
        contactCountry,
        contactProvince,
        contactCity,
        contactAddress        
      },
      selectsReducer,
      isEditable
    } = this.props;

    return (
      <div>
        <div
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
            marginTop: "10px"
          }}
        >
        {this._renderCheckbox()}
          
          <Row>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt>
                <span>País (</span>
                <span style={{ color: "red" }}>*</span>
                <span>)</span>
              </dt>
              <dd>
                <ComboBox
                  name="contactCountry"
                  labelInput="Seleccione"
                  {...contactCountry}
                  onBlur={val => this.onChangeCountry(val)}
                  value={contactCountry.value}
                  valueProp={"id"}
                  textProp={"value"}
                  data={selectsReducer.get(FILTER_COUNTRY)}
                  disabled={isEditable ? "" : "disabled"}
                />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt>
                <span>{"Departamento ("}</span>
                <span style={{ color: "red" }}>{"*"}</span>
                <span>{")"}</span>
              </dt>
              <dd>
                <ComboBox
                  name="contactProvince"
                  labelInput="Seleccione"
                  {...contactProvince}
                  onBlur={val => this.onChangeProvince(val)}
                  value={contactProvince.value}
                  valueProp={"id"}
                  textProp={"value"}
                  data={selectsReducer.get("dataTypeProvince")}
                  disabled={isEditable ? "" : "disabled"}
                />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt>
                <span>{"Ciudad ("}</span>
                <span style={{ color: "red" }}>{"*"}</span>
                <span>{")"}</span>
              </dt>
              <dd>
                <ComboBox
                  name="contactCity"
                  labelInput="Seleccione"
                  {...contactCity}
                  onChange={val => this.onChangeCity(val)}
                  valueProp={"id"}
                  textProp={"value"}
                  data={selectsReducer.get("dataTypeCity")}
                  disabled={isEditable ? "" : "disabled"}
                />
              </dd>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <dt>
                <span>{"Dirección ("}</span>
                <span style={{ color: "red" }}>{"*"}</span>
                <span>{")"}</span>
              </dt>
              <dd>
                <Textarea
                  className="form-control need-input"
                  {...contactAddress}
                  validateEnter={true}
                  name="contactAddress"
                  maxLength="60"
                  disabled={isEditable ? "" : "disabled"}
                  style={{ width: "100%", height: "100%" }}
                />
              </dd>
            </Col>
            
          </Row>
        </div>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      swtShowMessage,
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(Ubicacion);