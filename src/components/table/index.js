import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { buildHeaders, buildRows } from './utilities';
import Pagination from './Pagination';
import '../../../styles/table/main.scss';

class TableComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            orderedColumn: null,
            direction: null
        }
    }

    handleSort = async clickedColumn => {
        const { orderedColumn, direction } = this.state;
        const { tableSettings: { onSort } } = this.props;

        if (orderedColumn !== clickedColumn) {
            await this.setState({
                orderedColumn: clickedColumn,
                direction: 'ascending',
            })
        } else {
            await this.setState({ direction: direction === 'ascending' ? 'descending' : 'ascending' });
        }

        onSort(this.state.orderedColumn, this.state.direction);
    }

    render() {
        const { tableSettings } = this.props;
        const { orderedColumn, direction } = this.state;

        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        {buildHeaders(tableSettings.columns, orderedColumn, direction, this.handleSort)}
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
    }
}

export default TableComponent;