import {catchRequest, getCatchedResult, clearCache} from '../../../src/utils/catchRequest';

describe("", () => {

    before(function() {
        clearCache();
    })

    it('should catch request', () => {
        catchRequest('/e1', 'param1', 'result');

        const result = getCatchedResult('/e1', 'param1');

        console.log(result);

        if (!result) {
            //Se lanza error porque el endpoint si existe
            expect(true).equals(false);
            return;
        }
        expect(result).equal('result');
    })

    it('getCatchedResult should return false when endpoint doesnt exists', () => {
        expect(getCatchedResult('/e2', 'param')).equals(false);
    })

    it('getCatchedResult should return false when parameter doesnt exists', () => {
        expect(getCatchedResult('/e1', 'param2')).equals(false);
    })
})