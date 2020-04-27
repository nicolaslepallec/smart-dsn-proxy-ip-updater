var axios = require('axios');
var fs = require('fs');
var path = './publicIP.json';
var logpath = './publicIPlog.log'
var smartDNSAPI = "http://www.smartdnsproxy.com/api/IP/update/e217a99a6a354e0?ip=";

function check(){
    axios.get('http://api6.ipify.org/?format=json')
    .then(response => {
        d=new Date();
        console.log(d.toUTCString()+" public IP is " + response.data.ip);
        //check if IP has changed
        if (checkIP(response.data.ip)) {
            //update IP
            updateIP(response.data.ip);
        } else {
            //do nothing
            console.log("We do nothing");
        }
    })
    .catch(error => {
        console.error(error);
    });
}

    

    function checkIP(previousIP) {

        if (fs.existsSync(path)) {
            //file exists
            let fileData = JSON.parse(fs.readFileSync(path));
            console.log("previous IP is " + fileData.ip);
            if (fileData.ip != previousIP) {
                return true;
            } else {
                return false;
            }
        }

        else {
            //file does not exist 
            //create file
            createFile(previousIP);
            return true;

        }
    }
    function createFile(ip) {
        var ipdata = {
            ip: ip
        }
        let data = JSON.stringify(ipdata);
        fs.writeFileSync(path, data);
        console.log('IP Saved locally : ' + ip);
    }
    
    function updateIP(newIP) {
        axios({
            method: 'get',
            url: smartDNSAPI + newIP,
            responseType: 'document'
        })
            .then(response => {
                console.log("SMART DNS API RESPONSE" + JSON.stringify(response.data));
                //check if success
                let d=new Date();
                console.log("Status :" + response.data.Status);
                if (response.data.Status == "0") {
                    createFile(newIP);
                } else {
                    console.error(d.toUTCString()+' API update failed for new IP: '+response.data.Status);
                }

            })
            .catch(error => {
                console.error(error);
            });

    }

exports.check=check;

