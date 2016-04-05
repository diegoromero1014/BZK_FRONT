import React, {Component} from 'react';
import {Row, Col} from 'react-redux';

import * as constants from './constants';
import ImageBigLogin from './ImageBigLogin';

class LoginComponent extends Component {
    render() {
        return (
          <ImageBigLogin
            urlImage = {constants.URL_IMG_BIG_LOGIN}
          />
        );
    }
}

export default LoginComponent;
