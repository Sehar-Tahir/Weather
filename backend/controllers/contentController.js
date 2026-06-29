// ============================================================
// WEATHERVERSE — Content Controller
// ============================================================

const Story = require('../models/Story');
const Blog = require('../models/Blog');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// ==================== STORIES ====================

// ── Get all stories ────────────────────────────────────────
const getStories = async (req, res, next) => {
  try {
    const { limit = 20, page = 1, category } = req.query;
    const skip = (page - 1) * limit;

    const filter = { isPublished: true };
    if (category) filter.category = category;

    const stories = await Story.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Story.countDocuments(filter);

    res.json({
      success: true,
      data: stories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get single story ───────────────────────────────────────
const getStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return next(new AppError('Story not found', 404));
    }
    res.json({ success: true, data: story });
  } catch (error) {
    next(error);
  }
};

// ── Create story ──────────────────────────────────────────
const createStory = async (req, res, next) => {
  try {
    const story = new Story({
      title: req.body.title,
      type: req.body.type || 'text',
      content: req.body.content,
      thumbnail: req.body.thumbnail || '',
      thumbnailPublicId: req.body.thumbnailPublicId || '',
      category: req.body.category || 'Weather Alert',
      author: req.admin?.name || 'Admin',
      createdBy: req.admin?._id,
      isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
    });

    await story.save();

    logger.info(`Story created: ${story.title} by ${req.admin?.email}`);

    res.status(201).json({ success: true, data: story });
  } catch (error) {
    next(error);
  }
};

// ── Update story ──────────────────────────────────────────
const updateStory = async (req, res, next) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        type: req.body.type,
        content: req.body.content,
        thumbnail: req.body.thumbnail,
        thumbnailPublicId: req.body.thumbnailPublicId,
        category: req.body.category,
        isPublished: req.body.isPublished,
      },
      { new: true, runValidators: true }
    );

    if (!story) {
      return next(new AppError('Story not found', 404));
    }

    logger.info(`Story updated: ${story.title} by ${req.admin?.email}`);

    res.json({ success: true, data: story });
  } catch (error) {
    next(error);
  }
};

// ── Delete story ──────────────────────────────────────────
const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) {
      return next(new AppError('Story not found', 404));
    }

    logger.info(`Story deleted: ${story.title} by ${req.admin?.email}`);

    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== BLOGS ====================

// ── Get all blogs ──────────────────────────────────────────
const getBlogs = async (req, res, next) => {
  try {
    const { limit = 20, page = 1, category } = req.query;
    const skip = (page - 1) * limit;

    const filter = { isPublished: true };
    if (category) filter.category = category;

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Blog.countDocuments(filter);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get single blog ────────────────────────────────────────
const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// ── Create blog ────────────────────────────────────────────
const createBlog = async (req, res, next) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      excerpt: req.body.excerpt || '',
      content: req.body.content,
      coverImage: req.body.coverImage || '',
      coverImagePublicId: req.body.coverImagePublicId || '',
      category: req.body.category || 'Climate Science',
      author: req.admin?.name || 'Admin',
      readTime: req.body.readTime || 5,
      createdBy: req.admin?._id,
      isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
    });

    await blog.save();

    logger.info(`Blog created: ${blog.title} by ${req.admin?.email}`);

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// ── Update blog ────────────────────────────────────────────
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        coverImage: req.body.coverImage,
        coverImagePublicId: req.body.coverImagePublicId,
        category: req.body.category,
        readTime: req.body.readTime,
        isPublished: req.body.isPublished,
      },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    logger.info(`Blog updated: ${blog.title} by ${req.admin?.email}`);

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// ── Delete blog ────────────────────────────────────────────
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    logger.info(`Blog deleted: ${blog.title} by ${req.admin?.email}`);

    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
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
  deleteBlog,
};