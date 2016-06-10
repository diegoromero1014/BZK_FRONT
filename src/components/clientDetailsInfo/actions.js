import {APP_URL} from '../../constantsGlobal';
import {UPDATE_ACTIVE_TAB} from './constants';
import axios from 'axios';

export function updateTabSeleted( tabActive ){
  return {
    type: UPDATE_ACTIVE_TAB,
    payload: tabActive
  }
}
