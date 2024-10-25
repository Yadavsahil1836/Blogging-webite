const {Router} = require('express');
const multer = require('multer');
const path = require('path');
const router = Router();
const BLOG = require('../models/blog');
const COMMENT = require('../models/comment');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/upload/');
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});

  
const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
  res.render('addblog',{
    user: req.user
  })
});




router.get('/:id', async (req, res) => {
  try {
    const blog = await BLOG.findById(req.params.id).populate('createdBy');  
    const comment = await COMMENT.find({ blogId: req.params.id }).populate('createdBy');
    return res.render('blog', {
      user: req.user,
      blog: blog,
      comments: comment
    });
      ``
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});





router.post('/comment/:blogId', async (req, res) => {
  await COMMENT.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post('/', upload.single('coverImage'), async (req, res) => {
  try {
    const { title, body } = req.body;
    const blog = await BLOG.create({
      body,
      title,
      coverImageUrl: `/images/upload/${req.file.filename}`,  // Use coverImageUrl here
      createdBy: req.user._id,
    });
    res.redirect(`/blogs/${blog._id}`);
  } catch (err) {
    console.error('Error while creating blog:', err);
    res.status(500).send('An error occurred while saving the blog post');
  }
});



module.exports = router;