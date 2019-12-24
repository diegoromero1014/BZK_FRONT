import React from 'react'
import { bindActionCreators } from "redux";
import {connect} from 'react-redux'
import {Col, Row} from "react-flexbox-grid";
import Textarea from "../../../ui/textarea/textareaComponent";
import Input from "../../../ui/input/inputComponent";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import {consultListWithParameterUbication} from '../../selectsComponent/actions'
import * as selectConstants from "../../selectsComponent/constants";

class Ubicacion extends React.Component {

    constructor(props) {
        super(props);

        this._onChangeCountry = this._onChangeCountry.bind(this);
        this._onChangeProvince = this._onChangeProvince.bind(this);
        this._onChangeCity = this._onChangeCity.bind(this);
    }

    _onChangeCountry(val) {
        const { clientInformacion } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        const { country, province, city } = this.props;
        country.onChange(val);
        const { consultListWithParameterUbication } = this.props;
        consultListWithParameterUbication(selectConstants.FILTER_PROVINCE, country.value);
        if (!_.isEqual(infoClient.addresses[0].country, country.value)) {
            province.onChange('');
            city.onChange('');
        }
    }

    _onChangeProvince(val) {
        const { clientInformacion } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        const { province, city } = this.props;
        province.onChange(val);
        const { consultListWithParameterUbication } = this.props;
        consultListWithParameterUbication(selectConstants.FILTER_CITY, province.value);
        if (!_.isEqual(infoClient.addresses[0].province, province.value)) {
            city.onChange('');
        }
    }

    _onChangeCity(val) {
        const { city } = this.props;
        city.onChange(val);
    }

    

    render() {

        const { isExclient, addressClient, country, province, city, telephone, selectsReducer } = this.props;

        return (
            <div>
            <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="browser icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Información de ubicación y correspondencia</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 5px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <table style={{ width: "100%" }}>
                            <tbody>
                            <tr>
                                <td>
                                    <dl style={{
                                        fontSize: "20px",
                                        color: "#505050",
                                        marginTop: "5px",
                                        marginBottom: "5px"
                                    }}>
                                        <span className="section-title">Dirección sede principal</span>
                                    </dl>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="tab-content-row"
                                            style={{ borderTop: "1px solid #505050", width: "99%" }}></div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Dirección</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <Textarea
                                name="addressClient"
                                validateEnter={true}
                                type="text"
                                style={{ width: '100%', height: '100%' }}
                                max="250"
                                placeholder="Ingrese la dirección"
                                {...addressClient}
                                touched={true}
                                
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 20px 10px 0px" }}>
                    <Col xs={12} md={4} lg={4}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt><span>País</span>{!isExclient && <span style={{ color: "red" }}>*</span> }</dt>
                            <ComboBox
                                name="country"
                                labelInput="Seleccione país..."
                                {...country}
                                onChange={val => this._onChangeCountry(val)}
                                value={country.value}
                                onBlur={country.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get(selectConstants.FILTER_COUNTRY) || []}
                                touched={true}
                                showEmptyObject={true}
                                
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt><span>Departamento/Provincia</span>{!isExclient && <span style={{ color: "red" }}>*</span> }</dt>
                            <ComboBox
                                name="province"
                                labelInput="Seleccione departamento/provincia..."
                                {...province}
                                onChange={val => this._onChangeProvince(val)}
                                value={province.value}
                                onBlur={province.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get('dataTypeProvince') || []}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <div style={{ paddingLeft: "20px", paddingRight: "15px" }}>
                            <dt><span>Ciudad</span>{!isExclient && <span style={{ color: "red" }}>*</span> }</dt>
                            <ComboBox
                                name="city"
                                labelInput="Seleccione ciudad..."
                                {...city}
                                value={city.value}
                                onBlur={city.onBlur}
                                onChange={val => this._onChangeCity(val)}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get('dataTypeCity') || []}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 20px 10px 20px" }}>
                    
                    <Col xs style={{ marginLeft: "0" }}>
                        <dt>
                            <span>Teléfono</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt style={{ marginRight: "15px" }}>
                            <Input
                                name="txtTelefono"
                                type="text"
                                max="30"
                                placeholder="Ingrese el teléfono"
                                {...telephone}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
            </div>
        )
    }

}

function mapStateToProps({selectsReducer, clientInformacion}) {
    return {
        selectsReducer,
        clientInformacion
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultListWithParameterUbication
    }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(Ubicacion)
