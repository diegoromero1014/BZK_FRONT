import React, { Component } from 'react';
import axios from "axios";
import { APP_URL } from '../../constantsGlobal';

class LoginAuth extends Component {
  componentDidMount() {
    axios.get(APP_URL + "/hello-allowed")
    .then(function (response) {
      // handle success
      const id_token = localStorage.getItem('gtoken');
      console.log("ACCESS TO END POINT FREE ", response);

      axios.defaults.headers.common['Authorization'] = `Bearer ${id_token}`;
      axios.defaults.headers.common['BZK_MODE'] = `BZK_MODE_FROM_APP`;
      axios.defaults.headers.common['BZK_MODULE'] = `BZK_MODULE_FROM_APP`;
      axios.defaults.headers.common['BZK_ACTION'] = `BZK_ACTION_FROM_APP`;
      axios.defaults.withCredentials = true;

      axios.get(APP_URL + "/commercial/say-hello")
      .then(function (responseBzk) {
        console.log("RESPONSE FROM BZK", responseBzk);
      })
      .catch(function (errorBk) {
        console.log("Error from BZK", errorBk);
      });

    })
    .catch(function (error) {
      // handle error
      console.log("ACCESS TO END POINT FREE ERROR: ", error);
    })


  }

  render() {
    return (
      <div>
        <h1>Login Auth!!</h1>
      </div>
    );
  }
}

export default LoginAuth;