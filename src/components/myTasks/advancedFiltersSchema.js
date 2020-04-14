import * as Yup from 'yup';
import {MESSAGE_REQUIRED_FIELD} from '../../validationsFields/validationsMessages';

export const schema = {
    closingDateFrom: Yup.string()
        .trim()
        .required(MESSAGE_REQUIRED_FIELD("Desde"))
        .typeError(MESSAGE_REQUIRED_FIELD("Desde"))
};