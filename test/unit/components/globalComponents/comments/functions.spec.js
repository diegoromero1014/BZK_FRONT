import {numberFromText} from "../../../../../src/components/globalComponents/comments/functions";

describe('Test comments functions', () => {

    it('Test numberFromText function', () => {
        const result = numberFromText('DG');
        expect(result).to.equal(6871);
    });
});