const {verify} = require("jsonwebtoken")

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    console.log(accessToken)

    if (!accessToken) {
        return res.status(401).json({error: "User not logged In"})
    }

    try{
        const validToken = verify(accessToken, "secret");

        req.user = validToken;

        if(validToken){
            return next();
        }

    } catch (err){
        return res.json({error: err});
    }

}

module.exports = {validateToken}