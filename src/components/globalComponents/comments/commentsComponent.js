import React, { Component } from 'react'
import { Comment, Form, Header } from 'semantic-ui-react'
import { Row } from 'react-flexbox-grid';
import Col from 'react-flexbox-grid/lib/components/Col';
import CommentsAvatar from './commentsAvatar';
import moment from 'moment';
import { MentionsInput, Mention } from 'react-mentions';

export class CommentsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commentBeingReplied: null,
            commentReply: '',
            comment: '',
            users: [
                {
                    id: 312312,
                    display: 'Daniel Gallego'
                },
                {
                    id: 4234123,
                    display: 'Monica Castillo'
                },
                {
                    id: 5245234,
                    display: 'Cristhian Rios'
                },
                {
                    id: 63456345,
                    display: 'Diego Romero'
                }
            ]
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
    }

    handleChange = (event) => {
        this.setState({ comment: event.target.value });
    }

    handleChangeReply = (event) => {
        this.setState({ commentReply: event.target.value });
    }

    renderComments = (comments) => {

        return comments.map(({ id, initials, autor, createdTimestamp, content, replies }) =>
            <Comment key={id}>
                <CommentsAvatar>{initials}</CommentsAvatar>
                <Comment.Content>
                    <Comment.Author as='a'>{autor}</Comment.Author>
                    <Comment.Metadata>
                        <div>{moment(new Date(createdTimestamp)).locale('es').fromNow()}</div>
                    </Comment.Metadata>
                    <Comment.Text>{content}</Comment.Text>
                    <Comment.Actions>
                        <Comment.Action onClick={() => this.replyCommentAction(id)}>Responder</Comment.Action>
                    </Comment.Actions>
                    <Form reply style={{ display: this.state.commentBeingReplied === id ? 'block' : 'none' }}>
                        <Row>
                            <Col xs={12} md={12} ld={12} className="commentTextArea">
                                <MentionsInput value={this.state.commentReply} onChange={this.handleChangeReply} className="mentions">
                                    <Mention
                                        trigger="@"
                                        data={this.state.users}
                                        className="mentions__mention"
                                    />
                                </MentionsInput>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col xs={12} md={12} ld={12}>
                                <button className="btn btn-primary" style={{ float: 'right' }}>Responder</button>
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
                <Comment.Group style={{ width: '100%', margin: 0, maxWidth: 'initial' }} threaded>
                    {header &&
                        <Header as='h3' dividing style={{ lineHeight: '3em' }}>
                            {header}
                        </Header>
                    }
                    {this.renderComments(comments)}
                    <Form reply>
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                                <MentionsInput value={this.state.comment} onChange={this.handleChange} className="mentions">
                                    <Mention
                                        trigger="@"
                                        data={this.state.users}
                                        className="mentions__mention"
                                    />
                                </MentionsInput>
                            </Col>
                        </Row>
                        <Row style={{ margin: '10px 0 0 0' }}>
                            <Col xs={12} md={12} lg={12}>
                                <button className="btn btn-primary" style={{ float: 'right' }}>Agregar nota</button>
                            </Col>
                        </Row>
                    </Form>
                </Comment.Group>
            </div>
        )
    }
}
