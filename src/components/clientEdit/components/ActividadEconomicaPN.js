import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import _ from "lodash";

import {OPTION_REQUIRED} from "../../../constantsGlobal"

import {Col, Row} from "react-flexbox-grid";
import Input from "../../../ui/input/inputComponent";
import Textarea from "../../../ui/textarea/textareaComponent";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";

import { consultListWithParameter } from '../../selectsComponent/actions';
import * as constants from "../../selectsComponent/constants";

import { BUTTON_EDIT, BUTTON_UPDATE, UPDATE } from "../../clientDetailsInfo/constants";


const requiredField = <span>(<span style={{ color: "red" }}>*</span>)</span>;



const drawRequiredField = (condition) => {
    if (condition) {
        return requiredField;
    }
}

let ciiuRequired = false;
let subciiuRequired = false;

class ActividadEconomicaPN extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ciiuRequired: false,
            subciiuRequired: false
        }

        this._onChangeCIIU = this._onChangeCIIU.bind(this);
        this._onChangeOccupation = this._onChangeOccupation.bind(this);
    }

    //Detecta el cambio en el select de ciiu para ejecutar la consulta de subciiu
    _onChangeCIIU(val) {
        const { idCIIU, idSubCIIU } = this.props;
        idCIIU.onChange(val);
        const { clientInformacion } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        const { consultListWithParameter } = this.props;
        consultListWithParameter(constants.SUB_CIIU, idCIIU.value);
        if (!_.isEqual(infoClient.ciiu, idCIIU.value)) {
            idSubCIIU.onChange('');
        }
    }

    _onChangeOccupation(id, text) {
        const { occupation, selectsReducer, isMethodEditClient } = this.props;

        if (id) {

            const occupationList = ['Profesional Independiente','Independiente','Comerciante','Ganadero','Socio o Empleado-Socio'];
            
            ciiuRequired = occupationList.indexOf(text) != -1; 
            subciiuRequired = occupationList.indexOf(text) != -1;

            occupation.onChange(id);

            this.setState({ciiuRequired: ciiuRequired && !isMethodEditClient, subciiuRequired: subciiuRequired && !isMethodEditClient});
        } else {

            ciiuRequired = false;
            subciiuRequired = false;

            occupation.onChange(id);

            this.setState({ciiuRequired, subciiuRequired})
        } 

    }

    componentWillMount() {
        ciiuRequired = false;
        subciiuRequired = false;
    }

    render() {

        const {idCIIU, idSubCIIU, occupation, selectsReducer, isMethodEditClient} = this.props;

        return (
            <div>
            <Row style={{ padding: "0px 10px 20px 20px" }}>
            <Col xs={12} md={12} lg={12}>
                <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                    <div className="tab-content-row"
                        style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                    <i className="payment icon" style={{ fontSize: "25px" }} />
                    <span className="title-middle"> Actividad económica</span>
                </div>
            </Col>
            </Row>
            <Row style={{ padding: "0px 10px 10px 0px" }}>
                <Col xs>
                    <div style={{ paddingLeft: "20px", marginTop: "10px" }}>
                        <dt><span>Ocupación {drawRequiredField(!isMethodEditClient)}</span></dt>
                        <ComboBox
                            name="occupation"
                            labelInput="Seleccione Ocupación..."
                            {...occupation}
                            valueProp={'id'}
                            textProp={'value'}
                            parentId="dashboardComponentScroll"
                            data={selectsReducer.get(constants.OCCUPATION)}
                            touched={true}
                            showEmptyObject={true}
                            onChange={(id, text) => null}
                            onBlur={(id, text) => {this._onChangeOccupation(id, text)}}
                        />
                    </div>
                </Col>
                <Col xs>
                    <div style={{ paddingLeft: "20px", marginTop: "10px" }}>
                        <dt><span>CIIU {drawRequiredField(this.state.ciiuRequired)}</span></dt>
                        <ComboBox
                            name="idCIIU"
                            labelInput="Seleccione CIIU..."
                            {...idCIIU}
                            onChange={val => this._onChangeCIIU(val)}
                            onBlur={idCIIU.onBlur}
                            valueProp={'id'}
                            textProp={'ciiu'}
                            parentId="dashboardComponentScroll"
                            data={selectsReducer.get('dataCIIU')}
                            touched={true}
                            showEmptyObject={true}
                        />
                    </div>
                </Col>
                <Col xs>
                    <div style={{ paddingLeft: "20px", paddingRight: "10px", marginTop: "10px" }}>
                        <dt style={{ paddingBottom: "10px" }}><span>Sector</span></dt>
                        <span style={{ width: "25%", verticalAlign: "initial", paddingTop: "5px" }}>
                            {(idCIIU.value !== "" && idCIIU.value !== null && idCIIU.value !== undefined && !_.isEmpty(selectsReducer.get('dataCIIU'))) ? _.get(_.filter(selectsReducer.get('dataCIIU'), ['id', parseInt(idCIIU.value)]), '[0].economicSector') : ''}
                        </span>
                    </div>
                </Col>
                <Col xs>
                    <div style={{ paddingLeft: "20px", paddingRight: "10px", marginTop: "10px" }}>
                        <dt><span>SubCIIU {drawRequiredField(this.state.subciiuRequired)}</span></dt>
                        <ComboBox
                            name="idSubCIIU"
                            labelInput="Seleccione subCIIU..."
                            {...idSubCIIU}
                            onBlur={idSubCIIU.onBlur}
                            valueProp={'id'}
                            textProp={'subCiiu'}
                            parentId="dashboardComponentScroll"
                            data={selectsReducer.get('dataSubCIIU')}
                            touched={true}
                            showEmptyObject={true}
                        />
                    </div>
                </Col>
                <Col xs>
                    <div style={{ paddingLeft: "20px", paddingRight: "35px", marginTop: "10px" }}>
                        <dt style={{ paddingBottom: "10px" }}><span>Subsector</span></dt>
                        <span style={{ width: "25%", verticalAlign: "initial" }}>
                            {(idSubCIIU.value !== "" && idSubCIIU.value !== null && idSubCIIU.value !== undefined && !_.isEmpty(selectsReducer.get('dataSubCIIU'))) ? _.get(_.filter(selectsReducer.get('dataSubCIIU'), ['id', parseInt(idSubCIIU.value)]), '[0].economicSubSector') : ''}
                        </span>
                    </div>
                </Col>
                </Row>
            
                </div>
        )

    }
}

var validations = [
    {
        validation: 'option-required',
        fields: ['occupation']
    }
]


export function validationRules(props) {

    if (props.idButton === BUTTON_EDIT) {
        return [];
    } else {
        let validationsUpdate = [
            {
                validation: 'option-required',
                fields: ['occupation']
            }
        ]

        if (ciiuRequired) {
            validationsUpdate[0].fields.push('idCIIU');
            validationsUpdate[0].fields.push('idSubCIIU');
        }

        return validationsUpdate;
    }
    
};

function mapStateToProps({selectsReducer, clientInformacion}) {
    return {
        selectsReducer,
        clientInformacion
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators ({
        consultListWithParameter
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ActividadEconomicaPN)