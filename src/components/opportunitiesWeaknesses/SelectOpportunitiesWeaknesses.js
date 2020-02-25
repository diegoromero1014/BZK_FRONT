import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from "react-flexbox-grid";
import { Icon } from 'semantic-ui-react';
import ItemList from "../elements/itemList";
import ElementsComponent from "../elements";
import { OBJECTIVES_PLACEHOLDER } from "../participants/constants";
import { schema } from "../participants/schema";
import { OPORTUNITIES , WEAKNESSES} from './constants';

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
          <Col xs={6}>
            {!(opportunities && opportunities.length) ?
              <ElementsComponent
                schema={schema}
                placeholder={OBJECTIVES_PLACEHOLDER}
                messageButton='Agregar'
                name={OPORTUNITIES}
                max={3}
                title={'Oportunidades'}
                isEditable={true}
                singularTitle={'oportunidad'}
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
                    title={"Oportunidades"}
                    isEditable={true}
                  />
                </Row>
              </div>
            }

          </Col>

          <Col xs={6}>
            {!(weaknesses && weaknesses.length) ?
              <ElementsComponent
                schema={schema}
                placeholder={OBJECTIVES_PLACEHOLDER}
                messageButton='Agregar'
                name={WEAKNESSES}
                max={3}
                title={'Debilidades 1'}
                isEditable={true}
                singularTitle={'oportunidad'}
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

                      }}
                    />
                  </Col>
                </Row>
                <Row style={{ padding: "10px 10px 20px 30px", marginBottom: 70, width: '99%' }} end="xs">
                  <ItemList
                    data={[]}
                    handleDelete={undefined}
                    handleEdit={undefined}
                    handleOnSelect={() => console.log('')}
                    showCheck={true}
                    title={"Debilidades 2"}
                    isEditable={true}
                  />
                </Row>
              </div>
            }

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
