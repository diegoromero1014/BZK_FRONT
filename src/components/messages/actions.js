import * as actions from './constants';

export function toggleMessage(body){
  return {
    type: actions.TOGGLE_MESSAGE_BOX,
    body
  };
}
