import CommentsComponentRedux, {CommentsComponent} from "../../../../../src/components/globalComponents/comments/commentsComponent";
import React from 'react';
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import {
    MESSAGE_ERROR_INJECTION_HTML,
    MESSAGE_WARNING_FORBIDDEN_CHARACTER, MESSAGE_WARNING_FORBIDDEN_CHARACTER_COMMENT,
    MESSAGE_WARNING_MAX_LENGTH,
    MESSAGE_WARNING_TASK_OBSERVATIONS
} from "../../../../../src/validationsFields/validationsMessages";
import {
    ERROR_COMMENT_LENGTH,
    MAX_LENGTH_USER_TASK_COMMENT,
    NO_NOTES_MESSAGE
} from "../../../../../src/components/globalComponents/comments/constants";
import {MentionsInput} from "react-mentions";

let dispatchClearComments;
let dispatchFilterUsers;
let dispatchAddCommentList;
let dispatchSwtShowMessage;
let saveCommentAction;

let commentsReducer;

let localStorage;
let defaultProps = {};
let store;
const middleware = [thunk];
const mockStore = configureStore(middleware);


describe('Test commentsComponent', () => {

    beforeEach(() => {
        dispatchClearComments = sinon.fake();
        dispatchFilterUsers = sinon.stub();
        dispatchFilterUsers.resolves({
            payload: {
                data: {
                    data: [{
                        idUsuario: 1,
                        title: 'Daniel Gallego'
                    }]
                }
            }
        });
        dispatchSwtShowMessage = sinon.fake();
        dispatchAddCommentList = sinon.fake();
        saveCommentAction = sinon.stub();
        localStorage = sinon.stub(window.localStorage, 'getItem').returns('Daniel Gallego');
        commentsReducer = {
            comments: [
                {
                    id: 32132,
                    initials: 'DG',
                    author: 'Daniel Gallego',
                    parentCommentId: null,
                    createdTimestamp: new Date(),
                    content: 'Este es el contenido del comentario',
                    replies: [
                        {
                            id: 4342,
                            initials: 'KM',
                            author: 'Katherine Mancera',
                            parentCommentId: 32132,
                            createdTimestamp: new Date(),
                            content: 'Esta es la respuesta al comentario',
                            replies: []
                        }
                    ]
                }
            ]
        };
        defaultProps = {
            dispatchClearComments,
            dispatchFilterUsers,
            dispatchSwtShowMessage,
            dispatchAddCommentList,
            commentsReducer,
            saveCommentAction,
            header: 'Notas',
            disabled: false
        };
        store = mockStore({
            defaultProps
        });
    });

    afterEach(() => {
        localStorage.restore();
    });

    describe('Rendering tests', () => {

        it('should render commmentsComponent', () => {
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            wrapper.unmount();
            expect(dispatchClearComments.called).to.equal(true);
        });

        it('should render commmentsComponent when subscription is null', () => {
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            wrapper.instance().subscription = null;
            wrapper.unmount();
            expect(dispatchClearComments.called).to.equal(true);
        });

        it('should render comment textarea disabled', () => {
            defaultProps.disabled = true;
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const commentTextArea = wrapper.find(MentionsInput).find({nameInput: 'comment', disabled: 'disabled'});
            expect(commentTextArea).to.have.lengthOf(1);
        });

        it('should render Sin notas asociadas message when comments length is equal to 0', () => {
            defaultProps.commentsReducer.comments = [];
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const noCommentsMessage = wrapper.find('p');
            expect(noCommentsMessage.text()).to.equal(NO_NOTES_MESSAGE);
        });
    });

    describe('Actions tests', () => {
        it('should call handleChange function on commentTextArea change', async () => {
            defaultProps.disabled = true;
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const commentTextArea = wrapper.find(MentionsInput).find({nameInput: 'comment', disabled: 'disabled'});
            commentTextArea.simulate('change', { target: { value: 'Daniel' } });
            expect(wrapper.state().comment).to.equal('Daniel');
        });

        it('should render showNewCommentError when value contains more than 1000 characters', () => {
            defaultProps.disabled = true;
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const commentTextArea = wrapper.find(MentionsInput).find({nameInput: 'comment', disabled: 'disabled'});
            const buttonAddComment = wrapper.find('button').find({id: 'addCommentButton'});
            commentTextArea.simulate('change', { target: { value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a fringilla tortor. Nunc faucibus nibh tristique velit ullamcorper, ut gravida ipsum faucibus. Nulla lacinia fringilla volutpat. Duis pulvinar ac ante vitae elementum. Pellentesque et ex non massa mollis lacinia quis vitae tellus. Aliquam vehicula turpis quis ex viverra cursus. Duis ut finibus nunc. Proin posuere rhoncus neque sed pellentesque. Donec cursus est non fermentum molestie. Mauris viverra vitae diam egestas consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.Morbi augue dui, facilisis at nisi sed, blandit finibus eros. Morbi magna libero, vulputate at pulvinar vitae, dictum id velit. Aenean vel sapien interdum, ullamcorper lectus dapibus, sodales quam. Nulla id sapien efficitur, fermentum nunc porttitor, feugiat enim. Vivam  efficitur, fermentum nunc porttitor, feugiat enim. Vivam' } });
            buttonAddComment.simulate('click', { preventDefault: sinon.fake()});
            expect(wrapper.state().showNewCommentError).to.equal(MESSAGE_WARNING_MAX_LENGTH(MAX_LENGTH_USER_TASK_COMMENT));
        });

        it('should render showNewCommentError when value contains forbidden characters', () => {
            defaultProps.disabled = true;
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const commentTextArea = wrapper.find(MentionsInput).find({nameInput: 'comment', disabled: 'disabled'});
            const buttonAddComment = wrapper.find('button').find({id: 'addCommentButton'});
            commentTextArea.simulate('change', { target: { value: '-Daniel' } });
            buttonAddComment.simulate('click', { preventDefault: sinon.fake()});
            expect(wrapper.state().comment).to.equal('-Daniel');
            expect(wrapper.state().showNewCommentError).to.equal(MESSAGE_WARNING_FORBIDDEN_CHARACTER_COMMENT);
        });

        it('should render showReplyCommentError when value contains forbidden characters', () => {
            defaultProps.disabled = true;
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const commentTextArea = wrapper.find(MentionsInput).find({nameInput: 'commentReply'}).at(0);
            const buttonAddComment = wrapper.find('button').find({id: 'replyCommentButton4342'}).at(0);
            commentTextArea.simulate('change', { target: { value: '=Daniel' } });
            buttonAddComment.simulate('click', { preventDefault: sinon.fake()});
            expect(wrapper.state().commentReply).to.equal('=Daniel');
            expect(wrapper.state().showReplyCommentError).to.equal(MESSAGE_WARNING_FORBIDDEN_CHARACTER_COMMENT);
        });

        it('should render showReplyCommentError when value contains html injection', () => {
            defaultProps.disabled = true;
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const commentTextArea = wrapper.find(MentionsInput).find({nameInput: 'commentReply'}).at(0);
            const buttonAddComment = wrapper.find('button').find({id: 'replyCommentButton4342'}).at(0);
            commentTextArea.simulate('change', { target: { value: '<script>Daniel</script>' } });
            buttonAddComment.simulate('click', { preventDefault: sinon.fake()});
            expect(wrapper.state().commentReply).to.equal('<script>Daniel</script>');
            expect(wrapper.state().showReplyCommentError).to.equal(MESSAGE_ERROR_INJECTION_HTML);
        });

        it('should render showReplyCommentError when value contains observations pattern', () => {
            defaultProps.disabled = true;
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const commentTextArea = wrapper.find(MentionsInput).find({nameInput: 'commentReply'}).at(0);
            const buttonAddComment = wrapper.find('button').find({id: 'replyCommentButton4342'}).at(0);
            commentTextArea.simulate('change', { target: { value: 'Daniel{}' } });
            buttonAddComment.simulate('click', { preventDefault: sinon.fake()});
            expect(wrapper.state().commentReply).to.equal('Daniel{}');
            expect(wrapper.state().showReplyCommentError).to.equal(MESSAGE_WARNING_TASK_OBSERVATIONS);
        });

        it('should render showReplyCommentError when value is empty', () => {
            defaultProps.disabled = true;
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const commentTextArea = wrapper.find(MentionsInput).find({nameInput: 'commentReply'}).at(0);
            const buttonAddComment = wrapper.find('button').find({id: 'replyCommentButton4342'}).at(0);
            commentTextArea.simulate('change', { target: { value: '' } });
            buttonAddComment.simulate('click', { preventDefault: sinon.fake()});
            expect(wrapper.state().commentReply).to.equal('');
            expect(wrapper.state().showReplyCommentError).to.equal(ERROR_COMMENT_LENGTH);
        });

        it('should render showNewCommentError when value is ok', () => {
            defaultProps.disabled = true;
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const commentTextArea = wrapper.find(MentionsInput).find({nameInput: 'comment', disabled: 'disabled'});
            const buttonAddComment = wrapper.find('button').find({id: 'addCommentButton'});
            commentTextArea.simulate('change', { target: { value: 'Daniel' } });
            buttonAddComment.simulate('click', { preventDefault: sinon.fake()});
            expect(wrapper.state().comment).to.equal('');
            expect(wrapper.state().showNewCommentError).to.equal(null);
            expect(dispatchAddCommentList.called).to.equal(true);
        });

        it('should change with id commentBeingReplied state when reply action is clicked', () => {
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const noteReplyAction = wrapper.findWhere(n => n.key() === 'reply32132');
            noteReplyAction.simulate('click');
            expect(wrapper.state().commentBeingReplied).to.equal(32132);
        });

        it('should change with null commentBeingReplied state when reply action is clicked', () => {
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const noteReplyAction = wrapper.findWhere(n => n.key() === 'reply32132');
            wrapper.state().commentBeingReplied = 32132;
            noteReplyAction.simulate('click');
            expect(wrapper.state().commentBeingReplied).to.equal(null);
        });

        it('should onSearch observable when username length is greater than 3', () => {
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const callback = sinon.stub();
            callback.resolves(true);
            wrapper.instance().fetchUsers('@Daniel', callback);
        });

        it('should onSearch observable when username length is lower than 3', () => {
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const callback = sinon.stub();
            callback.resolves(true);
            wrapper.instance().fetchUsers('@Da', callback);
        });

        it('should onSearch observable when username length is equal to 3', () => {
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const callback = sinon.stub();
            callback.resolves(true);
            wrapper.instance().fetchUsers('@Dan', callback);
        });

        it('searchComment should return a reply when it sends a replies array', () => {
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const reply = wrapper.instance().searchComment(defaultProps.commentsReducer.comments[0].replies, 4342);
            expect(reply).not.to.equal(null);
        });

        it('searchComment should return a null', () => {
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const reply = wrapper.instance().searchComment(defaultProps.commentsReducer.comments, 43425);
            expect(reply).to.equal(null);
        });

        it('searchComment should return a reply', () => {
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            const reply = wrapper.instance().searchComment(defaultProps.commentsReducer.comments, 4342);
            expect(reply).not.to.equal(null);
        });

        it('addComment when has a parentComment', async () => {
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            await wrapper.instance().addComment({ preventDefault: sinon.fake() }, 4342, 'Esta es la respuesta al comentario de respuesta', 'reply');
            expect(wrapper.state().commentReply).to.equal('');
        });

        it('addComent when reportId is not null', async () => {
            defaultProps.reportId = 1234;
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            await wrapper.instance().addComment({ preventDefault: sinon.fake() }, 4342, 'Esta es la respuesta al comentario de respuesta', 'reply');
        });

        it('addComent when reportId is not null and is a new comment', async () => {
            defaultProps.reportId = 1234;
            const wrapper = itRenders(<CommentsComponent {...defaultProps}/>);
            await wrapper.instance().addComment({ preventDefault: sinon.fake() }, null, 'Esta es la respuesta al comentario de respuesta', 'new');
        });

    });

    describe('Rendering Redux test', () => {
        it('should render redux connection', () => {
            itRenders(<CommentsComponentRedux store={store}/>);
        });
    });
});