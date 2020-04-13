import { ACTION_OUTDATED_CONTACTS } from "../../../../../../src/components/managementView/widgets/alerts/constants";
import { getOutdatedContacts } from "../../../../../../src/components/managementView/widgets/alerts/actions";


describe('Actions Test', () => {
    it('getOutdatedContacts should return type ACTION_OUTDATED_CONTACTS', () => {
        const response = getOutdatedContacts();
        expect(response.type).to.equal(ACTION_OUTDATED_CONTACTS);
    })
})