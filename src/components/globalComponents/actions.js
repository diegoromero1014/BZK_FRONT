import { browserHistory } from 'react-router';
import axios from 'axios';

export function redirectUrl(url) {
  browserHistory.push(url);
    return {
        sessionToken: url
    }
}
