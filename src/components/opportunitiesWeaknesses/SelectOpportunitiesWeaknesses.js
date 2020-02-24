import React, { Component } from "react";
import { Row, Col } from "react-flexbox-grid";
import { Icon } from 'semantic-ui-react';
import ItemList from "../elements/itemList";
import ElementsComponent from "../elements";
import { OBJECTIVES_PLACEHOLDER } from "../participants/constants";
import { schema } from "../participants/schema";

class SelectOpportunitiesWeaknesses extends Component {

  state = {
    opportunities: undefined,
    weaknesses: undefined
  }

  componentDidMount() {
    this.setInfo();
  }

  setInfo = () => {
    const { infoClient } = this.props;

    let weaknesses = [];
    let opportunities = [];

    if (infoClient && infoClient.clientDetailsRequest.weaknesses) {
      weaknesses = infoClient.clientDetailsRequest.weaknesses.map(element => Object.assign({}, element, { idObject: element.id }));
    }

    if (infoClient && infoClient.clientDetailsRequest.opportunities) {
      opportunities = infoClient.clientDetailsRequest.opportunities.map(element => Object.assign({}, element, { idObject: element.id }));
    }

    this.setState({
      weaknesses,
      opportunities
    })
  }

  render() {
    const { visual } = this.props;

    console.log(this.state.weaknesses);
    console.log(this.state.opportunities);

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
            {/* <ItemList
              data={[
                { id: 1, text: 'Lo que sea', associated: true },
                { id: 2, text: 'Lo que sea' }
              ]}
              handleDelete={undefined}
              handleEdit={undefined}
              handleOnSelect={() => console.log('')}
              showCheck={true}
              title={"title"}
              isEditable={true}
            /> */}

            <ElementsComponent
              schema={schema}
              placeholder={OBJECTIVES_PLACEHOLDER}
              messageButton='Agregar'
              name={"opportunities"}
              max={3}
              title={'Oportunidades'}
              isEditable={true}
              singularTitle={'oportunidad'}
              showCheck={true}
            />
          </Col>

          <Col xs={6} style={{ paddingRight: 20, paddingLeft: 10 }}  >
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
                title={"Oportunidades"}
                isEditable={true}
              />
            </Row>
          </Col>
        </Row>
      </div >
    );
  }
}

export default SelectOpportunitiesWeaknesses;
