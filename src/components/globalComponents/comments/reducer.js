import {ADD_COMMENT_LIST, CLEAR_COMMENTS, GET_COMMENTS_BY_TASK_ID} from "./constants";

const initialState = {
    comments: [
        {
            id: 3123123,
            initials: 'MC',
            author: 'Monica Castillo',
            createdTimestamp: 1517597630576,
            content: 'Recuerda hacer la diligencia a la dirección pactada',
            replies: [
                {
                    id: 48489477,
                    initials: 'CR',
                    author: 'Cristhian Rios',
                    createdTimestamp: 1517597630576,
                    content: 'Ya está listo',
                },
                {
                    id: 4890984,
                    initials: 'AA',
                    author: 'Alvaro Agudelo',
                    createdTimestamp: 1517597630576,
                    content: 'Moni, tenemos un inconveniente.',
                }
            ]
        },
        {
            id: 43223,
            initials: 'DG',
            author: 'Daniel Gallego',
            createdTimestamp: 1517597630576,
            content: 'Enterado'
        },
    ]
};

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case GET_COMMENTS_BY_TASK_ID:
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
        default:
            return state;
    }
}