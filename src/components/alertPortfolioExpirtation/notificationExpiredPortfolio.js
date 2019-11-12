import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';

export default class NotificationExpiredPortfolio extends Component {

    constructor(props) {
        super(props);

        this.state = {
            seeMore: true
        }
    }

    render() {
        const { data } = this.props;
        const { seeMore } = this.state;
        
        return (
            <div>
                { seeMore ?
                    <center><p style={{ cursor: "pointer"}} onClick={() => this.setState({ seeMore: !seeMore}) }>Ver más...</p></center>
                    :
                    <center><p style={{ cursor: "pointer"}} onClick={() => this.setState({ seeMore: !seeMore}) }>Ver menos...</p></center>
                }
                <br/>
                { !seeMore &&
                    <div className="animated fadeInUp">
                        <Row>
                            <Col xs={4}><strong>Entidad</strong></Col>
                            <Col xs={4}><strong>Saldo Vencido</strong></Col>
                            <Col xs={4}><strong>Días</strong></Col>
                        </Row>
                        { 
                            data.map(item => (
                                <div>
                                    <Row>
                                        <Col xs={4}>{ item.entityName }</Col>
                                        <Col xs={4}>{ item.overdueBalance }</Col>
                                        <Col xs={4}>{ item.daysArrears }</Col>
                                    </Row>
                                    <hr style={{ marginTop: "0px", marginBottom: "0px" }}/>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        );
    }
    
}