const {Router} = require('express');
const User = require('../models/user')
const router = Router();

router.get('/signin', (req, res) => {
    return res.render('signin');
});


router.get('/signup', (req, res) => {
    return res.render('signup');
});


router.post('/signup', async(req, res) => {
    const {fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password
    });
    return res.redirect('/');
});



router.post('/signin', async(req, res)=>{
   try{
    const {email, password} = req.body;
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token, {httpOnly: true}).redirect("/");
   }catch(error){
    return res.render('signin', {error: 'Invalid email or password'});
   }
});



router.get('/logout', async(req, res)=>{
   res.clearCookie("token").redirect("/");
});


router.get('/home', async(req, res)=>{
    res.redirect("/");
 });

module.exports = router;
