import { mapData } from "../../../../../../../src/components/managementView/widgets/importantDates/subTabsBirthdays/mapData";

describe('mapData Test', () => {
    it('Case test 1', () => {
        const data = [
            {
                id: 1,
                contactName: "any name",
                contactLastName: "any last name",
                contactBirth: 123456789,
                email: "a@a.com",
                contactPosition: "any",
                contactType: "any type",
                contactPhone: "any",
                clients: "any client 1",
                clientImportantDatesDTO: [
                    {
                        name: "any client 2", 
                        count: 1
                    }
                ]
            }
        ];
        const response = mapData(data);
        expect(response[0].contactName).to.equal('ANY NAME');
        expect(response[0].contactLastName).to.equal('ANY LAST NAME');
        expect(response[0].contactBirth).to.equal('02 ene.');
    })

    it('Case test 2', () => {
        const data = [];
        const response = mapData();
        expect(response.length).to.equal(0);
    })
})

