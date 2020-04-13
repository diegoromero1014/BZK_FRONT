import reducer from '../../../../../../src/components/managementView/widgets/tasks/reducer';
import { TASK_BOARD_VALUES } from '../../../../../../src/components/managementView/widgets/tasks/constants';
import Immutable from 'immutable';

describe('Tasks Test Reducer', () => {

    it('reducer called type TASK_BOARD_VALUES', () => {
        const response = reducer(Immutable.Map({}), { type: TASK_BOARD_VALUES });
        expect(response).not.to.equal(null);
    })

    it('reducer called type is TASK_BOARD_VALUES and status is not 500', () => {
        const response = reducer(Immutable.Map({}), { type: TASK_BOARD_VALUES, payload: { data: { status: 200 }} });
        expect(response).not.to.equal(null);
    })

    it('reducer called type is null', () => {
        const response = reducer(Immutable.Map({}), { type: null });
        expect(response).not.to.equal(null);
    })
})