const https = require("https");

class WebModel {
    check = async (webList) => {
        // webList = [{url, status, errorCount, },...]
        // hardCoding List is harborUrl and ElasticSearchURL on FEMS Server
        
        var results = await Promise.all(
            webList.map((list) => {
              return new Promise((resolve, reject) => {
                let body = {
                    name: list.name,
                    url: list.url,
                    status: "",
                };
                https
                  .get(list.url, (res) => {
                    res.setEncoding("utf8");
                    res.on("data", () => (body.status = "ok"));
                    res.on("end", () => resolve(body));
                  })
                  .on("error", (err) => {
                    body.status = "error"
                    resolve(body);
                  });
              });
            })
          );

        return results
    }

    mailCheck = async (webList) => {
      // webList = [{url, status, errorCount, },...]
      // hardCoding List is harborUrl and ElasticSearchURL on FEMS Server
      var results = await Promise.all(
          webList.map((list) => {
            return new Promise((resolve, reject) => {
              let body = {
                name: list.name,
                status: "",
              };
              https
                .get(list.url, (res) => {
                  res.setEncoding("utf8");
                  res.on("data", () => (body.status = "ok"));
                  res.on("end", () => resolve(body));
                })
                .on("error", (err) => {

                  body.status = "error"
                  resolve(body);
                });
            });
          })
        );

      return results
    }

}

module.exports = new WebModel;
