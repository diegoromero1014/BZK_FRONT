import React, {Component, PropTypes} from 'react';
import ImageLogoApp from '../../../img/svg/logo_bancolombia.svg';

class LogoApplication extends Component{
  render(){
    const {style} = this.props;
    return(
        <img src={ImageLogoApp} style={style} />
    );
  }
}

LogoApplication.PropTypes = {
    style: PropTypes.object
};

export default LogoApplication;
