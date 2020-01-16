import {
    clientInformationToReducer,
    createClientDetailRequestFromReducer
} from '../../../../src/components/fieldList/mapListsToEntities'

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

});

describe("Test createClientDetailRequestFromReducer", () => {

    it("createClientDetailRequestFromReducer", () => {

        const fieldListReducer = {
            objectives: {
                elements: []
            }
        }
    
        const objectListReducer = {
            Oportunidades: {
                elements: []
            },
            Debilidades: {
                elements: []
            }
        }
    
        const clientId = 1;

        const result = createClientDetailRequestFromReducer(fieldListReducer, objectListReducer, clientId);

        expect(result.objectives.length).to.equal(0);
        expect(result.opportunities.length).to.equal(0);
        expect(result.weaknesses.length).to.equal(0);
    });


    it("should return objectives", () => {
        const fieldListReducer = {
            objectives: {
                elements: [
                    {
                        value: "objetivo 1"
                    },
                    {
                        value: "objetivo 2"
                    }
                ]
            }
        }
    
        const objectListReducer = {
            Oportunidades: {
                elements: []
            },
            Debilidades: {
                elements: []
            }
        }
    
        const clientId = 1;

        const result = createClientDetailRequestFromReducer(fieldListReducer, objectListReducer, clientId);

        expect(result.objectives.length).to.equal(2);
        expect(result.objectives[0].text).to.equal("objetivo 1");
        expect(result.objectives[1].text).to.equal("objetivo 2");
        expect(result.opportunities.length).to.equal(0);
        expect(result.weaknesses.length).to.equal(0);
    });

    it("should return strategies in objective", () => {
        const fieldListReducer = {
            objectives: {
                elements: [
                    {
                        value: "objetivo 1",
                        strategies: [
                            {
                                value: "estrategia"
                            }
                        ]
                    }
                ]
            }
        }
    
        const objectListReducer = {
            Oportunidades: {
                elements: []
            },
            Debilidades: {
                elements: []
            }
        }
    
        const clientId = 1;

        const result = createClientDetailRequestFromReducer(fieldListReducer, objectListReducer, clientId);

        expect(result.objectives.length).to.equal(1);
        expect(result.objectives[0].relations.length).to.equal(1);
        expect(result.objectives[0].relations[0].clientDetailRelation.text).to.equal("estrategia");
        expect(result.opportunities.length).to.equal(0);
        expect(result.weaknesses.length).to.equal(0);
    });


    it("should return opportunities", () => {
        const fieldListReducer = {
            objectives: {
                elements: [
                ]
            }
        }
    
        const objectListReducer = {
            Oportunidades: {
                elements: [
                    {
                        text: "oportunidad"
                    }
                ]
            },
            Debilidades: {
                elements: []
            }
        }
    
        const clientId = 1;

        const result = createClientDetailRequestFromReducer(fieldListReducer, objectListReducer, clientId);

        expect(result.objectives.length).to.equal(0);
        expect(result.opportunities.length).to.equal(1);
        expect(result.opportunities[0].text).to.equal("oportunidad");
        expect(result.weaknesses.length).to.equal(0);
    });

});