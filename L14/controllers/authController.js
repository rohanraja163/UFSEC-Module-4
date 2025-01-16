const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req,res) => {
    if (!user || pwd) return res.status(400).json({'message': 'Username and password are required'});
    const foundUser = usersDB.find(person => person.username === user);
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
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUSer = {...foundUser, refreshToken};
        usersDB.setUsers([...otherUsers,currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname,'..','model','users.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie('jwt',refreshToken,{httpOnly: true,maxAge: 24*60*60*1000,sameSite:'None',secure:true});
        
        res.json({acessToken});
    } else{
        res.sendStatus(401);
    }
}
module.exports = {handleLogin};