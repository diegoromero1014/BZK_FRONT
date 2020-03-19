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

export const buildRow = (element, index, { columns, onClick }) => {
    const cells = columns.map(column => Object.assign({}, column, { prop: get(column, PROPERTY, ALL_OBJECT) }));

    return (
        <Table.Row key={index} onClick={event => onClick(element, event)}>
            {cells.map((cell, i) => (
                <Table.Cell
                    style={{
                        textAlign: 'justify',
                        whiteSpace: 'pre-line',
                        textOverflow: 'ellipsis',
                        wordWrap: 'break-word',
                        cursor: 'pointer',
                        overflow: 'inherit'
                    }}
                    key={i}
                    verticalAlign='middle'
                >

                    {renderValue(cell, element)}
                </Table.Cell>
            ))}
        </Table.Row>
    )
}

const renderValue = ({ prop, component }, element) => {
    if (prop === ALL_OBJECT || (component && component.Component)) {
        const { Component, propsComponent } = component;

        return (<Component data={extractValueByKey(element, prop)} {...propsComponent} />)
    } else {
        return extractValueByKey(element, prop);
    }
}

export const extractValueByKey = (object, prop) => get(object, prop, object);