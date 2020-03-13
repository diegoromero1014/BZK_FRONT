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

    setOptions = options => {
        this.options = options;
        return this;
    }

    build = () => new TableSettings(this);
}
