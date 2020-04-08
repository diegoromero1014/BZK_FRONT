import {ADD_EMPLOYEE_VALUE, CLEAR_EMPLOYEE_VALUE } from "./constants";

export const addEmployeeValue = (employeeValue) => {
    return {
        type: ADD_EMPLOYEE_VALUE,
        employeeValue
    };
};

export const clearEmployeeValue = () => {
    return {
        type: CLEAR_EMPLOYEE_VALUE
    };
};