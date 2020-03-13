import React from 'react';
import { Table } from 'semantic-ui-react';
import { buildHeaders, buildRows } from './utilities';
import Pagination from './Pagination';

const TableComponent = ({ tableSettings }) => {
    return (
        <Table fixed>
            <Table.Header>
                <Table.Row>
                    {buildHeaders(tableSettings.columns)}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {buildRows(tableSettings)}
            </Table.Body>

            <Table.Footer>
                <Pagination {...tableSettings} />
            </Table.Footer>
        </Table>
    );
};

export default TableComponent; 