import { getEconomicGroupsToBeVisited } from "../../../../../../src/components/managementView/widgets/visits/actions";
import { ACTION_ECONOMIC_GROUPS_TO_BE_VISITED } from "../../../../../../src/components/managementView/widgets/visits/constants";

describe('Actions Test', () => {
    it('getEconomicGroupsToBeVisited should return type ACTION_ECONOMIC_GROUPS_TO_BE_VISITED', () => {
        const response = getEconomicGroupsToBeVisited();
        expect(response.type).to.equal(ACTION_ECONOMIC_GROUPS_TO_BE_VISITED);
    })
})