const express = require('express');
const path = require('path');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const mongoose = require('mongoose');
const app = express();
const Port = process.env.PORT||8001;
const cookieParser = require('cookie-parser');
const { checkForAuth } = require('./middleware/authen');
const BLOG = require("./models/blog");


mongoose.connect(
    'mongodb://127.0.0.1:27017/blogging',
).then((e) => console.log('Connected to MongoDB'));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(checkForAuth('token'));
app.use('/images', express.static(path.resolve('./images')));
app.get("/", async(req, res) => {
    const allBlog =await BLOG.find({}).sort({createdAt: -1  });
    res.render('home',{
        user: req.user,
        blogs: allBlog,
    });
    })


app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.listen(
    Port,
    () => console.log(`Server running on port ${Port}`)
)