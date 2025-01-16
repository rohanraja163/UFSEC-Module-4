const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req,res) => {
    if (!user || pwd) return res.status(400).json({'message': 'Username and password are required'});
    const foundUser = await User.findOne({username: user}).exec();
    if (!foundUser) return res.sendStatus(401);
    const match = await bcrypt.compare(pwd,foundUser.password);
    if (match){
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                "Userinfo":{
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIN: '30s'}
    );
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIN: '1d'}
        );
        foundUser.refreshToken - refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt',refreshToken,{httpOnly: true,maxAge: 24*60*60*1000,sameSite:'None',secure:true});
        
        res.json({acessToken});
    } else{
        res.sendStatus(401);
    }
}
module.exports = {handleLogin};