import React, {Component, PropTypes} from 'react';

import ImageLogoApp from './LogoApplication';
import TitleLogin from './TitleLogin';
import FormLogin from './FormLogin';
import FooterLogin from './Footer';

class ImageBigLogin extends Component{
  render(){
    const {urlImage} = this.props;
    console.log("urlImage: " + urlImage);
    return (
      <div id="welcome" className="frame welcome"
          style={{backgroundImage: urlImage}}>
          <div className="welcome-img">
            <ImageLogoApp/>
          </div>
          <div className="welcome-main">
            <div style={{float: "left", marinTop: "0px", width: "40%", paddingLeft: "45px"}}>
              <TitleLogin/>
            </div>
            <div style={{float: "left", paddingLeft: "20%", width: "35%"}}>
              <FormLogin />
            </div>
          </div>
          <FooterLogin />
      </div>
    )
  }
}

ImageBigLogin.PropTypes = {
  urlImage: PropTypes.string.isRequired
};

export default ImageBigLogin;
