import { getImportantDates } from '../../../../../../src/components/managementView/widgets/importantDates/actions';

describe('Actions Test', () => {
    it("getImportantDates should return type equal to parameter", () => {
        const action = "ACTION_EXAMPLE";
        const response = getImportantDates(action, "", 0, 0);
        expect(response.type).to.equal(action);
    })
})