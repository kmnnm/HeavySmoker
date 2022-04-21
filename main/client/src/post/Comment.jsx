import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import Picker from "emoji-picker-react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { timeDifference } from "./timeDifference";

import Loading from "../loading/Loading";

import "../css/Comment.css";

class Comment extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      error: "",
      chosenEmoji: null,
      showPicker: false,
      loading: false,
    };
  }

  handleChange = (e) => {
    this.setState({ text: e.target.value, error: "" });
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0) {
      this.setState({
        error: "에러다 다시쳐라",
      });
      return false;
    }
    if (text.length > 150) {
      this.setState({
        error: "150자 이내로 요약해라",
      });
      return false;
    }
    return true;
  };

  addComment = (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      this.setState({
        error: "비회원 안받아요 ㅈㅅ",
      });
      return false;
    }
    if (this.isValid()) {
      this.setState({ loading: true });
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;
      const commentText = { text: this.state.text };

      comment(userId, token, postId, commentText).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({
            text: "",
            showPicker: false,
            loading: false,
          });
          this.props.updateComments(data.comments);
        }
      });
    }
  };

  deleteComment = (comment) => {
    this.setState({ loading: true });
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ loading: false });
        this.props.updateComments(data.comments);
      }
    });
  };

  deleteConfirmed = (comment) => {
    confirmAlert({
      title: "실화냐?",
      message: "지운다? 복구안되?",
      buttons: [
        {
          label: "응지워",
          onClick: () => this.deleteComment(comment),
        },
        {
          label: "아 잘못눌렀어",
        },
      ],
    });
  };

  onEmojiClick = (event, emojiObject) => {
    let comment = this.state.text;
    comment = comment + emojiObject.emoji;
    this.setState({
      chosenEmoji: emojiObject,
      text: comment,
    });
  };

  render() {
    const { text, error, showPicker, loading } = this.state;
    const { comments } = this.props;

    return (
      <diV>
        {loading ? (
          <Loading />
        ) : (
          <div>
            <h4 className="mt-5 mb-5">
              댓글을 입력해주세요{" "}
              <span className="pull-right">{comments.length} comments</span>
            </h4>
            <div className="panel-body">
              <form onSubmit={this.addComment}>
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    onChange={this.handleChange}
                    value={text}
                    placeholder="댓글을 입력해주세요..."
                  />
                  <div>
                    <button
                      type="button"
                      onClick={() => this.setState({ showPicker: !showPicker })}
                      className="btn btn-sm btn-primary"
                    >
                      <i
                        style={{ fontSize: "20px" }}
                        className="far fa-smile"
                      ></i>
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-raised btn-sm btn-info pull-right mt-3 mb-3"
                >
                  댓글 입력
                </button>
              </form>
              {showPicker ? <Picker onEmojiClick={this.onEmojiClick} /> : ""}
              <div
                className="alert alert-danger mt-5"
                style={{ display: error ? "" : "none" }}
              >
                {error}
              </div>

              <br />
              <div className="clearfix"></div>
              <hr />
              <ul className="media-list">
                {comments.reverse().map((comment, i) => (
                  <li key={i} className="media">
                    <Link to={`/user/${comment.postedBy._id}`}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                        onError={(i) => (i.target.src = DefaultProfile)}
                        alt={comment.postedBy.name}
                        className="rounded-circle z-depth-2 mr-2"
                      />
                    </Link>
                    <div className="media-body">
                      <span className="text-muted pull-right">
                        <small className="text-muted">
                          <i className="far fa-clock"></i>
                          {" " +
                            timeDifference(
                              new Date(),
                              new Date(comment.created)
                            )}
                        </small>
                        <br />
                        <span>
                          {isAuthenticated().user &&
                            isAuthenticated().user._id ===
                              comment.postedBy._id && (
                              <>
                                <span
                                  onClick={() => this.deleteConfirmed(comment)}
                                  className="text-danger float-right mr-2 mt-2 "
                                  style={{ cursor: "pointer" }}
                                >
                                  <i className="fas fa-trash"></i>
                                </span>
                              </>
                            )}
                        </span>
                      </span>
                      <Link to={`/user/${comment.postedBy._id}`}>
                        <strong className="text-success">
                          {comment.postedBy.name}
                        </strong>
                      </Link>
                      <p style={{ color: "black" }}>{comment.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </diV>
    );
  }
}

export default Comment;
