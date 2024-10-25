const {Schema, model} = require('mongoose');
const { createHmac,randomBytes } = require('crypto');
const {generateToken} = require('../services/authen');
const userSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String
    },
    password:{
        type: String,
        required: true
    },
    profilepic:{
        type: String,
        default: "/images/profile.png",
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
},{timestamps: true});


userSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified("password")) return next();

    const salt = randomBytes(16).toString('hex') ;
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');
    this.salt = salt;
    this.password = hashedPassword;
    next();
 
});


userSchema.static('matchPasswordAndGenerateToken', async function(email, password) {
    const user =await this.findOne({email});
    if(!user)throw new Error('User not found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvided = createHmac('sha256', salt).update(password).digest('hex');

    // return hashedPassword === userProvided;

    if(hashedPassword !== userProvided) throw new Error('Invalid password');


    const token = generateToken(user);
    return token;
    
});

const User = model('User', userSchema);

module.exports = User;
