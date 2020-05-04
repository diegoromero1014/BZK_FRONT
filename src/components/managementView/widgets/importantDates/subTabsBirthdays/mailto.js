import React from 'react';
import { NAME } from './constants';

const MailTo = ({ data, type }) => (
    <a href={`mailto:${data.email}?Subject=¡Feliz cumpleaños!`}>
        {type === NAME ? data.contactName : data.contactLastName}
    </a>
);

export default MailTo;