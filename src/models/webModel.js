const { multipleColumnSet } = require('../utils/common.utils');
const exec = require('child_process').exec;
const https = require("https");

class WebModel {
    find = async () => {
        await exec('curl registry.fesm.cf', (err,out,stderr) => {
            console.log(out);
            
            return out;
        })
    }

    check = async (webList) => {
        // webList = [{url, status, errorCount, },...]
        // hardCoding List is harborUrl and ElasticSearchURL on FEMS Server
        
        var results = await Promise.all(
            webList.map((list) => {
              return new Promise((resolve, reject) => {
                https
                  .get(list.url, (res) => {
                    res.setEncoding("utf8");
                    let body = "";
      
                    res.on("data", (data) => (body += data));
                    res.on("end", () => resolve(JSON.parse(body)));
                  })
                  .on("error", (err) => reject(err));
              });
            })
          );

        return results
    }

}

module.exports = new WebModel;

