import React from 'react';
import { Col, Row } from "react-flexbox-grid";
import {
  GREEN_COLOR,
  ORANGE_COLOR,
  RED_COLOR
} from "./../../constantsGlobal";


const PendingTasksHelp = _ =>{
    return (
      <div>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div
            style={{
              height: "50px",
              marginLeft: "30px",
              width: "auto",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <Row
              style={{
                width: "172px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  backgroundColor: GREEN_COLOR
                }}
              />
              <span style={{ marginLeft: "10px" }}> Tarea con tiempo</span>
            </Row>
            <Row
              style={{
                width: "150px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  backgroundColor: RED_COLOR
                }}
              />
              <span style={{ marginLeft: "10px" }}> Tarea vencida</span>
            </Row>
            <Row
              style={{
                width: "225px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  backgroundColor: ORANGE_COLOR
                }}
              />
              <span style={{ marginLeft: "10px" }}>
                {" "}
                Tarea próxima a vencerse
              </span>
            </Row>
          </div>
        </Col>
      </div>
    );
}
export default PendingTasksHelp;