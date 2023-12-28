const axios = require('axios');

class NetworkModel {
    mailcheck = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/network/');
            const data = response.data;

            return data;
        } catch (error) {
            console.error('Error fetching data from API:', error.message);
        }
    }
}

module.exports = new NetworkModel;
