import { listName } from './Objetives/utils';

function getStrategiesFromObjective(objective, clientId) {

    if (!objective.strategies) {
        return []
    }

    let strategies = objective.strategies.map((strategy) => {
        return getRequestFromElement(strategy, clientId);
    });

    return strategies;
}

function getRequestFromElement(element, clientId) {
    return {
        id: element.id,
        client: clientId,
        text: element.value,
        didChange: element.didChange
    }
}

export function getObjectListRequestFromReducer(opportunities, clientId) {
    let opportunitiesRequest = opportunities.map((opportunity) => {
        return {
            client: clientId,
            id: opportunity.id,
            text: opportunity.text,
            didChange: opportunity.didChange
        }
    })
    return opportunitiesRequest;
}

function getObjectivesRequestFromReducer(objectives, clientId) {
    let objectivesRequest = objectives.map((objective) => {
        let objectiveRequest = getRequestFromElement(objective, clientId);
        objectiveRequest.children = getStrategiesFromObjective(objective, clientId);
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
        return Object.assign({}, relation, { 
            value: relation.text,
            "fieldlist-id": relation.id
        });
    });
}

export function clientInformationToReducer(objectives) {
    
    if (!objectives) {
        objectives = []
    }

    return objectives.map(function(objective) {
        let element = Object.assign({}, objective, {
            value: objective.text,
            "fieldlist-id": objective.id
        });
        element.strategies = getStrategiesFromClientFromObjective(objective.children);
        return element;
    });

}