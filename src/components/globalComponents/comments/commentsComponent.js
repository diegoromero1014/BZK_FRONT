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
import {addCommentToList, clearComments, getCommentsByReportId} from "./actions";
import _ from "lodash";
import {swtShowMessage} from "../../sweetAlertMessages/actions";
import {getUsernameInitials} from "../../../functions";
import TextArea from "../../../ui/textarea/textareaComponent";
import {ERROR_COMMENT_LENGTH} from "./constants";
import {
    patternOfForbiddenCharacter2,
    patternOfTaskObservation
} from "../../../validationsFields/patternsToValidateField";
import {
    MESSAGE_ERROR_INJECTION_HTML,
    MESSAGE_WARNING_FORBIDDEN_CHARACTER,
    MESSAGE_WARNING_TASK_OBSERVATIONS
} from "../../../validationsFields/validationsMessages";
import {validateHtmlInjection} from "../../../validationsFields/rulesField";

export class CommentsComponent extends Component {

    constructor(props) {
        super(props);
        this.onSearch$ = new Subject();
        this.users = [];
        this.state = {
            commentBeingReplied: null,
            commentReply: '',
            comment: '',
            showNewCommentError: null,
            showReplyCommentError: null
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
            await this.setState({ commentReply: comment });
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

    validateCommentContent = (content, source) => {
        if(!content.length){
            this.showContentError(content, source, ERROR_COMMENT_LENGTH);
            return false;
        }else {
            if (!content.match(patternOfTaskObservation)) {
                this.showContentError(content, source, MESSAGE_WARNING_TASK_OBSERVATIONS);
                return false;
            } else if (!content.match(patternOfForbiddenCharacter2)) {
                this.showContentError(content, source, MESSAGE_WARNING_FORBIDDEN_CHARACTER);
                return false;
            }else if(!validateHtmlInjection(content)){
                this.showContentError(content, source, MESSAGE_ERROR_INJECTION_HTML);
                return false;
            }else{
                this.showContentError(content, source);
                return true;
            }
        }
    };

    showContentError = (content, source, error) => {
        if(source === 'new')
            this.setState({ showNewCommentError: error });
        else
            this.setState({ showReplyCommentError: error });
    };

    addComment = async (e, parentCommentId, content, source) => {
        const { reportId, comments, dispatchAddCommentList } = this.props;
        const author = window.localStorage.getItem('name');
        const initials = getUsernameInitials(author);
        const parentComment = this.searchComment(comments, parentCommentId);
        const comment = {
            id: _.uniqueId('new'),
            reportId,
            content,
            parentCommentId: parentComment && parentComment.parentCommentId ? parentComment.parentCommentId : parentCommentId,
            initials,
            author,
            replies: [],
            createdTimestamp: moment(new Date())
        };

        if(this.validateCommentContent(content, source)){
            dispatchAddCommentList(comment);
            this.setState({
                comment: '',
                commentReply: '',
                commentBeingReplied: null
            });
        }
        e.preventDefault();
    };

    renderCommentContent = (content) => {
        const regexInitialTag = new RegExp('@\\[', 'g');
        const regexEndTag = new RegExp('\\]\\([\\d]*\\)', 'g');
        content = _.replace(content, regexInitialTag, '<b>');
        content = _.replace(content, regexEndTag, '</b>');
        return (
            <div dangerouslySetInnerHTML={{__html: content}}/>
        )
    };

    renderComments = (comments) => {
        const { showReplyCommentError } = this.state;
        const { disabled } = this.props;
        return comments.map(({ id, initials, author, createdTimestamp, content, replies }) =>
            <Comment key={id}>
                <CommentsAvatar>{initials}</CommentsAvatar>
                <Comment.Content>
                    <Comment.Author as='a'>{author}</Comment.Author>
                    <Comment.Metadata>
                        <div>{moment(new Date(createdTimestamp)).locale('es').fromNow()}</div>
                    </Comment.Metadata>
                    <Comment.Text className="commentText">{this.renderCommentContent(content)}</Comment.Text>
                    {!disabled &&
                        <Comment.Actions>
                            <Comment.Action onClick={() => this.replyCommentAction(id)}>Responder</Comment.Action>
                        </Comment.Actions>
                    }
                    <Form reply style={{ display: id && this.state.commentBeingReplied === id ? 'block' : 'none', paddingLeft: 60 }}>
                        <Row>
                            <Col xs={12} md={12} ld={12} className="commentTextArea">
                                {/*<MentionsInput value={this.state.commentReply} onChange={event => this.handleChange(event, 'reply')} className="mentions">
                                    <Mention
                                        trigger="@"
                                        data={this.fetchUsers}
                                        className="mentions__mention"
                                    />
                                </MentionsInput>*/}
                                <TextArea
                                    onChangeEvent={event => this.handleChange(event, 'reply')}
                                    nameInput="commentReply"
                                    value={this.state.commentReply}
                                    placeholder="Escribe tú respuesta"
                                    rows={7}
                                    max="340"
                                />
                                {showReplyCommentError &&
                                <div>
                                    <div className="ui pointing red basic label">
                                        {showReplyCommentError}
                                    </div>
                                </div>
                                }
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col xs={12} md={12} ld={12}>
                                <button className="btn btn-primary" style={{ float: 'right' }} onClick={e => this.addComment(e, id, this.state.commentReply, 'reply')}>Responder</button>
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
    };

    render() {
        const { header, comments, disabled } = this.props;
        const { showNewCommentError } = this.state;
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
                                {/*<MentionsInput value={this.state.comment} onChange={event => this.handleChange(event, 'new')} className="mentions" placeholder="Escribe aquí tu nota">
                                    <Mention
                                        trigger="@"
                                        data={this.fetchUsers}
                                        className="mentions__mention"
                                    />
                                </MentionsInput>*/}
                                <TextArea
                                    disabled={disabled && 'disabled'}
                                    onChangeEvent={event => this.handleChange(event, 'new')}
                                    nameInput="comment"
                                    value={this.state.comment}
                                    placeholder="Escribe tú nota"
                                    rows={7}
                                    max="340"
                                />
                                {showNewCommentError &&
                                <div>
                                    <div className="ui pointing red basic label">
                                        {showNewCommentError}
                                    </div>
                                </div>
                                }
                            </Col>
                        </Row>
                        <Row style={{ margin: '10px 0 0 0' }}>
                            <Col xs={12} md={12} lg={12}>
                                <button className="btn btn-primary" style={{ float: 'right' }} onClick={e => this.addComment(e,null, this.state.comment, 'new')}
                                        disabled={disabled && 'disabled'}>Agregar nota</button>
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
        dispatchAddCommentList: addCommentToList,
        dispatchGetCommentsByreportId: getCommentsByReportId,
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



