import CommercialReportInfoFooter from "../../../../src/components/globalComponents/commercialReportInfoFooter";

let defaultProps = {};

describe('Test globalComponents/commercialReportInfoFooter', () => {

    beforeEach(() => {
        defaultProps = {
            documentCreatedInfo: {
                createdBy: 'Daniel Gallego',
                updatedBy: 'Daniel Gallego',
                positionCreatedBy: 'Analista de Desarrollo',
                positionUpdatedBy: 'Analista de Desarrollo',
                createdTimestamp: '30 dic. 2019, 11:16 am',
                updatedTimestamp: '30 dic. 2019, 11:17 am',
                datePrevisitLastReview: '18 ene. 2015'
            }
        }
    });

    it('It should render CommercialReportInfoFooter', () => {
        itRenders(<CommercialReportInfoFooter {...defaultProps}/>);
    });
});