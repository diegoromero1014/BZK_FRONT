import { clientInformationToReducer } from '../../../../src/components/fieldList/mapListsToEntities'

describe("Test ClientInformationToReducer", () => {

    it("clientInformationToReducer", () => {
        const result = clientInformationToReducer({});
        expect(result).to.equal(undefined);
    });
    
    it("return empty array when there is not objectives", () => {
        const result = clientInformationToReducer({
            clientDetailsRequest: {}
        });
        expect(result.length).to.equal(0);
    });

    it("should return objectives", () => {
        const result = clientInformationToReducer({
            clientDetailsRequest: {
                objectives: [
                    {
                        text: "objetivo",
                        id: 1,
                        relations: []
                    }
                ]
            }
        });

        expect(result.length).to.equal(1);
        expect(result[0].value).to.equal("objetivo");
        expect(result[0]["fieldlist-id"]).to.equal(1);
        expect(result[0].strategies.length).to.equal(0);
    });

    it("should return strategies inside objective", () => {
        const result = clientInformationToReducer({
            clientDetailsRequest: {
                objectives: [
                    {
                        text: "objetivo",
                        id: 1,
                        relations: [
                            {
                                clientDetailRelation: {
                                    text: "estrategia",
                                    id: 2
                                }
                            }
                        ]
                    }
                ]
            }
        });

        expect(result.length).to.equal(1);
        expect(result[0].value).to.equal("objetivo");
        expect(result[0]["fieldlist-id"]).to.equal(1);
        expect(result[0].strategies.length).to.equal(1);
        expect(result[0].strategies[0].value).to.equal("estrategia");
        expect(result[0].strategies[0]["fieldlist-id"]).to.equal(2);
    })

})