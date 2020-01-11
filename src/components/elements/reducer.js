const initialState = {

}

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case CREATE_LIST_ELEMENTS:
        return { ...state, ...payload }
    default:
        return state
    }
}
