const fs = require('fs').promises;
const yaml = require('js-yaml');
const maillingModel = require('../models/maillingModel')
const webModel = require('../models/webModel');
const serviceModel = require('../models/serviceModel');
const networkModel = require('../models/networkModel');
const dotenv = require('dotenv');

dotenv.config();

class mailling {
    constructor() {
        this.dataArray = null;
        this.parsedData = null;
        this.webdataList = null;
        this.servicedataList = null;
        this.networkdataList = null
    }

    readFileAndInitialize = async () => {
        const filePath = 'src/configs/check.yaml';
        const data = await fs.readFile(filePath, 'utf8');
        this.parsedData = yaml.load(data);
        this.dataArray = Array.isArray(this.parsedData) ? this.parsedData : [this.parsedData];
        this.webdataList = await this.dataArray[0].web.map((type) => {
            type.errorCount = 0;
            type.sendmailStatus = false;
            return type;
        });

        this.servicedataList = await this.dataArray[0].service.map((type) => {
            type.errorCount = 0;
            type.sendmailStatus = false;
            return type;
        });

        this.networkdataList = await this.dataArray[0].network.map((type) => {
            type.errorCount = 0;
            type.sendmailStatus = false;
            return type;
        });
    };

    webCheckAndMailling = async () => {
        console.log(this.webdataList);
        let webCheckData = await webModel.mailCheck(this.dataArray[0].web);
        await webCheckData.map((data) => {
            if(data.status === "error"){
                this.webdataList.map((data2) => {
                    if(data2.name === data.name) return data2.errorCount+=1;
                })
            }
        })
        
        await this.webdataList.map((data) =>{
            if(data.errorCount === 3 & data.sendmailStatus === false){
                maillingModel.mailling(data.name+" web error 발생\n"+"신속한 조치 필요!! 담당 엔지니어 : 최기엽 연구원")
                return data.sendmailStatus=true;
            }
        })

        console.log(this.webdataList);
    }
}

module.exports = new mailling();