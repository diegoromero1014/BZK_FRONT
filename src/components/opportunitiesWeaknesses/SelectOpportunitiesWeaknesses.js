import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from "react-flexbox-grid";
import { Icon } from 'semantic-ui-react';
import ItemList from "../elements/itemList";
import ElementsComponent from "../elements";
import { addToList } from '../elements/actions';
import { OBJECTIVES_PLACEHOLDER } from "../participants/constants";
import { schema } from "../participants/schema";
import { OPPORTUNITIES, WEAKNESSES } from './constants';

class SelectOpportunitiesWeaknesses extends Component {

  handleOnSelect = (name, element, associated) => {
    const { dispatchAddToList } = this.props;

    dispatchAddToList({ name, data: Object.assign({}, element, { associated }), old: element });
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
            {!opportunities.length ?
              <ElementsComponent
                schema={schema}
                placeholder={OBJECTIVES_PLACEHOLDER}
                messageButton='Agregar'
                name={OPPORTUNITIES}
                max={3}
                title={'Oportunidades 1'}
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
                      onClick={() => console.log('hola')}
                    />
                  </Col>
                </Row>
                <Row style={{ padding: "10px 10px 20px 30px", marginBottom: 70, width: '99%' }} end="xs">
                  <ItemList
                    data={opportunities.filter(opportunity => opportunity.associated)}
                    handleDelete={undefined}
                    handleEdit={undefined}
                    handleOnSelect={(element, { target: { checked } }) => this.handleOnSelect(OPPORTUNITIES, element, checked)}
                    showCheck={true}
                    title={"Oportunidades 2"}
                    isEditable={true}
                  />
                </Row>
              </div>
            }

          </Col>

          <Col xs={6}>
            {!weaknesses.length ?
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
                      onClick={() => console.log('hola')}
                    />
                  </Col>
                </Row>
                <Row style={{ padding: "10px 10px 20px 30px", marginBottom: 70, width: '99%' }} end="xs">
                  <ItemList
                    data={weaknesses.filter(weakness => weakness.associated)}
                    handleDelete={undefined}
                    handleEdit={undefined}
                    handleOnSelect={(element, { target: { checked } }) => this.handleOnSelect(WEAKNESSES, element, checked)}
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

const mapStateToProps = ({ elementsReducer }) => ({
  elementsReducer,
  weaknesses: elementsReducer[WEAKNESSES].elements || [],
  opportunities: elementsReducer[OPPORTUNITIES].elements || [],
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    dispatchAddToList: addToList,
  }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectOpportunitiesWeaknesses);
