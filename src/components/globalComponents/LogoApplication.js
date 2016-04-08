import React, {Component, PropTypes} from 'react';
import * as constants from '../login/constants';

class LogoApplication extends Component{
  render(){
    const {style} = this.props;
    return(
        <img src={constants.IMG_LOGO_APP} style={style} />
    );
  }
}

LogoApplication.PropTypes = {
    style: PropTypes.object
};

export default LogoApplication;
