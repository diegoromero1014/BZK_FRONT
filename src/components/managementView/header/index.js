import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

export default function Header() {
    return (
        <Row>
            <Col md={3}>
                <div style={{marginTop: 30, fontSize: 20}}>
                    Bienvenido(a) <span style={{ textTransform: 'capitalize' }}>{window.localStorage.getItem('name').toLowerCase().split(' ')[0]}</span>
                </div>
            </Col>
            <Col mdOffset={8} md={1} style={{ display: 'none'}}>
                <img src={'../../../img/icon/settings.png'} alt={'title'} style={{ fontSize: 40, marginLeft: '50px', marginTop: 30, cursor: 'pointer' }} />
            </Col>
        </Row>
    );
}