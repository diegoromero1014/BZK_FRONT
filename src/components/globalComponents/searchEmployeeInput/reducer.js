import {ADD_EMPLOYEE_VALUE, CLEAR_EMPLOYEE_VALUE } from "./constants";

const initialState = {
    employeeValue: ''
};

export default (state = initialState, action) => {
    switch(action.type){
        case ADD_EMPLOYEE_VALUE:
            return Object.assign({}, state, { employeeValue: action.employeeValue });
        case CLEAR_EMPLOYEE_VALUE:
            return Object.assign({}, state, { employeeValue: '' });
        default:
            return state;
    }
}