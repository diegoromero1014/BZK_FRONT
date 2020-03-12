import {
    addCommentToList,
    clearComments, fillComments,
    getCurrentComments
} from "../../../../../src/components/globalComponents/comments/actions";
import {
    ADD_COMMENT_LIST,
    CLEAR_COMMENTS, FILL_COMMENTS,
    GET_CURRENT_COMMENTS_LIST
} from "../../../../../src/components/globalComponents/comments/constants";

describe('Test comments actions', () => {

    it('addCommentToList should return ADD_COMMENT_LIST type', () => {
       const response = addCommentToList({
           id: 12312,
           content: 'Prueba comentario',
           parentCommentId: null,
           createdTimestamp: new Date()
       });
       expect(response.type).to.equal(ADD_COMMENT_LIST);
    });

    it('clearComments should return CLEAR_COMMENTS type', () => {
        const response = clearComments();
        expect(response.type).to.equal(CLEAR_COMMENTS);
    });

    it('getCurrentComments should return GET_CURRENT_COMMENTS_LIST type', () => {
        const response = getCurrentComments();
        expect(response.type).to.equal(GET_CURRENT_COMMENTS_LIST);
    });

    it('fillComments should return FILL_COMMENTS type', () => {
        const response = fillComments();
        expect(response.type).to.equal(FILL_COMMENTS);
    });
});