import React, { Component } from "react";
import { Row, Col } from "react-flexbox-grid";
import { Icon } from "semantic-ui-react";

export default class NotificationComponent extends Component {

    state = {
        options: [
            { type: "success", color: "#A5DC86" },
            { type: "error", color: "#E95B4C" },
            { type: "info", color: "#00448c" }
        ]
    }
    
    render() {
        const { type, title, component } = this.props;
        const option = this.state.options.filter(elem => elem.type === type);

        return (
            <div 
                className="alert animated slideInLeft" 
                style={{ 
                    minWidth: "500px",
                    maxWidth: "500px",
                    maxHeight: "50vh",
                    position: "absolute",
                    bottom: 40,
                    left: 40,
                    zIndex: "9999", 
                    borderColor: "#d3d3d3", 
                    borderRadius: "5px", 
                    borderBottom: `10px solid ${option[0].color}`, 
                    backgroundColor: "#F3F3F3", color: "grey",
                    overflow: 'hidden',
                }}
                >
                <Row>
                    <Col xs={2}>
                        <center>
                            <Icon 
                                className="warning circle icon"
                                style={{ fontSize: "20px", margin: "12px" }}
                            />  
                        </center>
                    </Col>
                    <Col xs={8}>
                        <center style={{ marginTop: "10px" }}>
                            <strong name='titleNotification'>{ title }</strong>
                        </center>
                    </Col>
                    <Col xs={2}>
                        <center>
                            <Icon 
                                className="times circle outline icon" 
                                onClick={() => this.props.close()}
                                style={{ fontSize: "20px", margin: "12px", cursor: "pointer" }}
                            />    
                        </center>  
                    </Col>
                    <Col xs={12}>
                        <center name='contentComponent'>{ component }</center> 
                    </Col>
                </Row>
            </div>
        );
    }
}