import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/users/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const getMessage = (notif) => {
    switch (notif.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      default:
        return 'interacted with you';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      default: return '🔔';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="notif-container">
      <Navbar />
      <div className="notif-content">
        <h2 className="notif-title">Notifications</h2>

        {notifications.length === 0 ? (
          <p className="no-notif">No notifications yet!</p>
        ) : (
          notifications.map((notif) => (
            <Link
              to={`/profile/${notif.sender?._id}`}
              key={notif._id}
              className="notif-item"
            >
              <img
                src={notif.sender?.profilePicture || '/default-avatar.png'}
                alt="avatar"
              />
              <div className="notif-text">
                <p>
                  <strong>{notif.sender?.username}</strong>{' '}
                  {getMessage(notif)}
                </p>
                <span>{new Date(notif.createdAt).toLocaleString()}</span>
              </div>
              <span className="notif-icon">{getIcon(notif.type)}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
