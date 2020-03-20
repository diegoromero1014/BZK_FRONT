import TableSettings from './TableSettings';

export default class TableBuilder {
    constructor(data, columns) {
        this.data = data;
        this.columns = columns;
    }

    setNoRowMessage = message => {
        this.message = message;
        return this;
    };

    setOnClick = onClick => {
        this.onClick = onClick
        return this;
    };

    setTotalRecords = totalRecords => {
        this.totalRecords = totalRecords;
        return this;
    }

    setRecordsPerPage = recordsPerPage => {
        this.recordsPerPage = recordsPerPage;
        return this;
    }

    setOnPageChange = onPageChange => {
        this.onPageChange = onPageChange;
        return this;
    }

    setOnSort = onSort => {
        this.onSort = onSort;
        return this;
    }

    setStriped = striped => {
        this.striped = striped;
        return this;
    }

    setMaximumVisiblePages = maximumVisiblePages => {
        this.maximumVisiblePages = maximumVisiblePages;
        return this;
    }

    build = () => new TableSettings(this);
}
