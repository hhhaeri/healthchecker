const { multipleColumnSet } = require('../utils/common.utils');
const exec = require('child_process').exec;
const request = require('request');

class WebModel {
    find = async () => {
        await exec('curl registry.fesm.cf', (err,out,stderr) => {
            console.log(out);
            
            return out;
        })
    }

    find2 = async () => {
        var headers = {
            'Content-Type': 'application/json'
        };
         
        var options = {
            url: 'http://registry.fems.cf',
            method: 'GET',
            headers: headers,
        };
         
        await function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
		return body
            }
        }
         
        request(options, callback);
    }

}

module.exports = new WebModel;

