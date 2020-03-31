import React from 'react';
import { Grid, Col, Row } from "react-flexbox-grid";
import { Progress, Loader } from 'semantic-ui-react';
import './style.scss';
import { RESPONSIBLE, ASSIGNED } from '../../components/myTasks/constants';

const returnTitle = (role, total) => {
  switch (role) {
    case RESPONSIBLE:
      return `Total tareas que me han asignado ${total}`;
    case ASSIGNED:
      return `Total tareas que he asignado ${total}`;
    default:
      return `Total tareas que me han asignado ${total}`;
  }
}
const handleProgress = (loading, finalizedN, pendingN, total ) => {
  if(!loading && finalizedN != 0 || pendingN != 0 ){
    return (
      <Progress
        className="animated fadeIn"
        value={isNaN(finalizedN) ? 0 : finalizedN}
        total={isNaN(total) ? 0 : total}
        active
        label="ratio"
        style={{ height: "25px", color: "#005dbf" }}
      />
    );
  }else if(finalizedN === 0 && pendingN === 0 && !loading ){
    return (
      <div style={{ padding: "10px" }}>
        <h3 style={{textAlign: "center"}}>No hay tareas</h3>
      </div>);   
  }else if (loading){
    return(
      <div style={{ padding: "10px" }}>
        <Loader active inline style={{ left: "50%" }}></Loader>
      </div>);
  }
}
const ProgressBarComponent = ({finalized, pending, role, loading}) => {
    let finalizedN = parseInt(finalized);
    let pendingN = parseInt(pending);
    let total = parseInt(finalizedN + pendingN);
    return (
      <Grid style={{ margin: "20px auto" }}>
        <div style={{ textAlign: "center", padding: "5px" }}>
          <h2 style={{ textAlign: "center" }}>{returnTitle(role, total)}</h2>
        </div>
        <Row style={{ height: "50px" }}>
          <Col xs={12} sm={12} md={12} lg={12}>
            {handleProgress(loading, finalizedN, pendingN, total)}
          </Col>
        </Row>
        <Row>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div id="finalized-label" />
              <span style={{ marginLeft: "10px" }}>
                <h4>{`Tareas finalizadas: ${finalizedN}`}</h4>
              </span>
            </div>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ marginLeft: "10px" }}>
                <h4>{`Tareas pendientes: ${pendingN}`}</h4>
              </span>
              <div id="pending-label" />
            </div>
          </Col>
        </Row>
      </Grid>
    );
}

export default ProgressBarComponent;