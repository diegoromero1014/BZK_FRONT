import React from 'react';
import { Col, Row } from "react-flexbox-grid";

import SectionTitle from './sectionTitle';
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import {
    PIPELINE_TYPE,
    COMMERCIAL_OPORTUNITY
} from "../../selectsComponent/constants";

export default class Classification extends React.Component {

    render() {

        const { pipelineType, selectsReducer, commercialOportunity, disabled } = this.props;
        const disabledClass = disabled ? 'disabled' : ''; 
        return (
            <div>
                  <Row className="pipeline__section" >
                    <Col xs={12} md={12} lg={12}>
                      <SectionTitle text="Clasificación" />
                    </Col>
                  </Row>

                  <Row className="pipeline__section__fields">

                    <Col md={6} >
                      <dt>
                        <span>Tipo de pipeline (<span style={{ color: "red" }}>*</span>)</span>
                      </dt>
                      <ComboBox
                        labelInput="Seleccione..."
                        valueProp={'id'}
                        textProp={'value'}
                        {...pipelineType}
                        name={"pipelineType"}
                        parentId="dashboardComponentScroll"
                        data={selectsReducer.get(PIPELINE_TYPE) || []}
                        disabled={disabledClass}
                      />
                    </Col>
                    <Col md={6} >
                      <dt>
                        <span>Oportunidades comerciales (<span style={{ color: "red" }}>*</span>)</span>
                      </dt>
                      <ComboBox
                        labelInput="Seleccione..."
                        valueProp={'id'}
                        textProp={'value'}
                        {...commercialOportunity}
                        name={"commercialOportunity"}
                        parentId="dashboardComponentScroll"
                        data={selectsReducer.get(COMMERCIAL_OPORTUNITY) || []}
                        disabled={disabledClass}
                      />
                    </Col>
                  </Row>
                </div>
        )
    }

}