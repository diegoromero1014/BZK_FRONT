import { DEFAULT_NO_ROW_MESSAGE } from "./constants";
import { noop } from 'lodash';

export default class TableSettings {
    constructor({
        data = [],
        columns = [],
        message = DEFAULT_NO_ROW_MESSAGE,
        onClick = noop,
        totalRecords = 0,
        recordsPerPage = 10,
        onPageChange = noop,
        onSort = noop,
        striped = false,
        maximumVisiblePages = 5,
        initialPage = 1,
        loading = false
    }) {
        this.data = data
        this.columns = columns;
        this.message = message;
        this.onClick = onClick;
        this.colSpan = columns.length;
        this.totalRecords = totalRecords;
        this.recordsPerPage = recordsPerPage;
        this.onPageChange = onPageChange;
        this.onSort = onSort;
        this.striped = striped;
        this.maximumVisiblePages = maximumVisiblePages;
        this.initialPage = initialPage;
        this.loading = loading;
    }
}