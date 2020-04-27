import { getTaskBoardValues, getInformationUser } from "../../../../../../src/components/managementView/widgets/tasks/action";
import { TASK_BOARD_VALUES, GET_INFORMATION_USER } from "../../../../../../src/components/managementView/widgets/tasks/constants";

describe('Tasks Test Actions', () => {

    it('getTaskBoardValues', () => {
        const response = getTaskBoardValues();
        expect(response.type).to.equal(TASK_BOARD_VALUES);
    });

    it('getInformationUser', () => {
        const response = getInformationUser();
        expect(response.type).to.equal(GET_INFORMATION_USER);
    });
});