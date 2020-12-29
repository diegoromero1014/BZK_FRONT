import React, {Component} from 'react';
import axios from "axios";
import { redirectUrl } from '../globalComponents/actions';

class CallBackAuth extends Component {
    componentDidMount() {
        console.log("PROPS FROM AUTH: ", this.props);
        const {state, code, scope} = this.props.location.query;
        console.log("PARAMETERS FROM AUTH: ", state, code, scope);

        // TODO: request token - remember refresh token
        axios.post('https://oauth2.googleapis.com/token', {
            code: code,
            client_id: '936062566636-4ejqc4s88h4ocsej0gid71403lskha9s.apps.googleusercontent.com',
            client_secret: '6MFNmqm53T6ZbnZy9KpHbXUC',
            redirect_uri: 'http://commercialapp.local.com:3000/callback-auth',
            grant_type: 'authorization_code'
        })
        .then(function (response) {
            console.log("RESPONSE TOKEN TO ACCESS PROTECTED RESOURCE", response);

            const {id_token} = response.data;

            localStorage.setItem("gtoken", id_token)

            redirectUrl("/login-auth")

        })
        .catch(function (error) {
            console.log(error);
        });

    }

    render() {
        return (
            <div>
                <h1>Callback</h1>
            </div>
        );
    }
}
export default CallBackAuth;