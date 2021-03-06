import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { formatNumeral } from '../../actionsGlobal';

export default class NotificationExpiredPortfolio extends Component {

    constructor(props) {
        super(props);

        this.state = {
            seeMore: false
        }
    }

    render() {
        const { data } = this.props;
        const { seeMore } = this.state;
        
        return (
            <div>
                { !seeMore ?
                    <center name="verMas"><p style={{ cursor: "pointer", color: '#3498db' }} onClick={() => this.setState({ seeMore: !seeMore}) }>Ver más...</p></center>
                    :
                    <center name="verMenos"><p style={{ cursor: "pointer", color: '#3498db' }} onClick={() => this.setState({ seeMore: !seeMore}) }>Ver menos...</p></center>
                }
                <br/>
                { seeMore &&
                    <div name='content' className="animated zoomIn" style={{ marginBottom: 30 }}>
                        <Row>
                            <Col xs={5} style={{ textAlign: 'left'}}><strong>Línea de Negocio</strong></Col>
                            <Col xs={4} style={{ textAlign: 'right'}}><strong>Saldo Vencido</strong></Col>
                            <Col xs={3} style={{ textAlign: 'right'}}><strong>Días</strong></Col>
                        </Row>
                        <div style={{
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            maxHeight: '30vh'
                        }}>
                            { 
                                data.map(item => (
                                    <div key={item.idAlert} style={{ padding: 5 }}>
                                        <Row style={{ marginBottom: '10px'}}>
                                            <Col xs={5} style={{ textAlign: 'left'}}>{ item.entityName }</Col>
                                            <Col xs={4} style={{ textAlign: 'right'}}>{ formatNumeral(item.overdueBalance,'$0,0[.]00') }</Col>
                                            <Col xs={3} style={{ textAlign: 'right'}}>{ item.daysArrears }</Col>
                                        </Row>
                                        <hr style={{ marginTop: "0px", marginBottom: "0px" }}/>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}