const jwt = require('jsonwebtoken');
const secret = 'testbloggingsecret';


function generateToken(user) {
  const paylaod = {
    _id: user._id,
    email: user.email,
    profilepic: user.profilepic,
    role: user.role
  }
  const token = jwt.sign(paylaod, secret, { expiresIn: '1d' });
  return token;

};



function verifyToken(token) {
    const paylaod = jwt.verify(token, secret);
    return paylaod;
};



module.exports = {
  generateToken,
  verifyToken
};