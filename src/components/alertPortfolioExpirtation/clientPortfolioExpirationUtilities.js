/**
 * Created by user- on 12/6/2016.
 */
import {shorterStringValue, mapDateValueFromTask,formatNumeral} from '../../actionsGlobal';
import {VIEW_OBSERVATION} from '../modal/constants';

export const mapDataGrid = (data = []) => {

    return data.map((alertPortfolioExp, idx) => ({
        idNumberClient  : alertPortfolioExp.idNumberClient,
        clientNameLink: {
            id: alertPortfolioExp.idClient,
            value: shorterStringValue(alertPortfolioExp.clientName),
            link: '/dashboard/clientInformation'
        },
        balanceOverdue: formatNumeral(alertPortfolioExp.balanceOverdue,'$0,0[.]00'),
        groupTotalBalance: formatNumeral(alertPortfolioExp.groupTotalBalance,'$0,0[.]00'),
        daysOverdue: alertPortfolioExp.daysOverdue,
        entity: alertPortfolioExp.entity,
        responsible: shorterStringValue(alertPortfolioExp.responsible),
        actions: {
            actionView: true,
            id: alertPortfolioExp.id,
            urlServer: ".component/",
            component: VIEW_OBSERVATION,
            modalSize: 'md'
        },
    }));
};
