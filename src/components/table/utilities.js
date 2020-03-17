import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import { get } from 'lodash';
import { PROPERTY, ALL_OBJECT, ASCENDING } from './constants';

export const buildHeaders = (columns, orderedColumn, direction, handleSort) => columns.map(({ header, prop, width }, index) => (
    <Table.HeaderCell
        key={index}
        style={{ cursor: 'pointer' }}
        onClick={async () => await handleSort(prop)}
        width={width ? width : null}
    >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, padding: 0 }}>{header}</p>

            {direction &&
                renderSortedIcon(prop, orderedColumn, direction)
            }

        </div>
    </Table.HeaderCell>
));

const renderSortedIcon = (prop, orderedColumn, direction) => {
    if (prop === orderedColumn) {
        if (direction === ASCENDING) {
            return <Icon name='caret up' />;
        } else {
            return <Icon name='caret down' />;
        }
    }
}

export const buildRows = tableSettings => {
    const { data, colSpan, message } = tableSettings;

    if (validateData(data)) {
        return data.map((element, index) => buildRow(element, index, tableSettings));
    } else {
        return <Table.HeaderCell colSpan={colSpan} textAlign='center'>{message}</Table.HeaderCell>
    }
}

export const validateData = data => Array.isArray(data) && data.length;

const buildRow = (element, index, { columns, onClick, Component, propsComponent }) => {
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
                        cursor: 'pointer',
                        overflow: 'inherit'
                    }}
                    key={index}
                    verticalAlign='middle'
                >

                    {Component && prop === ALL_OBJECT ? <Component data={extractValueByKey(element, prop)} {...propsComponent} /> : extractValueByKey(element, prop)}
                </Table.Cell>
            ))}
        </Table.Row>
    )
}

export const extractValueByKey = (object, prop) => get(object, prop, object);