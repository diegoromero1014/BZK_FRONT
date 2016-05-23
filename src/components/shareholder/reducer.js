import Immutable from 'immutable';
import {CLEAR_SHAREHOLDERS_ORDER,CLEAR_SHAREHOLDERS_CREATE, GET_SHAREHOLDERS_LIST_CLIENT,CHANGE_KEYWORD_SHAREHOLDER,CHANGE_PAGE,
  LIMITE_INF,CLEAR_SHAREHOLDERS,ORDER_COLUMN_SHAREHOLDER,CLEAR_SHAREHOLDERS_PAGINATOR, UPDATE_CERTIFICATE_NO_SHAREHOLDER} from './constants';

const initialState = Immutable.Map({
    status: "processed",
    shareholders: [],
    keywordShareholder: "",
    limInf : 0,
    page:1,
    rowCount:0,
    orderShareholder: 1,
    columnShareholder:"sh.sharePercentage"
});


export default (state = initialState, action) => {
    switch (action.type) {
        case GET_SHAREHOLDERS_LIST_CLIENT:
          const response = action.payload.data;
            return state.withMutations(map => {
                map
                .set('status', response.status)
                .set('rowCount', response.rowCount)
                .set('shareholders', JSON.parse(response.shareholders));
            });
            case CHANGE_KEYWORD_SHAREHOLDER:
                return state.set('keywordShareholder', action.keywordShareholder);
            case CHANGE_PAGE:
                return state.set('page', action.currentPage);
            case LIMITE_INF:
                return state.set('limInf', action.limInfe);
            case CLEAR_SHAREHOLDERS:
                return state.withMutations(map => {
                    map
                    .set('page', 1)
                    .set('limInf', 0)
                    .set('shareholders', [])
                    .set('rowCount', 0)
                    .set('enableClickCertificationShareholder', "")
                    .set('orderShareholder', 1)
                    .set('columnShareholder',"sh.sharePercentage");
                });
            case CLEAR_SHAREHOLDERS_PAGINATOR:
                    return state.withMutations(map => {
                        map
                        .set('page', 1)
                        .set('limInf', 0);
                    });
          case CLEAR_SHAREHOLDERS_ORDER:
                  return state.withMutations(map => {
                        map
                        .set('orderShareholder', 1)
                        .set('columnShareholder', "sh.sharePercentage")
                    });
        case CLEAR_SHAREHOLDERS_CREATE:
                    return state.withMutations(map => {
                        map
                        .set('page', 1)
                        .set('limInf', 0)
                        .set('keywordShareholder','')
                    });
          case ORDER_COLUMN_SHAREHOLDER:
                return state.withMutations(map => {
                    map
                    .set('orderShareholder', action.orderShareholder)
                    .set('columnShareholder', action.columnShareholder)});

          case UPDATE_CERTIFICATE_NO_SHAREHOLDER:
            const data = action.payload.data.data;
            var responseClientInfo = state.get('responseClientInfo');
            if( responseClientInfo !== null && responseClientInfo !== undefined ){
              responseClientInfo.certificateNoShareholder = data;
              return state.set("responseClientInfo", responseClientInfo);
            } else {
              return state;
            }

        default:
            return state;
    }
}
