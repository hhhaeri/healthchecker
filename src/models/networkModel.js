const axios = require('axios');
const ping = require('ping');
const isReachable = require('is-reachable');

class NetworkModel {
    check = async (networkList) => {
        // console.log(networkList)
        const results = await Promise.all(
            networkList.map((list) => {
                return new Promise(async (resolve, reject) => {
                    let template = {
                        name: list.name,
                        status: "",
                        ip: list.ip
                    };
                    if(list.port === undefined){
                        ping.promise.probe(list.ip)
                        .then((res) => {
                            res.alive === true ? template.status = "ok" : template.status = "error";
                            resolve(template)
                        });
                    } 
                    else{
                        template.port = list.port;
                        await isReachable(list.ip+":"+list.port) === true ? template.status = "ok" : template.status = "error";        
                        resolve(template)
                    }
                })
            })
        );

        return results
    }

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
