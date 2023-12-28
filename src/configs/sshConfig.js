// sshConfig.js
const dotenv = require('dotenv');
dotenv.config();

const sshConfig = {
    host: process.env.SSH_HOST || 'localhost',
    port: parseInt(process.env.SSH_PORT) || 22,
    username: process.env.SSH_USERNAME || 'ubuntu',
    password: process.env.SSH_PASSWORD || 'your_default_password',
};

module.exports = sshConfig;