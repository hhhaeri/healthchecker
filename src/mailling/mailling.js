const fs = require('fs').promises;
const yaml = require('js-yaml');
const maillingModel = require('../models/maillingModel')
const webModel = require('../models/webModel');
const serviceModel = require('../models/serviceModel');
const networkModel = require('../models/networkModel');

//Controller 임시 대응
const serviceController = require('../controllers/serviceController');
const networkController = require('../controllers/networkController');

const dotenv = require('dotenv');

dotenv.config();

class mailling {
    constructor() {
        this.dataArray = null;
        this.parsedData = null;
        this.webdataList = null;
        this.servicedataList = null;
        this.networkdataList = null;
    }

    readFileAndInitialize = async () => {
        const filePath = 'src/configs/check.yaml';
        const data = await fs.readFile(filePath, 'utf8');
        this.parsedData = yaml.load(data);
        this.dataArray = Array.isArray(this.parsedData) ? this.parsedData : [this.parsedData];

        // web, service, network initialize 
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
        let webCheckData = await webModel.mailCheck(this.dataArray[0].web);
        await webCheckData.map((data) => {
            if(data.status === "error"){
                this.webdataList.map((data2) => {
                    if(data2.name === data.name) return data2.errorCount+=1;
                })
            }
        })
        
        await this.webdataList.map((data) => {
            if(data.errorCount === 3 & data.sendmailStatus === false){
                maillingModel.mailling("web error 발생",data.name+" web error 발생\n"+"신속한 조치 필요!! 담당 엔지니어 : 최기엽 연구원")
                return data.sendmailStatus=true;
            }
        })
    }

    // service, network 메일링 개발 진행중
    // serviceCheckAndMailling = async () => {
    //     console.log(this.dataArray[0].service)
    //     const serviceList = await this.dataArray[0].service.map(item => ({
    //         name: item.name,
    //         command: `systemctl status ${item.name}`
    //     }));

    //     let serviceCheckData = await serviceController.mailcheck(serviceList);
    //     await setTimeout(async () => {
    //         await serviceCheckData.map((data) => {
    //             if(data.status === "error"){
    //                 this.servicedataList.map((data2) => {
    //                     if(data2.name === data.name) return data2.errorCount+=1;
    //                 })
    //             }
    //         })
            
    //         await this.servicedataList.map((data) => {
    //             if(data.errorCount === 3 & data.sendmailStatus === false){
    //                 maillingModel.mailling("service error 발생",data.name+" service  error 발생\n"+"신속한 조치 필요!! 담당 엔지니어 : 최기엽 연구원")
    //                 return data.sendmailStatus=true;
    //             }
    //         })
    //         console.log(this.servicedataList)
    //     }, 5000)
    // }

    // networkCheckAndMailling = async () => {
    //     let networkCheckData = await networkController.mailCheck(this.dataArray[0].network);
    //     await networkCheckData.map((data) => {
    //         if(data.status === "error"){
    //             this.networkdataList.map((data2) => {
    //                 if(data2.name === data.name) return data2.errorCount+=1;
    //             })
    //         }
    //     })
        
    //     await this.networkdataList.map((data) => {
    //         if(data.errorCount === 3 & data.sendmailStatus === false){
    //             maillingModel.mailling("network error 발생",data.name+" network error 발생\n"+"신속한 조치 필요!! 담당 엔지니어 : 최기엽 연구원")
    //             return data.sendmailStatus=true;
    //         }
    //     })
    // }

    resetStatus = async () => {
        //web, service, network 메일링 조건(errorCount, sendmailStatus) 초기화 
        await this.webdataList.map((data) => {
            data.errorCount = 0;
            data.sendmailStatus = false;
            return data
        });
        await this.servicedataList.map((data) => {
            data.errorCount = 0;
            data.sendmailStatus = false;
            return data
        });
        await this.networkdataList.map((data) => {
            data.errorCount = 0;
            data.sendmailStatus = false;
            return data
        });
    }
}

module.exports = new mailling();