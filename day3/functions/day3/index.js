const tencentcloud = require("tencentcloud-sdk-nodejs");
const CaptchaClient = tencentcloud.captcha.v20190722.Client;
const models = tencentcloud.captcha.v20190722.Models;
const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

const key = require('key.json');

const tcb = require('@cloudbase/node-sdk')
const app = tcb.init({ env: 'env-yiqteppu' })
const auth = app.auth();
async function verify(req, client) {
    let promise = new Promise((resolve, reject) => {
        // 通过 client 对象调用想要访问的接口，需要传入请求对象以及响应回调函数
        client.DescribeCaptchaResult(req, function (errMsg, response) {
            // 请求异常返回，打印异常信息
            if (errMsg) {
                console.log("errMsg:", errMsg);
                reject(errMsg);
            }
            // 请求正常返回，打印 response 对象
            let r = response.to_json_string();
            console.log("R:", r);
            resolve(response);
        });
    });
    return promise;

}

// 返回输入参数
exports.main = async (event) => {
    console.log('Hello World')
    const ip = auth.getClientIP() // string

    //https://console.cloud.tencent.com/api/explorer?Product=captcha&Version=2019-07-22&Action=DescribeCaptchaResult&SignVersion=
    let cred = new Credential(key.secretId, key.secretKey);
    let httpProfile = new HttpProfile();
    httpProfile.endpoint = "captcha.tencentcloudapi.com";
    let clientProfile = new ClientProfile();
    clientProfile.httpProfile = httpProfile;
    let client = new CaptchaClient(cred, "ap-shanghai", clientProfile);

    // 实例化一个请求对象
    let req = new models.DescribeCaptchaResultRequest();
    console.log("test1");

    let params = {
        "CaptchaType": 9,
        "Ticket": event.ticket,
        "UserIp": ip,
        "Randstr": event.randstr,
        "CaptchaAppId": key.captchaAppId,
        "AppSecretKey": key.appSecretKey,
    }

    req.deserialize(params);
    console.log("params:", params);

    // 通过 client 对象调用想要访问的接口，需要传入请求对象以及响应回调函数
    // client.DescribeCaptchaResult(req, function (errMsg, response) {
    //     // 请求异常返回，打印异常信息
    //     if (errMsg) {
    //         console.log("errMsg:", errMsg);
    //         return errMsg;
    //     }
    //     // 请求正常返回，打印 response 对象
    //     let r = response.to_json_string();
    //     console.log("R:", r);
    //     return r;
    // });

    let r = await verify(req, client);
    return r;


    // return { "ss": "??" }
}
