const { verifyToken } = require("../services/authen");

function checkForAuth(cookieName){
    return (req, res, next)=>{
        const tokenCookievalue = req.cookies[cookieName]
        if(!tokenCookievalue){
            return next();
        }
        try{
            const userPaylaod = verifyToken(tokenCookievalue);
            req.user = userPaylaod;
            
        }catch(error){}
        return next();
}
}


module.exports = { checkForAuth }; 