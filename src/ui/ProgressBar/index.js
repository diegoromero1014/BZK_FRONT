import React from 'react';
import { Grid, Col, Row } from "react-flexbox-grid";
import { Progress } from 'semantic-ui-react';
import './style.scss';

const ProgressBarComponent = ({finalized, pending}) => {
    let total = finalized + pending;
    return (
      <Grid style={{margin:"20px auto"}}>
        <Row style={{ height: "50px" }}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Progress
              value={finalized}
              total={total}
              active
              label={finalized}
              style={{ height: "25px" }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div id="finalized-label"/>
              <span style={{ marginLeft: "10px" }}>
                {`Tareas finalizadas: ${finalized}`}
              </span>
            </div>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ marginLeft: "10px" }}>
                {`Tareas pendienes: ${pending}`}
              </span>
              <div id="pending-label"/>
            </div>
          </Col>
        </Row>
      </Grid>
    );
}

export default ProgressBarComponent;