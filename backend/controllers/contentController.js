// controllers/contentController.js
const Story = require('../models/Story');
const Blog = require('../models/Blog');

// ==================== STORIES ====================
const getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createStory = async (req, res) => {
  try {
    const story = new Story({
      title: req.body.title,
      type: req.body.type || 'text',
      content: req.body.content,
      thumbnail: req.body.thumbnail || '',
      category: req.body.category || 'Weather Alert',
      author: req.admin?.name || 'Admin',
      createdBy: req.admin?._id
    });
    await story.save();
    res.status(201).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        type: req.body.type,
        content: req.body.content,
        thumbnail: req.body.thumbnail,
        category: req.body.category
      },
      { new: true, runValidators: true }
    );
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }
    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== BLOGS ====================
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      excerpt: req.body.excerpt || '',
      content: req.body.content,
      coverImage: req.body.coverImage || '',
      category: req.body.category || 'Climate Science',
      author: req.admin?.name || 'Admin',
      readTime: req.body.readTime || 5,
      createdBy: req.admin?._id
    });
    await blog.save();
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        coverImage: req.body.coverImage,
        category: req.body.category,
        readTime: req.body.readTime
      },
      { new: true, runValidators: true }
    );
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
};