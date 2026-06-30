const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// CREATE POST
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text, tags } = req.body;

    const newPost = new Post({
      user: req.user._id,
      text,
      image: req.file ? req.file.path : '',
      tags: tags ? tags.split(',').map(t => t.trim()) : []
    });

    await newPost.save();
    await newPost.populate('user', 'username profilePicture');

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL POSTS (Feed)
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET TRENDING POSTS (most liked)
router.get('/trending', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username profilePicture')
      .sort({ likes: -1 })
      .limit(10);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET POSTS BY USER
router.get('/user/:id', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LIKE / UNLIKE POST
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id);
    } else {
      post.likes.push(req.user._id);

      if (post.user.toString() !== req.user._id) {
        await new Notification({
          recipient: post.user,
          sender: req.user._id,
          type: 'like',
          post: post._id
        }).save();
      }
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// COMMENT ON POST
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      user: req.user._id,
      text: req.body.text
    });

    await post.save();
    await post.populate('comments.user', 'username profilePicture');

    if (post.user.toString() !== req.user._id) {
      await new Notification({
        recipient: post.user,
        sender: req.user._id,
        type: 'comment',
        post: post._id
      }).save();
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE POST
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
