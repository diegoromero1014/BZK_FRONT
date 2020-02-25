import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from "react-flexbox-grid";
import { Icon } from 'semantic-ui-react';
import Tooltip from '../toolTip/toolTipComponent';
import ItemList from "../elements/itemList";
import ElementsComponent from "../elements";
import { schemaoOportunitiesWeaknesses } from "./schema";
import {
  OPPORTUNITIES,
  WEAKNESSES,
  OPPORTUNITIES_PLACEHOLDER,
  WEAKNESSES_PLACEHOLDER,
  TITLE_OPPORTUNITIES,
  TITLE_WEAKNESSES,
  SINGULAR_TITLE_OPPORTUNITIES,
  SINGULAR_TITLE_WEAKNESSES,
  MSG_HELP_OPPORTUNITIES,
  MSG_HELP_WEAKNESSES
} from './constants';

class SelectOpportunitiesWeaknesses extends Component {

  componentWillMount() {

  }


  render() {
    const { visual, opportunities, weaknesses } = this.props;

    return (
      <div>
        {visual &&
          <Row className='title-section' style={{ padding: "0px 10px 10px 20px" }}>
            <Col xs={12} md={12} lg={12}>
              <div className="header-component">
                <div className="line-topComponent" />
                <i className="lightbulb icon" style={{ fontSize: "25px" }} />
                <span className="title-middle">
                  Oportunidades y Debilidades
                </span>
              </div>
            </Col>
          </Row>
        }

        <Row style={{ width: '99%', paddingLeft: 20 }}>
          <Col xs={6} md={6} lg={6}>
            <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
              <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
              <i className="thumbs up outline icon" style={{ fontSize: "20px" }} />
              <span style={{ fontSize: "20px" }}>{TITLE_OPPORTUNITIES}</span>
              <Tooltip text={MSG_HELP_OPPORTUNITIES}>
                <i className="help circle icon blue" style={{ fontSize: "16px", cursor: "pointer", marginLeft: "10px" }} />
              </Tooltip>
            </div>
            {!(opportunities && opportunities.length) ?
              <ElementsComponent
                schema={schemaoOportunitiesWeaknesses}
                placeholder={OPPORTUNITIES_PLACEHOLDER}
                messageButton={`Agregar ${SINGULAR_TITLE_OPPORTUNITIES}`}
                name={OPPORTUNITIES}
                max={3}
                title={TITLE_OPPORTUNITIES}
                isEditable={true}
                singularTitle={SINGULAR_TITLE_OPPORTUNITIES}
                showCheck={true}
              />
              :
              <div>
                <Row style={{ padding: "10px 10px 20px 20px", marginBottom: 30, display: 'flex', flexDirection: 'row' }} end="xs">
                  <Col xs={1} md={1} lg={1} style={{ justifySelf: 'end' }}>
                    <Icon
                      className='icon-message-elements'
                      size='huge'
                      name={'add square'}
                      style={{ color: '#16498b', fontSize: '34pt !important', margin: '0px 20px 10px 20px', cursor: 'pointer' }}
                      onClick={() => {
                        console.log("es este boton")
                      }}
                    />
                  </Col>
                </Row>
                <Row style={{ padding: "10px 10px 20px 30px", marginBottom: 70, width: '99%' }} end="xs">
                  <ItemList
                    data={opportunities}
                    handleDelete={undefined}
                    handleEdit={undefined}
                    handleOnSelect={() => console.log('')}
                    showCheck={true}
                    title={TITLE_OPPORTUNITIES}
                    isEditable={true}
                  />
                </Row>
              </div>
            }
          </Col>

          <Col xs={6}>
            <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
              <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
              <i className="thumbs up outline icon" style={{ fontSize: "20px" }} />
              <span style={{ fontSize: "20px" }}>{TITLE_WEAKNESSES}</span>
              <Tooltip text={MSG_HELP_WEAKNESSES}>
                <i className="help circle icon blue" style={{ fontSize: "16px", cursor: "pointer", marginLeft: "10px" }} />
              </Tooltip>
              {!(weaknesses && weaknesses.length) ?
                <ElementsComponent
                  schema={schemaoOportunitiesWeaknesses}
                  placeholder={WEAKNESSES_PLACEHOLDER}
                  messageButton={`Agregar ${SINGULAR_TITLE_WEAKNESSES}`}
                  name={WEAKNESSES}
                  max={5}
                  title={TITLE_WEAKNESSES}
                  isEditable={true}
                  singularTitle={SINGULAR_TITLE_WEAKNESSES}
                  showCheck={true}
                />
                :
                <div>
                  <Row style={{ padding: "10px 10px 20px 20px", marginBottom: 30, display: 'flex', flexDirection: 'row' }} end="xs">
                    <Col xs={6} md={6} lg={6}>
                      <Icon
                        className='icon-message-elements'
                        size='huge'
                        name={'add square'}
                        style={{ color: '#16498b', fontSize: '34pt !important', margin: '0px 20px 10px 20px', cursor: 'pointer' }}
                        onClick={() => {

                        }}
                      />
                    </Col>
                  </Row>
                  <Row style={{ padding: "10px 10px 20px 30px", marginBottom: 70, width: '99%' }} end="xs">
                    <ItemList
                      data={weaknesses}
                      handleDelete={undefined}
                      handleEdit={undefined}
                      handleOnSelect={() => console.log('')}
                      showCheck={true}
                      title={TITLE_WEAKNESSES}
                      isEditable={true}
                    />
                  </Row>
                </div>
              }
            </div>
          </Col>
        </Row>
      </div >
    );
  }
}

const mapStateToProps = ({ elementsReducer, clientInformacion }) => ({
  elementsReducer,
  clientInformacion,
  weaknesses: clientInformacion.get('responseClientInfo').clientDetailsRequest.weaknesses.map(element => Object.assign({}, element, { idObject: element.id })) || [],
  opportunities: clientInformacion.get('responseClientInfo').clientDetailsRequest.opportunities.map(element => Object.assign({}, element, { idObject: element.id })) || []
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectOpportunitiesWeaknesses);
