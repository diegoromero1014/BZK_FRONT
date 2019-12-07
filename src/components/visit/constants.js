export const NUMBER_RECORDS = 10;
export const FILTER_STATUS_VISIT_ID = "FILTER_STATUS_VISIT_ID";
export const DELETE_TYPE_VISIT = "DELETE_TYPE_VISIT";
export const CHANGE_PAGE = "CHANGE_PAGE";
export const LIMITE_INF = "LIMITE_INF";
export const ORDER_COLUMN_VISIT = "ORDER_COLUMN_VISIT";
export const GET_VISIT_LIST_CLIENT = "GET_VISIT_LIST_CLIENT";
export const CLEAR_VISIT = "CLEAR_VISIT";
export const CLEAR_VISIT_PAGINATOR = "CLEAR_VISIT_PAGINATOR";
export const CLEAR_VISIT_ORDER = "CLEAR_VISIT_ORDER";
export const CLEAR_VISIT_CREATE = "CLEAR_VISIT_CREATE";
export const CREATE_VISIT = "CREATE_VISIT";
export const GET_DETAIL_VISIT = "GET_DETAIL_VISIT";
export const PDF = "PDF";
export const OWNER_DRAFT = "OWNER_DRAFT";
export const CHANGE_IDPREVISIT = "CHANGE_IDPREVISIT";
export const CLEAR_IDPREVISIT = "CLEAR_IDPREVISIT";
export const GET_CSV_VISIT_BY_CLIENT = "GET_CSV_VISIT_BY_CLIENT";
export const KEY_TYPE_VISIT = "Visita";
export const TAB_VISIT = 2;
export const CHANGE_PAGE_ASSOCIATE__VISIT = "CHANGE_PAGE_ASSOCIATE__VISIT";
export function getRequestBodyDownloadPDF(id) {
  return {
    name: "reportPreVisit.pdf",
    route: "BiztrackReports/reportPreVisit.jrxml",
    params: {
      P_ID_PREVISIT: id
    },
    source: []
  };
};
