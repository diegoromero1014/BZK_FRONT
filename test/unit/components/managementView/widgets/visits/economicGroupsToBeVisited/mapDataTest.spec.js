import { mapData } from "../../../../../../../src/components/managementView/widgets/visits/economicGroupsToBeVisited/mapData"

describe('mapData Test', () => {
    it('Case test 1', () => {
        const data = [
            {
                principalClientName: 'Any name',
                lastVisitType: null,
                lastVisitAuthor: null,
                lastVisitTime: null
            }
        ];
        const response = mapData(data);
        expect(response[0].principalClientName).to.equal('ANY NAME');
        expect(response[0].lastVisitType).to.equal('-');
        expect(response[0].lastVisitAuthor).to.equal('-');
        expect(response[0].lastVisitTime).to.equal('-');
    })

    it('Case test 2', () => {
        const data = [
            {
                principalClientName: null,
                lastVisitType: null,
                lastVisitAuthor: null,
                lastVisitTime: null
            }
        ];
        const response = mapData(data);
        expect(response[0].principalClientName).to.equal(null);
        expect(response[0].lastVisitType).to.equal('-');
        expect(response[0].lastVisitAuthor).to.equal('-');
        expect(response[0].lastVisitTime).to.equal('-');
    })

    it('Case test 3', () => {
        const data = [
            {
                principalClientName: 'any name',
                lastVisitType: 'Llamada',
                lastVisitAuthor: 'any name',
                lastVisitTime: 123456789
            }
        ];
        const response = mapData(data);
        expect(response[0].principalClientName).to.equal('ANY NAME');
        expect(response[0].lastVisitType).to.equal('Llamada');
        expect(response[0].lastVisitAuthor).to.equal('any name');
        expect(response[0].lastVisitTime).to.equal('02 ene. 1970, 05:17 am');
    })
})