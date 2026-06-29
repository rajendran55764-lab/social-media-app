import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/users/${id}`);
      setProfile(res.data);
      setIsFollowing(res.data.followers?.includes(user?._id));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const fetchUserPosts = async () => {
    try {
      const res = await API.get(`/posts/user/${id}`);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async () => {
    try {
      await API.put(`/users/${id}/follow`);
      setIsFollowing(!isFollowing);
      setProfile((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((f) => f !== user?._id)
          : [...prev.followers, user?._id]
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">

        {/* Profile Header */}
        <div className="profile-header">
          <img
            src={profile?.profilePicture || '/default-avatar.png'}
            alt="avatar"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2>{profile?.username}</h2>
            <p>{profile?.bio || 'No bio yet'}</p>
            <div className="profile-stats">
              <span><strong>{posts.length}</strong> Posts</span>
              <span><strong>{profile?.followers?.length || 0}</strong> Followers</span>
              <span><strong>{profile?.following?.length || 0}</strong> Following</span>
            </div>
            {user?._id !== id && (
              <button
                onClick={handleFollow}
                className={`follow-btn ${isFollowing ? 'following' : ''}`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* User Posts */}
        <h3 className="posts-title">Posts</h3>
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet!</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
