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
        propsComponent = {},
        Component,
        onSort = noop
    }) {
        this.data = data
        this.columns = columns;
        this.message = message;
        this.onClick = onClick;
        this.colSpan = columns.length;
        this.totalRecords = totalRecords;
        this.recordsPerPage = recordsPerPage;
        this.onPageChange = onPageChange;
        this.propsComponent = propsComponent;
        this.onSort = onSort;
        this.Component = Component;
    }
}