import React from 'react';
import { Col, Row } from "react-flexbox-grid";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { uniqueId } from 'lodash';

import SectionTitle from './sectionTitle';
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import {
    PIPELINE_TYPE,
    COMMERCIAL_OPORTUNITY
} from "../../selectsComponent/constants";
import { changeMainPipeline } from '../actions';

export class Classification extends React.Component {

    constructor(props) {
      super(props);
      this.addFieldNameToChangeFunction = this.addFieldNameToChangeFunction.bind(this);
      this.pipelineTypeChange = this.pipelineTypeChange.bind(this);
      this.commercialOportunityChange = this.commercialOportunityChange.bind(this);
    }

    addFieldNameToChangeFunction(name, value) {
      const { pipelineReducer, changeMainPipeline, isChildren } = this.props;
      debugger;

      if (!isChildren) {
        let newValue = {};
        newValue[name] = value;
        changeMainPipeline(Object.assign(pipelineReducer.get("mainPipeline"), newValue))
      }

    }

    pipelineTypeChange(...props) {
      this.addFieldNameToChangeFunction("pipelineType", ...props);
    }

    commercialOportunityChange(...props) {
      this.addFieldNameToChangeFunction("commercialOportunity", ...props);
    }

    setDefaultValue(reduxField, pipelineReducer, name) {
      if (!reduxField.value) {
        reduxField.onChange(pipelineReducer.get('mainPipeline')[name]);
      }
    }

    componentDidMount() {
      const { isChildren, pipelineReducer, pipelineType, commercialOportunity } = this.props;

      debugger;

      if (isChildren) {
        this.setDefaultValue(pipelineType, pipelineReducer, 'pipelineType');
        this.setDefaultValue(commercialOportunity, pipelineReducer, 'commercialOportunity');
      }

    }

    render() {

        const { pipelineType, selectsReducer, commercialOportunity, disabled,
        pipelineTypeName, commercialOportunityName } = this.props;
        const disabledClass = disabled ? 'disabled' : '';

          console.log({ pipelineTypeName, commercialOportunityName  });

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
                        name={pipelineTypeName}
                        parentId="dashboardComponentScroll"
                        data={selectsReducer.get(PIPELINE_TYPE) || []}
                        disabled={disabledClass}
                        onChange={this.pipelineTypeChange}
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
                        name={commercialOportunityName}
                        parentId="dashboardComponentScroll"
                        data={selectsReducer.get(COMMERCIAL_OPORTUNITY) || []}
                        disabled={disabledClass}
                        onChange={this.commercialOportunityChange}
                      />
                    </Col>
                  </Row>
                </div>
        )
    }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeMainPipeline
  }, dispatch)
};

function mapStateToProps({ pipelineReducer, selectsReducer }) {
  return {
    pipelineReducer,
    selectsReducer
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Classification);