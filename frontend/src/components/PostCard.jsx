import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './PostCard.css';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);

  const isLiked = likes.includes(user?._id);

  const handleLike = async () => {
    try {
      const res = await API.put(`/posts/${post._id}/like`);
      setLikes(res.data.likes);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await API.post(`/posts/${post._id}/comment`, { text: comment });
      setComments(res.data.comments);
      setComment('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <Link to={`/profile/${post.user?._id}`}>
          <img
            src={post.user?.profilePicture || '/default-avatar.png'}
            alt="avatar"
            className="post-avatar"
          />
        </Link>
        <div className="post-user-info">
          <Link to={`/profile/${post.user?._id}`}>
            <h4>{post.user?.username}</h4>
          </Link>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        {user?._id === post.user?._id && (
          <button onClick={handleDelete} className="delete-btn">🗑️</button>
        )}
      </div>

      {/* Post Content */}
      <p className="post-text">{post.text}</p>

      {/* Post Image */}
      {post.image && (
        <img src={post.image} alt="post" className="post-image" />
      )}

      {/* Post Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag, i) => (
            <span key={i} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="post-actions">
        <button
          onClick={handleLike}
          className={`like-btn ${isLiked ? 'liked' : ''}`}
        >
          {isLiked ? '❤️' : '🤍'} {likes.length}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="comment-btn"
        >
          💬 {comments.length}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          {comments.map((c, i) => (
            <div key={i} className="comment">
              <strong>{c.user?.username}: </strong>
              <span>{c.text}</span>
            </div>
          ))}
          <div className="comment-input">
            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleComment}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
