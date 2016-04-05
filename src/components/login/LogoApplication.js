import React, {Component, propTypes} from 'react';
import * as constants from './constants';

class LogoApplication extends Component{
  render(){
    return(
        <img src={constants.IMG_LOGO_APP} />
    );
  }
}

export default LogoApplication;
