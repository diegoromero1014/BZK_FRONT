import {ADD_COMMENT_LIST, CLEAR_COMMENTS, FILL_COMMENTS, GET_CURRENT_COMMENTS_LIST} from "./constants";
import moment from "moment";

const initialState = {
    comments: []
};

export default (state = initialState, {type, payload}) => {
    switch (type) {
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
                    comment.id = typeof comment.id === 'string' && comment.id.includes('new') ? null : comment.id;
                    comment.createdTimestamp = moment(comment.createdTimestamp).valueOf();
                    if(comment.replies.length){
                        comment.replies.map(reply => {
                            reply.id = typeof reply.id === 'string' && reply.id.includes('new') ? null : reply.id;
                            reply.parentCommentId = comment.id;
                            reply.createdTimestamp = moment(reply.createdTimestamp).valueOf();
                        });
                    }
                    return comment;
                })
            });
        case FILL_COMMENTS:
            return {comments: payload.comments};
        default:
            return state;
    }
}