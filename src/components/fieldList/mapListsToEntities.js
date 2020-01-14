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

function getRequestFromElement(element, clientId) {
    return {
        client: clientId,
        text: element.value
    }
}

function getObjectListRequestFromReducer(opportunities, clientId) {
    let opportunitiesRequest = opportunities.map((opportunity) => {
        return {
            id: opportunity.id,
            client: clientId,
            text: opportunity.text
        }
    })
    return opportunitiesRequest;
}

function getObjectivesRequestFromReducer(objectives, clientId) {
    let objectivesRequest = objectives.map((objective) => {
        let objectiveRequest = getRequestFromElement(objective, clientId);
        objectiveRequest.relations = getStrategiesFromObjective(objective, clientId);
        return objectiveRequest;
    })
    return objectivesRequest;
}

export function createClientDetailRequestFromReducer(fieldListReducer, objectListReducer, clientId) {
    return {
        objectives: getObjectivesRequestFromReducer(fieldListReducer[listName].elements, clientId),
        opportunities: getObjectListRequestFromReducer(objectListReducer.Oportunidades.elements, clientId),
        weaknesses: getObjectListRequestFromReducer(objectListReducer.Debilidades.elements, clientId)
    }
}

function getStrategiesFromClientFromObjective(relations) {
    return relations.map(function(relation) {
        return Object.assign({}, relation.clientDetailRelation, { 
            value: relation.clientDetailRelation.text,
            "fieldlist-id": relation.clientDetailRelation.id
        });
    });
}

export function clientInformationToReducer(responseClientInfo) {

    if (!responseClientInfo.clientDetailsRequest) {
        return;
    }

    let objectives = responseClientInfo.clientDetailsRequest.objectives;
    
    if (!objectives) {
        return []
    }

    return objectives.map(function(objective) {
        let element = Object.assign({}, objective, {
            value: objective.text,
            "fieldlist-id": objective.id
        });
        element.strategies = getStrategiesFromClientFromObjective(objective.relations);
        return element;
    });

}