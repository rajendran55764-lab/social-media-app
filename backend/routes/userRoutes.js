const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// GET ALL USERS
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password')
      .limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET USER NOTIFICATIONS
router.get('/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'username profilePicture')
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE USER PROFILE
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FOLLOW / UNFOLLOW USER
router.put('/:id/follow', auth, async (req, res) => {
  try {
    if (req.params.id === req.user._id) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) return res.status(404).json({ message: 'User not found' });

    const isFollowing = userToFollow.followers.includes(req.user._id);

    if (isFollowing) {
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user._id
      );
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.id
      );
    } else {
      userToFollow.followers.push(req.user._id);
      currentUser.following.push(req.params.id);

      await new Notification({
        recipient: userToFollow._id,
        sender: req.user._id,
        type: 'follow'
      }).save();
    }

    await userToFollow.save();
    await currentUser.save();

    res.json({ message: isFollowing ? 'Unfollowed' : 'Followed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
