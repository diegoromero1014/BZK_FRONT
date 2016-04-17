import React, {Component, PropTypes} from 'react';

import ImageLogoApp from '../globalComponents/LogoApplication';
import TitleLogin from './TitleLogin';
import FormLogin from './FormLogin';
import FooterLogin from './Footer';
import {Row, Grid, Col} from 'react-flexbox-grid';

class ImageBigLogin extends Component{

  render(){
    const {urlImage} = this.props;
    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div id="welcome" className="frame welcome"
              style={{backgroundImage: urlImage}}>
              <Grid style={{width: '100%'}}>
                  <Row>
                      <div className="welcome-img">
                        <ImageLogoApp/>
                      </div>
                  </Row>
                  <Row>
                  <Col md={12} className="welcome-main" style={{width: "100%",paddingLeft: "45px"}}>
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
              </Grid>
          </div>
        </Col>
      </Row>
    )
  }
}

ImageBigLogin.PropTypes = {
  urlImage: PropTypes.string.isRequired
};

export default ImageBigLogin;
