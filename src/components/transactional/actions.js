import { SET_URL_PARAMETER } from './constants';

export function setUrlParameter(parameter, url) {

  return {
    type: SET_URL_PARAMETER,
      parameter,
      url
  }
}

