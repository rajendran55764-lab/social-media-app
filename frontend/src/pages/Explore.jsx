import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import './Explore.css';

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExploreData();
  }, []);

  const fetchExploreData = async () => {
    try {
      const usersRes = await API.get('/users');
      setUsers(usersRes.data);

      const postsRes = await API.get('/posts/trending');
      setTrendingPosts(postsRes.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="explore-container">
      <Navbar />
      <div className="explore-content">

        <h2 className="section-title">🔥 Trending Posts</h2>
        <div className="trending-grid">
          {trendingPosts.length === 0 ? (
            <p className="no-data">No trending posts yet!</p>
          ) : (
            trendingPosts.map((post) => (
              <div key={post._id} className="trending-card">
                {post.image && <img src={post.image} alt="post" />}
                <p>{post.text}</p>
                <span>❤️ {post.likes?.length || 0} likes</span>
              </div>
            ))
          )}
        </div>

        <h2 className="section-title">👥 Suggested Users</h2>
        <div className="users-grid">
          {users.map((u) => (
            <Link to={`/profile/${u._id}`} key={u._id} className="user-card">
              <img
                src={u.profilePicture || '/default-avatar.png'}
                alt="avatar"
              />
              <h4>{u.username}</h4>
              <p>{u.followers?.length || 0} followers</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
