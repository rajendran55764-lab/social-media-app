import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePost = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (image) formData.append('image', image);
      if (tags) formData.append('tags', tags);

      const res = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPosts([res.data, ...posts]);
      setText('');
      setImage(null);
      setTags('');
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">

        {/* Create Post Box */}
        <div className="create-post">
          <div className="create-post-header">
            <img
              src={user?.profilePicture || '/default-avatar.png'}
              alt="avatar"
              className="create-avatar"
            />
            <textarea
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="3"
            />
          </div>
          <div className="create-post-footer">
            <input
              type="text"
              placeholder="Add tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="tags-input"
            />
            <label className="image-upload-label">
              📷 Photo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </label>
            <button onClick={handlePost} disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
          {image && (
            <p className="image-selected">✅ Image selected: {image.name}</p>
          )}
        </div>

        {/* Posts Feed */}
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet. Be the first to post!</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
