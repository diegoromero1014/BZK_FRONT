import { listName } from './Objetives/Objetives';

function getStrategiesFromObjective(objective, clientId) {

    if (!objective.strategies) {
        return []
    }

    let strategies = objective.strategies.map((strategy) => {
        let clientDetailRelation = {
            "clientDetailRelation": getRequestFromElement(strategy, clientId)
        }
        return clientDetailRelation;
    });

    return strategies;
}

export function getObjectivesRequestFromReducer(objectives, clientId) {
    let objectivesRequest = objectives.map((objective) => {
        let objectiveRequest = getRequestFromElement(objective, clientId);
        objectiveRequest.relations = getStrategiesFromObjective(objective, clientId);
        return objectiveRequest;
    })
    return objectivesRequest;
}

function getRequestFromElement(element, clientId) {
    return {
        id: element.id,
        client: clientId,
        text: element.value
    }
}

function getObjectListRequestFromReducer(opportunities, clientId) {
    let opportunitiesRequest = opportunities.map((opportunity) => {
        return {
            id: opportunity.id,
            client: clientId,
            text: opportunity.texto
        }
    })
    return opportunitiesRequest;
}

export function createClientDetailRequestFromReducer(fieldListReducer, objectListReducer, clientId) {

    return {
        objectives: getObjectivesRequestFromReducer(fieldListReducer[listName].elements, clientId),
        opportunities: getObjectListRequestFromReducer(objectListReducer.Oportunidades.elements, clientId),
        weaknesses: getObjectListRequestFromReducer(objectListReducer.Debilidades.elements, clientId)
    }

}