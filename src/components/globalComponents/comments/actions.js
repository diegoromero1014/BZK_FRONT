import {ADD_COMMENT_LIST, CLEAR_COMMENTS, FILL_COMMENTS, GET_CURRENT_COMMENTS_LIST} from "./constants";

export function addCommentToList(comment){
    return {
        type: ADD_COMMENT_LIST,
        payload: {
            comment
        }
    }
}

export function clearComments(){
    return {
        type: CLEAR_COMMENTS
    };
}

export function getCurrentComments(){
    return {
        type: GET_CURRENT_COMMENTS_LIST
    };
}

export function fillComments(comments){
    return{
        type: FILL_COMMENTS,
        payload: {
            comments
        }
    };
}