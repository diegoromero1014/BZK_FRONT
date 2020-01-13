export function getObjectivesRequestFromReducer(objectives, clientId) {
    debugger;
    let objectivesRequest = objectives.map((objective) => {
        return {
            id: objective.id,
            client: clientId,
            text: objective.value
        }
    })
    return objectivesRequest;
}

export function createClientDetailRequestFromReducer(fieldListReducer, clientId) {

    return {
        objectives: getObjectivesRequestFromReducer(fieldListReducer.objectives.elements, clientId)
    }

}