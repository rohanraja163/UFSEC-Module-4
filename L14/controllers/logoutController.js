const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}
const fsPromises = require('fs').promises
const path = require('path');

const handleLogout = async (req,res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    
    const refreshToken = cookies.jwt;
    const foundUser = usersDB.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt',{httpOnly: true});
        return res.sendStatus(204);
    }
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    usersDB.setUSers([...otherUsers,currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname,'..','model','users.json'),
        JSON.stringify(usersDB.users)
    );
    res.clearCookie('jwt', {httpOnly:true,sameSite:'None',secure:true});// secure: true
    res.sendStatus(204);
}   
        
module.exports = {handleLogout}