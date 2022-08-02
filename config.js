const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl': 'mongodb://localhost:27017/conFusion',
    'facebook': {
        clientId: process.env.APP_ID,
        clientSecret: process.env.APP_SECRET_KEY
    }
}