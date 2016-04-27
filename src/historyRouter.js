import {browserHistory as browserHistoryDev, useRouterHistory} from 'react-router';
import {createHistory} from 'history';
const browserHistoryProd = useRouterHistory(createHistory)({
    basename: '/biztrack'
});
const router = process.env.NODE_ENV === 'production' ? browserHistoryProd : browserHistoryDev;

export default router;
