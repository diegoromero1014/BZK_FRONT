import React, {Component, PropTypes} from 'react';

import ImageLogoApp from '../globalComponents/logoApplication';
import TitleLogin from './titleLogin';
import FormLogin from './formLogin';
import FooterLogin from './footer';
import {Row, Grid, Col} from 'react-flexbox-grid';
import ImageLogin from '../../../img/bg-login2.jpg';

class ImageBigLogin extends Component{

  render(){
    const {urlImage} = this.props;
    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <img className="frame welcome"
            style={{zIndex: "-5"}}
            src={ImageLogin} />
            <Row>
                <div className="welcome-img">
                  <ImageLogoApp/>
                </div>
            </Row>
            <Row>
            <Col md={12} className="welcome-main" style={{width: "100%",paddingLeft: "45px",paddingRight: '45px'}}>
                  <Col md={8} sm={7} style={{float: "left", marginTop: "0px" }}>
                      <TitleLogin/>
                  </Col>
                  <Col md={4} sm={5} style={{float: "right", width: "100%"}}>
                      <FormLogin />
                  </Col>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}><FooterLogin /></Col>
            </Row>
        </Col>
      </Row>
    )
  }
}

export default ImageBigLogin;
