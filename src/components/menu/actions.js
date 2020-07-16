import { APP_URL } from "../../constantsGlobal";
import * as actions from "./constants";
import axios from "axios";

export function initialMenuPermissions(menu) {
  return {
    type: actions.INITIAL_MENU,
    menu,
  };
}

export function changeActiveItemMenu(activeItem) {
  return {
    type: actions.CHANGE_ITEM_ACTIVE_MENU,
    activeItem,
  };
}

export async function closeSession() {
  await axios.post(APP_URL + "/closeSession", {
    sessionToken: window.localStorage.getItem("sessionTokenFront")
  });
}
