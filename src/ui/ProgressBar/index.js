import React from 'react';
import { Grid, Col, Row } from "react-flexbox-grid";
import { Progress } from 'semantic-ui-react';
import './style.scss';

const returnTitle = (role, total) => {
  switch (role) {
    case "RESPONSIBLE":
      return `Total tareas que me han asignado ${total}`;
    case "ASSIGNED":
      return `Total tareas que he asignado ${total}`;
    default:
      return `Total tareas que me han asignado ${total}`;
  }
}
const ProgressBarComponent = ({finalized, pending, role}) => {
    let total = finalized + pending;
    return (
      <Grid style={{ margin: "20px auto" }}>
        <div style={{ textAlign: "center", padding:"5px" }}>
          <h3 style={{ textAlign: "center" }}>{returnTitle(role, total)}</h3>
        </div>
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
              <div id="finalized-label" />
              <span style={{ marginLeft: "10px" }}>
                 <h4>{`Tareas finalizadas: ${finalized}`}</h4>
              </span>
            </div>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ marginLeft: "10px" }}>
                <h4>{`Tareas pendienes: ${pending}`}</h4>
              </span>
              <div id="pending-label" />
            </div>
          </Col>
        </Row>
      </Grid>
    );
}

export default ProgressBarComponent;