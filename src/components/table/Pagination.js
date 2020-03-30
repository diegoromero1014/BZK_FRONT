import React, { Component } from 'react';
import { Icon, Menu, Table } from 'semantic-ui-react';
import { DEFAULT_PAGE } from './constants';
import '../../../styles/pagination/main.scss';

class Pagination extends Component {

    constructor(props) {
        super(props);

        this.state = {
            totalPage: 0,
            page: 1,
        }
    }

    async componentWillMount() {
        const { totalRecords, recordsPerPage, initialPage } = this.props;

        const pages = [];
        const totalPage = Math.ceil(totalRecords / recordsPerPage);

        for (let i = 0; i < totalPage; i++) {
            pages.push(i + 1);
        }

        await this.setState({ totalPage, pages, page: initialPage });
    }

    async componentWillUpdate(nextProps) {
        const { totalRecords, initialPage } = this.props;

        if (nextProps.totalRecords != totalRecords) {
            const totalPage = Math.ceil(nextProps.totalRecords / nextProps.recordsPerPage);

            const pages = [];

            for (let i = 0; i < totalPage; i++) {
                pages.push(i + 1);
            }

            await this.setState({ totalPage, pages });
        }

        if (initialPage !== nextProps.initialPage) {
            await this.setState({ page: nextProps.initialPage });
        }
    }

    renderItem = (totalRecords, recordsPerPage, current) => this.getPages(totalRecords, recordsPerPage, current).map((page, index) =>
        <Menu.Item
            as='a'
            key={index}
            className={`item-page ${this.state.page === page ? 'active' : ''}`}
            onClick={() => this.handleOnChangePage(page)}
        >
            {page}
        </Menu.Item>
    );

    getPages = (totalPage, current) => {
        const { maximumVisiblePages } = this.props;
        const { pages } = this.state;

        const limit = totalPage - maximumVisiblePages;

        if (totalPage > maximumVisiblePages) {
            if (current <= limit) {
                return pages.slice(current - 1, current + maximumVisiblePages - 1);
            }

            return pages.slice(limit, current + maximumVisiblePages - 1);
        }

        return pages;
    }

    handleNextPage = () => {
        const { page, totalPage } = this.state;

        if (page !== totalPage) {
            this.handleOnChangePage(page + 1);
        }
    }

    handlePrevPage = () => {
        const { page } = this.state;
        if (page !== DEFAULT_PAGE) {
            this.handleOnChangePage(page - 1);
        }
    }

    handleOnChangePage = async page => {
        const { onPageChange } = this.props;

        await this.setState({ page });

        if (onPageChange) {
            onPageChange(page);
        }
    }

    render() {
        const { colSpan, recordsPerPage, totalRecords } = this.props;
        const { page, totalPage } = this.state;

        return (
            <Table.Row>
                {totalRecords > recordsPerPage &&
                    <Table.HeaderCell colSpan={colSpan} textAlign='center' style={{ cursor: 'pointer', overflowX: 'auto' }}>
                        <Menu pagination>
                            <Menu.Item as='left' icon onClick={this.handlePrevPage} disabled={page === DEFAULT_PAGE} className={page === DEFAULT_PAGE ? 'disabled' : ''}>
                                <Icon name='chevron left' />
                            </Menu.Item>

                            {this.renderItem(totalPage, page)}

                            <Menu.Item as='right' icon onClick={this.handleNextPage} disabled={page === totalPage} className={page === totalPage ? 'disabled' : ''} >
                                <Icon name='chevron right' />
                            </Menu.Item>
                        </Menu>
                    </Table.HeaderCell>
                }
            </Table.Row>
        );
    }
}

export default Pagination;