import React, {Component} from 'react'
import {connect} from 'react-redux';
import {Comment, Form, Header} from 'semantic-ui-react'
import {Row} from 'react-flexbox-grid';
import Col from 'react-flexbox-grid/lib/components/Col';
import CommentsAvatar from './commentsAvatar';
import moment from 'moment';
import {Mention, MentionsInput} from 'react-mentions';
import {bindActionCreators} from "redux";
import {filterUsersBanco} from "../../participantsVisitPre/actions";
import {Subject} from "rxjs";
import {addCommentToList, clearComments, createComment, getCommentsByTaskId} from "./actions";
import _ from "lodash";
import {REQUEST_SUCCESS} from "../../../constantsGlobal";
import {swtShowMessage} from "../../sweetAlertMessages/actions";
import {COMMENT_CREATED_ERROR, COMMENT_CREATED_SUCCESS, COMMENT_CREATED_TITLE} from "./constants";
import {getUsernameInitials} from "../../../functions";

export class CommentsComponent extends Component {

    constructor(props) {
        super(props);
        this.onSearch$ = new Subject();
        this.users = [];
        this.state = {
            commentBeingReplied: null,
            commentReply: '',
            comment: ''
        }
    }

    componentDidMount() {
        this.subscription = this.onSearch$.debounceTime(300)
            .subscribe( debounced => this.filterUsersAction(debounced));
    }

    componentWillUnmount() {
        const { dispatchClearComments } = this.props;
        dispatchClearComments();
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }

    replyCommentAction = (id) => {
        if (this.state.commentBeingReplied === id) {
            this.setState({
                commentBeingReplied: null
            });
        } else {
            this.setState({
                commentBeingReplied: id
            });
        }
    };

    handleChange = async (event, source) => {
        const comment = event.target.value;
        if(source === 'new'){
            await this.setState({ comment });
        }else{
            await this.setState({ commentReply: event.target.value });
        }
    };

    fetchUsers = (query, callback) => {
        let commentSplitted = query.split('@');
        const username = commentSplitted[commentSplitted.length - 1];
        if(username.length >= 3){
            this.onSearch$.next({username, callback});
        }
    };

    filterUsersAction = ({username, callback}) => {
        const { dispatchFilterUsers } = this.props;
        dispatchFilterUsers(username)
            .then(response => response.payload.data.data.map(user => ({id: user.idUsuario, display: user.title})))
            .then(callback);
    };

    searchComment = (comments, commentId) => {
        for (let i = 0; i < comments.length; i++) {
            const comment = comments[i];
            if(comment.id !== commentId){
                if(comment.replies.length){
                    const reply = this.searchComment(comment.replies, commentId);
                    if(reply)
                        return reply;
                }
            }else{
                return comment;
            }
        }
        return null;
    };

    /*****************Funciones para pasar al TaskPage*******************************/
    addComment = async (parentCommentId, content) => {
        const { taskId, comments, dispatchAddCommentList } = this.props;
        const author = window.localStorage.getItem('name');
        const initials = getUsernameInitials(author);
        const parentComment = this.searchComment(comments, parentCommentId);
        const comment = {
            id: _.uniqueId(),
            taskId: taskId || null,
            content,
            parentCommentId: parentComment && parentComment.parentCommentId ? parentComment.parentCommentId : parentCommentId,
            initials,
            author,
            replies: [],
            createdTimestamp: moment(new Date())
        };

        if(taskId){
            delete comment.id;
            await this.createComment(comment);
        }else{
            dispatchAddCommentList(comment);
        }
        this.setState({
            comment: '',
            commentReply: '',
            commentBeingReplied: null
        });
    };

    createComment = async (comment) => {
        const { dispatchCreateComment, dispatchSwtShowMessage } = this.props;
        const request = {
            messageHeader: {
                "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            },
            messageBody: comment
        };
        const response = await dispatchCreateComment(request);
        if(_.get(response, 'payload.data.status') === REQUEST_SUCCESS){
            dispatchSwtShowMessage('success', COMMENT_CREATED_TITLE, COMMENT_CREATED_SUCCESS);
        }else{
            dispatchSwtShowMessage('success', COMMENT_CREATED_TITLE, COMMENT_CREATED_ERROR);
        }
    };

    /***************************************************************/

    renderCommentContent = (content) => {
        const regexInitialTag = new RegExp('@\\[', 'g');
        const regexEndTag = new RegExp('\\]\\([\\d]*\\)', 'g');
        content = _.replace(content, regexInitialTag, '<b>');
        content = _.replace(content, regexEndTag, '</b>');
        return (
            <div dangerouslySetInnerHTML={{__html: content}}/>
        )
    }

    renderComments = (comments) => {
        return comments.map(({ id, initials, author, createdTimestamp, content, replies }) =>
            <Comment key={id}>
                <CommentsAvatar>{initials}</CommentsAvatar>
                <Comment.Content>
                    <Comment.Author as='a'>{author}</Comment.Author>
                    <Comment.Metadata>
                        <div>{moment(new Date(createdTimestamp)).locale('es').fromNow()}</div>
                    </Comment.Metadata>
                    <Comment.Text className="commentText">{this.renderCommentContent(content)}</Comment.Text>
                    <Comment.Actions>
                        <Comment.Action onClick={() => this.replyCommentAction(id)}>Responder</Comment.Action>
                    </Comment.Actions>
                    <Form reply style={{ display: this.state.commentBeingReplied === id ? 'block' : 'none' }}>
                        <Row>
                            <Col xs={12} md={12} ld={12} className="commentTextArea">
                                <MentionsInput value={this.state.commentReply} onChange={event => this.handleChange(event, 'reply')} className="mentions">
                                    <Mention
                                        trigger="@"
                                        data={this.fetchUsers}
                                        className="mentions__mention"
                                    />
                                </MentionsInput>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col xs={12} md={12} ld={12}>
                                <button className="btn btn-primary" style={{ float: 'right' }} onClick={() => this.addComment(id, this.state.commentReply)}>Responder</button>
                            </Col>
                        </Row>
                    </Form>
                </Comment.Content>
                {replies &&
                    <Comment.Group threaded>
                        {this.renderComments(replies)}
                    </Comment.Group>
                }
            </Comment>
        );
    }

    render() {
        const { header, comments } = this.props;
        return (
            <div>
                <Comment.Group style={{ width: '100%', margin: 0, maxWidth: 'initial' }}>
                    {header &&
                        <Header as='p' dividing style={{ minHeight: 30 }}>
                            {header}
                        </Header>
                    }
                    <br></br>
                    {comments && comments.length ? this.renderComments(comments) :
                        <p style={{fontStyle: 'italic',
                            textAlign: 'center',
                            fontWeight: 600}}>Sin notas asociadas</p>
                    }
                    <Form reply>
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                                <MentionsInput value={this.state.comment} onChange={event => this.handleChange(event, 'new')} className="mentions" placeholder="Escribe aquí tu nota">
                                    <Mention
                                        trigger="@"
                                        data={this.fetchUsers}
                                        className="mentions__mention"
                                    />
                                </MentionsInput>
                            </Col>
                        </Row>
                        <Row style={{ margin: '10px 0 0 0' }}>
                            <Col xs={12} md={12} lg={12}>
                                <button className="btn btn-primary" style={{ float: 'right' }} onClick={() => this.addComment(null, this.state.comment)}>Agregar nota</button>
                            </Col>
                        </Row>
                    </Form>
                </Comment.Group>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        dispatchFilterUsers: filterUsersBanco,
        /*Funciones para pasar al TaskPage*/
        dispatchCreateComment: createComment,
        dispatchAddCommentList: addCommentToList,
        dispatchGetCommentsByTaskId: getCommentsByTaskId,
        dispatchClearComments: clearComments,
        dispatchSwtShowMessage: swtShowMessage
    }, dispatch);
}

function mapStateToProps({ commentsReducer: { comments } }) {
    return {
        comments
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentsComponent);



