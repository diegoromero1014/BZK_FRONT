import { 
    buildHeaders,
    extractValueByKey 
} from '../../../../src/components/table/utilities';
import { noop } from 'lodash'; 

let columns ; 
let orderedColumn ;
let direction ;
let handleSort ;
let object ; 
let prop ;

describe('Test for TableComponent Utilities', () => {

    describe('Test functions', () => {

        it('Test buildHeaders function', () => {
            columns = []
            orderedColumn = '',
            direction = '',
            handleSort = noop;

            const result = buildHeaders(columns, orderedColumn, direction, handleSort);
            expect(result.length).to.equal(0);
        })

        it('Test extractValueByKey function', () => {
            object = {
                name : 'nombre',
                age : 'edad',
                gender : 26
            }
            prop = 'name'
            const result = extractValueByKey(object, prop);
            console.log(result)
        })
    })
})