import React from 'react';
import { Table } from 'semantic-ui-react';
import { get } from 'lodash';
import { PROPERTY, ALL_OBJECT } from './constants';

export const buildHeaders = columns => columns.map(({ header }, index) => <Table.HeaderCell key={index}>{header}</Table.HeaderCell>);

export const buildRows = tableSettings => {
    const { data, colSpan, defaultNoRowMessage } = tableSettings;

    if (validateData(data)) {
        return data.map((element, index) => buildRow(element, index, tableSettings));
    } else {
        return <Table.HeaderCell colSpan={colSpan} textAlign='center'>{defaultNoRowMessage}</Table.HeaderCell>
    }
}

export const validateData = data => Array.isArray(data) && data.length;

const buildRow = (element, index, { columns, onClick }) => {
    const props = columns.map(column => get(column, PROPERTY, ALL_OBJECT));

    return (
        <Table.Row key={index} onClick={event => onClick(element, event)}>
            {props.map((prop, index) => (
                <Table.Cell
                    style={{
                        textAlign: 'justify',
                        whiteSpace: 'pre-line',
                        textOverflow: 'ellipsis',
                        wordWrap: 'break-word',
                        cursor: 'pointer'
                    }}
                    key={index}
                    verticalAlign='middle'
                >
                    {extractValueByKey(element, prop)}
                </Table.Cell>
            ))}
        </Table.Row>
    )
}

export const extractValueByKey = (object, prop) => get(object, prop, object);