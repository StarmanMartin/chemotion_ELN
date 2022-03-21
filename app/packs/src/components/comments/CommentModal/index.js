import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, FormControl, Modal, Table } from 'react-bootstrap';
import { Confirm } from 'react-confirm-bootstrap';
import Draggable from 'react-draggable';
import CommentFetcher from '../../fetchers/CommentFetcher';
import LoadingActions from '../../actions/LoadingActions';
import UserStore from '../../stores/UserStore';


export default class CommentModal extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      commentBody: '',
      isEditing: false,
      commentObj: '',
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  handleInputChange = (e) => {
    this.setState({ commentBody: e.target.value });
    if (e.target.value.length === 0) {
      this.setState({
        commentObj: '',
        isEditing: false,
      });
    }
  }

  markCommentResolved = (comment) => {
    const { element } = this.props;
    const params = {
      content: comment.content,
      status: 'Resolved',
    };
    CommentFetcher.updateComment(comment, params)
      .then(() => {
        this.props.fetchComments(element);
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  };

  saveComment = () => {
    LoadingActions.start();
    const { element, section } = this.props;
    const { commentBody } = this.state;
    const params = {
      content: commentBody,
      commentable_id: element.id,
      commentable_type: element.type,
      section,
    };
    CommentFetcher.create(params)
      .then(() => {
        this.props.fetchComments(element);
        this.setState({ commentBody: '' }, () => {
          LoadingActions.stop();
        });
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  updateComment = () => {
    LoadingActions.start();
    const { commentBody } = this.state;
    const { element } = this.props;
    const comment = this.state.commentObj;
    const params = {
      content: commentBody,
    };
    CommentFetcher.updateComment(comment, params)
      .then(() => {
        this.props.fetchComments(element);
        this.setState({ commentBody: '' }, () => {
          LoadingActions.stop();
        });
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  deleteComment = (comment) => {
    const { element } = this.props;
    CommentFetcher.delete(comment)
      .then(() => {
        this.props.fetchComments(element);
        this.setState({ commentBody: '' });
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
  };

  handleEditComment = (comment) => {
    this.setState({
      commentBody: comment.content,
      commentObj: comment,
      isEditing: true
    });
    this.commentInput.focus();
  }

  disableEditComment = comment => comment.status === 'Resolved'
  commentByCurrentUser = (comment, currentUser) => currentUser.id === comment.created_by

  render() {
    const { showCommentModal, section } = this.props;
    const { isEditing } = this.state;
    const comments = this.props.getSectionComments(section);
    const { currentUser } = UserStore.getState();

    let commentsTbl = null;
    if (comments && comments.length > 0) {
      commentsTbl = comments.map(comment => (
        <tr key={comment.id}>
          <td style={{ width: '15%' }}>{comment.created_at}</td>
          <td style={{ width: '40%' }}>{comment.content}</td>
          <td style={{ width: '15%' }}>{comment.submitter}</td>
          <td style={{ width: '15%' }}>
            <ButtonToolbar>
              <Button
                disabled={this.disableEditComment(comment)}
                onClick={() => this.markCommentResolved(comment)}
              >
                {comment.status === 'Resolved' ? 'Resolved' : 'Resolve'}
              </Button>
              {
                this.commentByCurrentUser(comment, currentUser) &&
                <Button
                  id="editCommentBtn"
                  bsSize="xsmall"
                  bsStyle="primary"
                  onClick={() => this.handleEditComment(comment)}
                  disabled={this.disableEditComment(comment)}
                >
                  <i className="fa fa-edit" />
                </Button>
              }
              {
                this.commentByCurrentUser(comment, currentUser) &&
                <Confirm
                  onConfirm={() => this.deleteComment(comment)}
                  body="Are you sure you want to delete this?"
                  confirmText="Confirm Delete"
                  title="Deleting Comment"
                  showCancelButton
                >
                  <Button
                    id="deleteCommentBtn"
                    bsStyle="danger"
                    bsSize="xsmall"
                    onClick={() => this.deleteComment(comment)}
                  >
                    <i className="fa fa-trash-o" />
                  </Button>
                </Confirm>
              }
            </ButtonToolbar>
          </td>
        </tr>
      ));
    }

    const defaultAttrs = {
      style: {
        height: '100px',
        overflow: 'auto',
        whiteSpace: 'pre',
        marginBottom: '20px',
      },
    };

    return (
      <Draggable>
        <Modal
          show={showCommentModal}
          onHide={() => this.props.toggleCommentModal(false)}
          bsSize="large"
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Comments</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th width="20%">Date</th>
                    <th width="40%">Comment</th>
                    <th width="15%">From User</th>
                    <th width="17%">Actions</th>
                  </tr>
                </thead>
                <tbody>{commentsTbl}</tbody>
              </Table>
            </div>
            <FormControl
              componentClass="textarea"
              autoFocus
              {...defaultAttrs}
              value={this.state.commentBody}
              ref={(input) => { this.nameInput = input; }}
              inputRef={(m) => {
                this.commentInput = m;
              }}
              onChange={this.handleInputChange}
            />
            <ButtonToolbar>
              <Button onClick={() => this.props.toggleCommentModal(false)}>
                Close
              </Button>
              <Button
                bsStyle="primary"
                disabled={!this.state.commentBody}
                onClick={() => {
                  if (isEditing) {
                    this.updateComment();
                  } else {
                    this.saveComment();
                  }
                }}
              >
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </ButtonToolbar>
          </Modal.Body>
        </Modal>
      </Draggable>
    );
  }
}

CommentModal.propTypes = {
  showCommentModal: PropTypes.bool.isRequired,
  toggleCommentModal: PropTypes.func.isRequired,
  comments: PropTypes.array,
  fetchComments: PropTypes.func.isRequired,
  getSectionComments: PropTypes.func.isRequired,
  section: PropTypes.string,
  element: PropTypes.object.isRequired,
};

CommentModal.defaultProps = {
  comments: [],
  section: 'sample_header',
};