import React, {Component} from 'react';
import ImageBigLogin from './ImageBigLogin';

class LoginComponent extends Component {
    render() {
        return (
            <div id="welcome" className="frame welcome">
              <ImageBigLogin
                style = {{width: '100%', heigth: '100%', backgroundColor: 'green'}}
              />
            </div>
        );
    }
}

export default LoginComponent;
