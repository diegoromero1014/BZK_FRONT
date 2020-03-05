import {ADD_COMMENT_LIST, CLEAR_COMMENTS, GET_COMMENTS_BY_REPORT_ID, GET_CURRENT_COMMENTS_LIST} from "./constants";

const initialState = {
    comments: []
};

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case GET_COMMENTS_BY_REPORT_ID:
            return Object.assign({}, state, { comments: payload.data.data });
        case CLEAR_COMMENTS:
            return Object.assign({}, state, { comments: [] });
        case ADD_COMMENT_LIST:
            let comments = state.comments;
            const { comment } = payload;
            if(comment.parentCommentId){
                comments.map(c => {
                    if(c.id === comment.parentCommentId){
                        c.replies.push(comment);
                    }
                })
            }else{
                comments.push(comment);
            }
            return Object.assign({}, state, { comments: Object.assign([], comments)});
        case GET_CURRENT_COMMENTS_LIST:
            return Object.assign({}, state, {
                comments: state.comments.map(comment => {
                    comment.id = comment.id.contains('new') ? null : comment.id;
                    return comment;
                })
            });
        default:
            return state;
    }
}