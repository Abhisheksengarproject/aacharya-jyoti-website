const asyncHandler = require('express-async-handler');
const Blog = require('../models/Blog');

// @desc   Get all blogs
// @route  GET /api/blogs
const getBlogs = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 6 } = req.query;
  const filter = { isPublished: true };
  if (category && category !== 'All') filter.category = category;

  const total = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ blogs, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc   Get single blog by slug
// @route  GET /api/blogs/:slug
const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
});

// @desc   Create blog (admin)
// @route  POST /api/blogs
const createBlog = asyncHandler(async (req, res) => {
  const { title, content, excerpt, category, image, tags } = req.body;
  const blog = await Blog.create({ title, content, excerpt, category, image, tags });
  res.status(201).json(blog);
});

// @desc   Update blog (admin)
// @route  PUT /api/blogs/:id
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
});

// @desc   Delete blog (admin)
// @route  DELETE /api/blogs/:id
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json({ message: 'Blog deleted successfully' });
});

module.exports = { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };
