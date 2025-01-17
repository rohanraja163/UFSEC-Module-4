const whitelist =  [
    'https://127.0.0.1:5500',
    'https://localhost:3500', 
    'https://www.google.com'
];
const corsOptions = {
    origin: (origin,callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin){
            callback(null,true);
        }else{
            callback(new Error('Not allowed'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;
